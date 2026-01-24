import db from "../db.js";

export async function findCartItemsByUserId(userId) {
  const res = await db.query(
    `
    SELECT
      ci.product_id,
      ci.variant_id,
      ci.quantity,
      p.id,
      p.title,
      p.price,
      p.brand,
      p.product_category,
      p.on_sale,
      p.discount_percent,
      p.description,
      p.how_to_use,
      p.volume,
      p.stock,
      p.ingridients,
      p.is_active as product_is_active,
      COALESCE(
        json_agg(
          json_build_object(
            'url', img.url,
            'is_main', img.is_main,
            'position', img.position
          )
          ORDER BY img.position, img.is_main DESC
        ) FILTER (WHERE img.url IS NOT NULL),
        '[]'::json
      ) as images,
      CASE
        WHEN ci.variant_id IS NOT NULL THEN
          COALESCE(
            json_agg(
              json_build_object(
                'url', vi.url,
                'is_main', vi.is_main,
                'position', vi.position
              )
              ORDER BY vi.position, vi.is_main DESC
            ) FILTER (WHERE vi.url IS NOT NULL),
            '[]'::json
          )
        ELSE '[]'::json
      END as variant_images,
      pv.variant_title,
      pv.variant_price,
      pv.variant_stock,
      pv.is_active as variant_is_active
    FROM cart_items ci
    JOIN catalog p ON p.id = ci.product_id
    LEFT JOIN catalog_images img ON img.catalog_id = p.id
    LEFT JOIN product_variants pv ON pv.id = ci.variant_id
    LEFT JOIN variant_images vi ON vi.variant_id = ci.variant_id
    WHERE ci.user_id = $1
    GROUP BY ci.product_id, ci.variant_id, ci.quantity, p.id, p.title, p.price, p.brand,
             p.product_category, p.on_sale, p.discount_percent,
             p.description, p.how_to_use, p.volume, p.ingridients, p.stock, p.is_active,
             pv.variant_title, pv.variant_price, pv.variant_stock, pv.is_active, ci.created_at
    ORDER BY ci.created_at DESC
    `,
    [userId],
  );
  return res.rows;
}

export async function findCartItem(userId, productId, variantId = null) {
  if (variantId) {
    const res = await db.query(
      `
      SELECT id, quantity FROM cart_items
      WHERE user_id = $1 AND product_id = $2 AND variant_id = $3
      `,
      [userId, productId, variantId],
    );
    return res.rows[0] || null;
  } else {
    const res = await db.query(
      `
      SELECT id, quantity FROM cart_items
      WHERE user_id = $1 AND product_id = $2 AND variant_id IS NULL
      `,
      [userId, productId],
    );
    return res.rows[0] || null;
  }
}

export async function addCartItem(userId, productId, variantId, quantity) {
  if (variantId) {
    await db.query(
      `
      INSERT INTO cart_items (user_id, product_id, variant_id, quantity)
      VALUES ($1, $2, $3, $4)
      `,
      [userId, productId, variantId, quantity],
    );
  } else {
    await db.query(
      `
      INSERT INTO cart_items (user_id, product_id, quantity)
      VALUES ($1, $2, $3)
      `,
      [userId, productId, quantity],
    );
  }
}

export async function updateCartItemQuantity(
  userId,
  productId,
  variantId,
  quantity,
) {
  if (variantId) {
    await db.query(
      `
      UPDATE cart_items
      SET quantity = quantity + $1, updated_at = NOW()
      WHERE user_id = $2 AND product_id = $3 AND variant_id = $4
      `,
      [quantity, userId, productId, variantId],
    );
  } else {
    await db.query(
      `
      UPDATE cart_items
      SET quantity = quantity + $1, updated_at = NOW()
      WHERE user_id = $2 AND product_id = $3 AND variant_id IS NULL
      `,
      [quantity, userId, productId],
    );
  }
}

export async function setCartItemQuantity(
  userId,
  productId,
  variantId,
  quantity,
) {
  if (variantId) {
    await db.query(
      `
      UPDATE cart_items
      SET quantity = $1, updated_at = NOW()
      WHERE user_id = $2 AND product_id = $3 AND variant_id = $4
      `,
      [quantity, userId, productId, variantId],
    );
  } else {
    await db.query(
      `
      UPDATE cart_items
      SET quantity = $1, updated_at = NOW()
      WHERE user_id = $2 AND product_id = $3 AND variant_id IS NULL
      `,
      [quantity, userId, productId],
    );
  }
}

export async function deleteCartItem(userId, productId, variantId = null) {
  if (variantId) {
    await db.query(
      "DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2 AND variant_id = $3",
      [userId, productId, variantId],
    );
  } else {
    await db.query(
      "DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2 AND variant_id IS NULL",
      [userId, productId],
    );
  }
}

export async function clearCartItems(userId) {
  await db.query("DELETE FROM cart_items WHERE user_id = $1", [userId]);
}

export async function mergeCartItem(
  client,
  userId,
  productId,
  variantId,
  quantity,
) {
  if (variantId) {
    const existingItem = await findCartItemWithClient(
      client,
      userId,
      productId,
      variantId,
    );
    if (existingItem) {
      await updateCartItemQuantityWithClient(
        client,
        userId,
        productId,
        variantId,
        quantity,
      );
    } else {
      await addCartItemWithClient(
        client,
        userId,
        productId,
        variantId,
        quantity,
      );
    }
  } else {
    const existingItem = await findCartItemWithClient(
      client,
      userId,
      productId,
      null,
    );
    if (existingItem) {
      await updateCartItemQuantityWithClient(
        client,
        userId,
        productId,
        null,
        quantity,
      );
    } else {
      await addCartItemWithClient(client, userId, productId, null, quantity);
    }
  }
}

async function findCartItemWithClient(client, userId, productId, variantId) {
  if (variantId) {
    const res = await client.query(
      `
      SELECT id, quantity FROM cart_items
      WHERE user_id = $1 AND product_id = $2 AND variant_id = $3
      `,
      [userId, productId, variantId],
    );
    return res.rows[0] || null;
  } else {
    const res = await client.query(
      `
      SELECT id, quantity FROM cart_items
      WHERE user_id = $1 AND product_id = $2 AND variant_id IS NULL
      `,
      [userId, productId],
    );
    return res.rows[0] || null;
  }
}

async function addCartItemWithClient(
  client,
  userId,
  productId,
  variantId,
  quantity,
) {
  if (variantId) {
    await client.query(
      `
      INSERT INTO cart_items (user_id, product_id, variant_id, quantity)
      VALUES ($1, $2, $3, $4)
      `,
      [userId, productId, variantId, quantity],
    );
  } else {
    await client.query(
      `
      INSERT INTO cart_items (user_id, product_id, quantity)
      VALUES ($1, $2, $3)
      `,
      [userId, productId, quantity],
    );
  }
}

async function updateCartItemQuantityWithClient(
  client,
  userId,
  productId,
  variantId,
  quantity,
) {
  if (variantId) {
    await client.query(
      `
      UPDATE cart_items
      SET quantity = quantity + $1, updated_at = NOW()
      WHERE user_id = $2 AND product_id = $3 AND variant_id = $4
      `,
      [quantity, userId, productId, variantId],
    );
  } else {
    await client.query(
      `
      UPDATE cart_items
      SET quantity = quantity + $1, updated_at = NOW()
      WHERE user_id = $2 AND product_id = $3 AND variant_id IS NULL
      `,
      [quantity, userId, productId],
    );
  }
}
