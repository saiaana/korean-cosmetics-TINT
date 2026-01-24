# Database Documentation

## General Information

Database: **PostgreSQL**

Connection is configured via environment variables in `backend/.env`.

---

## Tables

### users

Stores user information.

**Structure:**

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid VARCHAR(255) UNIQUE NOT NULL,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'manager', 'admin')),
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Relationships:**

- `users.id` → `orders.user_id` (one to many)
- `users.id` → `cart_items.user_id` (one to many)

**Indexes:**

- `firebase_uid` - unique index

---

### catalog

Main products table.

**Structure:**

```sql
CREATE TABLE catalog (
  id BIGINT PRIMARY KEY,
  title TEXT,
  brand TEXT,
  price NUMERIC(10, 2),
  product_category TEXT,
  category_id BIGINT REFERENCES categories(id),
  additional_category TEXT,
  additional_category_id BIGINT REFERENCES categories(id),
  product_type TEXT,
  description TEXT,
  how_to_use TEXT,
  volume TEXT,
  ingredients TEXT,
  stock SMALLINT, -- NULL if has_variants is true
  has_variants BOOLEAN DEFAULT false,
  on_sale BOOLEAN DEFAULT false,
  discount_percent INTEGER DEFAULT NULL,
  bestseller BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Relationships:**

- `catalog.id` → `catalog_images.catalog_id` (one to many)
- `catalog.id` → `product_variants.product_id` (one to many)
- `catalog.id` → `cart_items.product_id` (one to many)
- `catalog.id` → `order_items.product_id` (one to many)
- `catalog.category_id` → `categories.id` (many to one)
- `catalog.additional_category_id` → `categories.id` (many to one)

**Computed Fields:**

- `finalPrice` - calculated on frontend: `on_sale ? price * (1 - discount_percent / 100) : price`

---

### catalog_images

Product images.

**Structure:**

```sql
CREATE TABLE catalog_images (
  id BIGINT PRIMARY KEY,
  catalog_id BIGINT NOT NULL REFERENCES catalog(id) ON DELETE CASCADE,
  url TEXT,
  is_main BOOLEAN DEFAULT false,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Relationships:**

- `catalog_images.catalog_id` → `catalog.id` (many to one)

**Features:**

- `is_main = true` - main product image
- `position` - display order

---

### product_variants

Product variants (sizes, volumes, etc.).

**Structure:**

```sql
CREATE TABLE product_variants (
  id BIGINT PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES catalog(id) ON DELETE CASCADE,
  variant_title TEXT,
  variant_price NUMERIC(10, 2),
  variant_stock INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Relationships:**

- `product_variants.product_id` → `catalog.id` (many to one)
- `product_variants.id` → `variant_images.variant_id` (one to many)
- `product_variants.id` → `cart_items.variant_id` (one to many)
- `product_variants.id` → `order_items.variant_id` (one to many)

---

### variant_images

Product variant images.

**Structure:**

```sql
CREATE TABLE variant_images (
  id BIGINT PRIMARY KEY,
  variant_id BIGINT NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  url TEXT,
  is_main BOOLEAN DEFAULT false,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Relationships:**

- `variant_images.variant_id` → `product_variants.id` (many to one)

---

### categories

Product categories.

**Structure:**

```sql
CREATE TABLE categories (
  id BIGINT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL
);
```

---

### cart_items

User cart items.

**Structure:**

```sql
CREATE TABLE cart_items (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES catalog(id) ON DELETE CASCADE,
  variant_id BIGINT REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity BIGINT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Relationships:**

- `cart_items.user_id` → `users.id` (many to one)
- `cart_items.product_id` → `catalog.id` (many to one)
- `cart_items.variant_id` → `product_variants.id` (many to one, optional)

**Features:**

- Unique combination `(user_id, product_id, variant_id)` prevents duplicates
- If `variant_id IS NULL` - product without variant

---

### orders

User orders.

**Structure:**

```sql
CREATE TYPE order_status_enum AS ENUM (
  'created', 
  'pending', 
  'paid', 
  'cancelled', 
  'in progress', 
  'out for delivery', 
  'delivered'
);

CREATE TABLE orders (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total NUMERIC(10, 2) NOT NULL,
  address TEXT,
  city TEXT,
  status order_status_enum DEFAULT 'created',
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Relationships:**

- `orders.user_id` → `users.id` (many to one)
- `orders.id` → `order_items.order_id` (one to many)

**Order Statuses:**

Enum `order_status_enum` with the following values:

- `created` - order created
- `pending` - order pending processing
- `paid` - order paid
- `cancelled` - order cancelled
- `in progress` - order in progress
- `out for delivery` - order out for delivery
- `delivered` - order delivered

---

### order_items

Order items.

**Structure:**

```sql
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES catalog(id) ON DELETE CASCADE,
  variant_id BIGINT REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price NUMERIC(10, 2) NOT NULL
);
```

**Relationships:**

- `order_items.order_id` → `orders.id` (many to one)
- `order_items.product_id` → `catalog.id` (many to one)
- `order_items.variant_id` → `product_variants.id` (many to one, optional)

**Features:**

- `price` - price at the time of order (saved for history)
- `variant_id` can be `NULL` for products without variants

---

## Views

### products_with_images

View for simplifying product retrieval with images.

**Usage:**

```sql
SELECT * FROM products_with_images
WHERE product_category = 'anti-age';
```

**Description:**

- Combines `catalog` and `catalog_images` tables
- Aggregates images into JSON array
- Used in most product queries

**Note:** Code may use direct access to `catalog` and `catalog_images` tables via JOIN.

### admin_products_with_images

View similar to `products_with_images` but includes `is_active` column for admin use.

---

## Indexes

Recommended indexes for optimization:

```sql
-- users
CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);

-- catalog
CREATE INDEX idx_catalog_category ON catalog(product_category);
CREATE INDEX idx_catalog_brand ON catalog(brand);
CREATE INDEX idx_catalog_on_sale ON catalog(on_sale);
CREATE INDEX idx_catalog_bestseller ON catalog(bestseller);
CREATE INDEX idx_catalog_is_active ON catalog(is_active);

-- catalog_images
CREATE INDEX idx_catalog_images_catalog_id ON catalog_images(catalog_id);
CREATE INDEX idx_catalog_images_main ON catalog_images(catalog_id, is_main) WHERE is_main = true;

-- product_variants
CREATE INDEX idx_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_variants_is_active ON product_variants(is_active);

-- cart_items
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);

-- orders
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
```

---

## Transactions

### Creating Order

Order creation is performed in a transaction:

```sql
BEGIN;
  -- 1. Get/create user
  -- 2. Create order
  INSERT INTO orders ...;
  -- 3. Create order items
  INSERT INTO order_items ...;
  -- 4. Update stock
  UPDATE catalog SET stock = stock - quantity WHERE id = ...;
  UPDATE product_variants SET variant_stock = variant_stock - quantity WHERE id = ...;
COMMIT;
```

**Rollback on error:**

```sql
ROLLBACK;
```

---

## Stock Management

### Decreasing Stock After Order

When creating an order, stock of products/variants is automatically decreased:

**For product without variant:**

```sql
UPDATE catalog
SET stock = GREATEST(0, stock - $1)
WHERE id = $2;
```

**For product variant:**

```sql
UPDATE product_variants
SET variant_stock = GREATEST(0, variant_stock - $1)
WHERE id = $2;
```

`GREATEST(0, ...)` prevents negative stock values.

---

## Migrations

Migrations are executed via script:

```bash
npm run migrate
```

**File:** `backend/scripts/runMigrations.js`

---

## Backup

It is recommended to set up automatic database backup:

```bash
pg_dump -U username -d database_name > backup.sql
```

---

## Optimization

### Connection Pooling

Connection pooling is used via `pg.Pool`:

```javascript
const pool = new Pool({
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT),
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});
```

### Paginated Queries

All product lists use pagination:

```sql
SELECT * FROM catalog
WHERE product_category = $1
ORDER BY id DESC
LIMIT $2 OFFSET $3;
```

### Image Aggregation

Images are aggregated via `json_agg`:

```sql
json_agg(
  json_build_object('url', img.url, 'is_main', img.is_main, 'position', img.position)
  ORDER BY img.position, img.is_main DESC
) FILTER (WHERE img.url IS NOT NULL)
```

---

## Environment Variables

```env
PG_HOST=localhost
PG_PORT=5432
PG_USER=your_username
PG_PASSWORD=your_password
PG_DATABASE=your_database_name
```
