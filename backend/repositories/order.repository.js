import db from "../db.js";

export async function findOrderById(orderId) {
  const res = await db.query(
    `
    SELECT o.*, u.first_name, u.last_name, u.email
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    WHERE o.id = $1
    `,
    [orderId],
  );

  return res.rows[0] || null;
}

export async function findOrderItems(orderId) {
  const res = await db.query(
    `
    SELECT 
      oi.product_id,
      oi.variant_id,
      c.title,
      oi.quantity,
      oi.price AS final_price,
      c.product_category,
      c.on_sale,
      c.discount_percent,
      c.price AS original_price,
      CASE 
        WHEN oi.variant_id IS NOT NULL THEN
          COALESCE(
            (SELECT vi.url 
             FROM variant_images vi 
             WHERE vi.variant_id = oi.variant_id AND vi.is_main = true 
             LIMIT 1),
            (SELECT vi.url 
             FROM variant_images vi 
             WHERE vi.variant_id = oi.variant_id 
             ORDER BY vi.position ASC, vi.created_at ASC 
             LIMIT 1),
            ci.url
          )
        ELSE ci.url
      END AS image_url,
      pv.variant_title,
      pv.variant_price
    FROM order_items oi
    JOIN catalog c ON oi.product_id = c.id
    LEFT JOIN catalog_images ci
      ON ci.catalog_id = c.id AND ci.is_main = true
    LEFT JOIN product_variants pv ON pv.id = oi.variant_id
    WHERE oi.order_id = $1
    `,
    [orderId],
  );

  return res.rows;
}

export async function findOrdersByUserId(userId) {
  const res = await db.query(
    `
    SELECT *
    FROM orders
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
    [userId],
  );

  return res.rows;
}

export async function createOrder(client, userId, total, address, city) {
  const res = await client.query(
    `
    INSERT INTO orders (user_id, total, address, city, status)
    VALUES ($1, $2, $3, $4, 'created')
    RETURNING id
    `,
    [userId, total, address, city],
  );

  return res.rows[0].id;
}

export async function createOrderItems(client, orderId, items) {
  for (const item of items) {
    console.log("Creating order item:", {
      orderId,
      productId: item.id,
      variantId: item.variantId,
      quantity: item.quantity,
      price: item.price,
    });

    if (item.variantId) {
      await client.query(
        `
        INSERT INTO order_items (order_id, product_id, variant_id, quantity, price)
        VALUES ($1, $2, $3, $4, $5)
        `,
        [orderId, item.id, item.variantId, item.quantity, item.price],
      );
    } else {
      await client.query(
        `
        INSERT INTO order_items (order_id, product_id, variant_id, quantity, price)
        VALUES ($1, $2, NULL, $3, $4)
        `,
        [orderId, item.id, item.quantity, item.price],
      );
    }
  }
}

export async function updateStockAfterOrder(client, items) {
  for (const item of items) {
    const quantity = Number(item.quantity);
    const productId = item.id;
    const variantId = item.variantId;

    if (variantId) {
      await client.query(
        `
        UPDATE product_variants
        SET variant_stock = GREATEST(0, variant_stock - $1)
        WHERE id = $2
        `,
        [quantity, variantId],
      );
    } else {
      await client.query(
        `
        UPDATE catalog
        SET stock = GREATEST(0, stock - $1)
        WHERE id = $2
        `,
        [quantity, productId],
      );
    }
  }
}
