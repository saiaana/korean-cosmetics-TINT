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
  const res = await db.query(
    `
    SELECT DISTINCT brand
    FROM products_with_images
    ORDER BY brand
    `,
  );

  return res.rows.map((row) => row.brand);
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
