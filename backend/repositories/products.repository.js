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
    "product_category = $1 OR additional_category = $1",
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

    await client.query("COMMIT");
    return product;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
