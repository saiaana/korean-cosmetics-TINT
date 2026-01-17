import db from "../db.js";

export async function findProductById(productId) {
  const res = await db.query(`SELECT * FROM catalog WHERE id = $1`, [
    productId,
  ]);

  return res.rows[0] || null;
}

export async function findVariantsWithImagesByProductId(productId) {
  const res = await db.query(
    `
    SELECT
      v.*,
      COALESCE(
        json_agg(vi.* ORDER BY vi.position, vi.created_at)
          FILTER (WHERE vi.id IS NOT NULL),
        '[]'
      ) AS images
    FROM product_variants v
    LEFT JOIN variant_images vi ON vi.variant_id = v.id
    WHERE v.product_id = $1
    GROUP BY v.id
    ORDER BY v.created_at ASC
    `,
    [productId],
  );

  return res.rows;
}
