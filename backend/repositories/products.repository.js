import db from "../db.js";

async function findProductsWithPagination(
  whereClause,
  params,
  orderBy = "id DESC",
  page = 1,
  limit = 12,
) {
  const offset = (page - 1) * limit;
  const where = whereClause ? `WHERE ${whereClause}` : "";

  const itemsQuery = db.query(
    `
    SELECT *
    FROM products_with_images
    ${where}
    ORDER BY ${orderBy}
    LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `,
    [...params, limit, offset],
  );

  const countQuery = db.query(
    `
    SELECT COUNT(*)
    FROM products_with_images
    ${where}
    `,
    params,
  );

  const [itemsResult, countResult] = await Promise.all([
    itemsQuery,
    countQuery,
  ]);

  const total = Number(countResult.rows[0].count);
  const hasMore = total > offset + limit;

  return {
    products: itemsResult.rows,
    total,
    hasMore,
  };
}

export async function findAllProducts(limit = 200) {
  const res = await db.query(
    `
    SELECT *
    FROM products_with_images
    ORDER BY id DESC
    LIMIT $1
    `,
    [limit],
  );

  return res.rows;
}

export async function findAllAdminProducts(limit = 200) {
  const res = await db.query(
    `
    SELECT *
    FROM admin_products_with_images
    ORDER BY id DESC
    LIMIT $1
    `,
    [limit],
  );

  return res.rows;
}

export async function findAdminProductById(productId) {
  const res = await db.query(
    `
    SELECT *
    FROM admin_products_with_images
    WHERE id = $1
    `,
    [productId],
  );

  return res.rows[0] || null;
}

export async function updateProductActiveStatus(productId, isActive) {
  const res = await db.query(
    `
    UPDATE catalog
    SET is_active = $1
    WHERE id = $2
    RETURNING *
    `,
    [isActive, productId],
  );

  return res.rows[0];
}

export async function findAllBrands() {
  try {
    const res = await db.query(`
      SELECT brand
      FROM public.products_with_images
      WHERE brand IS NOT NULL
      GROUP BY brand
      ORDER BY LOWER(brand)
    `);
    return res.rows.map((row) => row.brand);
  } catch (err) {
    console.error("❌ ERROR IN findAllBrands:", err);
    throw err;
  }
}


export async function findProductsByCategory(category, page = 1, limit = 12) {
  return findProductsWithPagination(
    "(product_category = $1 OR additional_category = $1)",
    [category],
    "id DESC",
    page,
    limit,
  );
}

export async function findProductsByBrand(brand, page = 1, limit = 12) {
  return findProductsWithPagination(
    "brand = $1",
    [brand],
    "id DESC",
    page,
    limit,
  );
}

export async function findNewProducts(page = 1, limit = 12) {
  return findProductsWithPagination(null, [], "created_at DESC", page, limit);
}

export async function findOnSaleProducts(page = 1, limit = 12) {
  return findProductsWithPagination(
    "on_sale = true",
    [],
    "id DESC",
    page,
    limit,
  );
}

export async function findBestsellerProducts(page = 1, limit = 12) {
  return findProductsWithPagination(
    "bestseller = true",
    [],
    "id DESC",
    page,
    limit,
  );
}

export async function findProductById(id) {
  const res = await db.query(
    `
    SELECT *
    FROM products_with_images
    WHERE id = $1
    `,
    [id],
  );

  return res.rows[0] || null;
}

export async function findProductBySlug(slug) {
  if (!slug) return null;

  const id = parseInt(slug.split("-")[0], 10);
  if (Number.isNaN(id)) return null;

  const res = await db.query(
    `
    SELECT *
    FROM products_with_images
    WHERE id = $1
    `,
    [id],
  );

  return res.rows[0] || null;
}

export async function searchProducts(search) {
  const res = await db.query(
    `
    SELECT *
    FROM products_with_images
    WHERE title ILIKE $1
       OR brand ILIKE $1
       OR product_category ILIKE $1
       OR additional_category ILIKE $1
       OR product_type ILIKE $1
    ORDER BY title
    LIMIT 20
    `,
    [`%${search}%`],
  );

  return res.rows;
}

export async function findSimilarProducts(
  category,
  brand,
  excludeId,
  limit = 10,
) {
  const res = await db.query(
    `
    SELECT *
    FROM products_with_images
    WHERE (product_category = $1 OR brand = $2)
      AND id <> $3
    ORDER BY id DESC
    LIMIT $4
    `,
    [category, brand, excludeId, limit],
  );

  return res.rows;
}

export async function findCategoriesList() {
  const res = await db.query(
    `
      SELECT *
      FROM categories
      ORDER BY id
      `,
  );

  return res.rows;
}

export async function createProduct(productData) {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    // Получаем максимальный ID и увеличиваем на 1
    const maxIdResult = await client.query("SELECT COALESCE(MAX(id), 0) as max_id FROM catalog");
    const productId = Number(maxIdResult.rows[0].max_id) + 1;

    // Вставляем товар
    const insertResult = await client.query(
      `
      INSERT INTO catalog (
        id, title, brand, price, product_category, category_id,
        additional_category, additional_category_id, product_type,
        description, how_to_use, volume, ingridients, stock,
        has_variants, on_sale, discount_percent, bestseller
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
      )
      RETURNING *
      `,
      [
        productId,
        productData.title,
        productData.brand,
        productData.price, 
        productData.product_category,
        productData.category_id || null,
        productData.additional_category || null,
        productData.additional_category_id || null,
        productData.product_type || null,
        productData.description || null,
        productData.how_to_use || null,
        productData.volume || null,
        productData.ingridients || null,
        productData.has_variants ? null : (productData.stock || 0),
        productData.has_variants || false,
        productData.on_sale || false,
        productData.discount_percent || null,
        productData.bestseller || false,
      ],
    );

    const product = insertResult.rows[0];

    // Добавляем изображения, если они есть
    if (productData.images && Array.isArray(productData.images) && productData.images.length > 0) {
      for (let i = 0; i < productData.images.length; i++) {
        const image = productData.images[i];
        await client.query(
          `
          INSERT INTO catalog_images (catalog_id, url, is_main, position)
          VALUES ($1, $2, $3, $4)
          `,
          [
            productId,
            image.url,
            image.is_main || (i === 0), // Первое изображение - главное по умолчанию
            image.position || i,
          ],
        );
      }
    }

    // Добавляем варианты, если они есть
    if (productData.variants && Array.isArray(productData.variants) && productData.variants.length > 0) {
      for (const variant of productData.variants) {
        // Получаем максимальный ID для варианта
        const maxVariantIdResult = await client.query(
          "SELECT COALESCE(MAX(id), 0) as max_id FROM product_variants"
        );
        const variantId = Number(maxVariantIdResult.rows[0].max_id) + 1;

        // Вставляем вариант
        await client.query(
          `
          INSERT INTO product_variants (id, product_id, variant_title, variant_price, variant_stock)
          VALUES ($1, $2, $3, $4, $5)
          `,
          [
            variantId,
            productId,
            variant.variant_title,
            variant.variant_price, // цена в долларах
            variant.variant_stock,
          ],
        );

        // Добавляем изображения варианта, если они есть
        if (variant.images && Array.isArray(variant.images) && variant.images.length > 0) {
          for (let i = 0; i < variant.images.length; i++) {
            const image = variant.images[i];
            // Получаем максимальный ID для изображения варианта
            const maxImageIdResult = await client.query(
              "SELECT COALESCE(MAX(id), 0) as max_id FROM variant_images"
            );
            const imageId = Number(maxImageIdResult.rows[0].max_id) + 1;

            await client.query(
              `
              INSERT INTO variant_images (id, variant_id, url, is_main, position)
              VALUES ($1, $2, $3, $4, $5)
              `,
              [
                imageId,
                variantId,
                image.url,
                image.is_main || (i === 0),
                image.position || i,
              ],
            );
          }
        }
      }
    }

    await client.query("COMMIT");
    return product;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function updateProduct(productId, productData) {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    // Обновляем основные данные товара
    const updateResult = await client.query(
      `
      UPDATE catalog SET
        title = $1,
        brand = $2,
        price = $3,
        product_category = $4,
        category_id = $5,
        additional_category = $6,
        additional_category_id = $7,
        product_type = $8,
        description = $9,
        how_to_use = $10,
        volume = $11,
        ingridients = $12,
        stock = $13,
        has_variants = $14,
        on_sale = $15,
        discount_percent = $16,
        bestseller = $17
      WHERE id = $18
      RETURNING *
      `,
      [
        productData.title,
        productData.brand,
        productData.price,
        productData.product_category,
        productData.category_id || null,
        productData.additional_category || null,
        productData.additional_category_id || null,
        productData.product_type || null,
        productData.description || null,
        productData.how_to_use || null,
        productData.volume || null,
        productData.ingridients || null,
        productData.has_variants ? null : (productData.stock || 0),
        productData.has_variants || false,
        productData.on_sale || false,
        productData.discount_percent || null,
        productData.bestseller || false,
        productId,
      ],
    );

    const product = updateResult.rows[0];

    // Удаляем все старые изображения
    await client.query(
      `DELETE FROM catalog_images WHERE catalog_id = $1`,
      [productId]
    );

    // Добавляем новые изображения
    if (productData.images && Array.isArray(productData.images) && productData.images.length > 0) {
      for (let i = 0; i < productData.images.length; i++) {
        const image = productData.images[i];
        const maxImageIdResult = await client.query(
          "SELECT COALESCE(MAX(id), 0) as max_id FROM catalog_images"
        );
        const imageId = Number(maxImageIdResult.rows[0].max_id) + 1;

        await client.query(
          `
          INSERT INTO catalog_images (id, catalog_id, url, is_main, position)
          VALUES ($1, $2, $3, $4, $5)
          `,
          [
            imageId,
            productId,
            image.url,
            image.is_main || (i === 0),
            image.position || i,
          ],
        );
      }
    }

    // Получаем все старые варианты
    const oldVariantsResult = await client.query(
      `SELECT id FROM product_variants WHERE product_id = $1`,
      [productId]
    );
    
    // Удаляем только те варианты, которые не используются в корзине или заказах
    for (const variant of oldVariantsResult.rows) {
      // Проверяем, используется ли вариант в корзине
      const cartUsage = await client.query(
        `SELECT COUNT(*) as count FROM cart_items WHERE variant_id = $1`,
        [variant.id]
      );
      
      // Проверяем, используется ли вариант в заказах
      const orderUsage = await client.query(
        `SELECT COUNT(*) as count FROM order_items WHERE variant_id = $1`,
        [variant.id]
      );
      
      const isUsedInCart = parseInt(cartUsage.rows[0].count) > 0;
      const isUsedInOrders = parseInt(orderUsage.rows[0].count) > 0;
      
      // Удаляем только если вариант не используется
      if (!isUsedInCart && !isUsedInOrders) {
        // Удаляем изображения варианта
        await client.query(
          `DELETE FROM variant_images WHERE variant_id = $1`,
          [variant.id]
        );
        // Удаляем сам вариант
        await client.query(
          `DELETE FROM product_variants WHERE id = $1`,
          [variant.id]
        );
      }
    }

    // Добавляем новые варианты
    if (productData.variants && Array.isArray(productData.variants) && productData.variants.length > 0) {
      for (const variant of productData.variants) {
        const maxVariantIdResult = await client.query(
          "SELECT COALESCE(MAX(id), 0) as max_id FROM product_variants"
        );
        const variantId = Number(maxVariantIdResult.rows[0].max_id) + 1;

        await client.query(
          `
          INSERT INTO product_variants (id, product_id, variant_title, variant_price, variant_stock)
          VALUES ($1, $2, $3, $4, $5)
          `,
          [
            variantId,
            productId,
            variant.variant_title,
            variant.variant_price,
            variant.variant_stock,
          ],
        );

        // Добавляем изображения варианта
        if (variant.images && Array.isArray(variant.images) && variant.images.length > 0) {
          for (let i = 0; i < variant.images.length; i++) {
            const image = variant.images[i];
            const maxImageIdResult = await client.query(
              "SELECT COALESCE(MAX(id), 0) as max_id FROM variant_images"
            );
            const imageId = Number(maxImageIdResult.rows[0].max_id) + 1;

            await client.query(
              `
              INSERT INTO variant_images (id, variant_id, url, is_main, position)
              VALUES ($1, $2, $3, $4, $5)
              `,
              [
                imageId,
                variantId,
                image.url,
                image.is_main || (i === 0),
                image.position || i,
              ],
            );
          }
        }
      }
    }

    await client.query("COMMIT");
    return product;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
