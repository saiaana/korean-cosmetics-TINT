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

export async function findAllOrders() {
  const res = await db.query(
    `
    SELECT 
      o.id,
      o.total,
      o.status,
      o.address,
      o.city,
      o.created_at,
      u.id AS user_id,
      u.first_name,
      u.last_name,
      u.email,
      u.firebase_uid
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
    `,
  );

  return res.rows;
}

export async function updateOrderStatus(orderId, status) {
  const res = await db.query(
    `
    UPDATE orders
    SET status = $1
    WHERE id = $2
    RETURNING *
    `,
    [status, orderId],
  );

  return res.rows[0] || null;
}

export async function findPopularProductsLast12Months(limit = 10) {
  const res = await db.query(
    `
    SELECT 
      oi.product_id,
      oi.variant_id,
      c.title,
      c.brand,
      c.product_category,
      pv.variant_title,
      SUM(oi.quantity) as total_quantity,
      COUNT(DISTINCT oi.order_id) as order_count,
      SUM(oi.quantity * oi.price) as total_revenue,
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
            (SELECT ci.url 
             FROM catalog_images ci 
             WHERE ci.catalog_id = c.id AND ci.is_main = true 
             LIMIT 1),
            (SELECT ci.url 
             FROM catalog_images ci 
             WHERE ci.catalog_id = c.id 
             ORDER BY ci.position ASC, ci.created_at ASC 
             LIMIT 1)
          )
        ELSE
          COALESCE(
            (SELECT ci.url 
             FROM catalog_images ci 
             WHERE ci.catalog_id = c.id AND ci.is_main = true 
             LIMIT 1),
            (SELECT ci.url 
             FROM catalog_images ci 
             WHERE ci.catalog_id = c.id 
             ORDER BY ci.position ASC, ci.created_at ASC 
             LIMIT 1)
          )
      END as image_url
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.id
    JOIN catalog c ON oi.product_id = c.id
    LEFT JOIN product_variants pv ON pv.id = oi.variant_id
    WHERE o.created_at >= NOW() - INTERVAL '12 months'
      AND o.status != 'cancelled'
    GROUP BY oi.product_id, oi.variant_id, c.id, c.title, c.brand, c.product_category, pv.variant_title
    ORDER BY total_quantity DESC
    LIMIT $1
    `,
    [limit],
  );

  return res.rows;
}
