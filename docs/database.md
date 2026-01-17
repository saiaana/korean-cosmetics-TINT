# Документация базы данных

## Общая информация

База данных: **PostgreSQL**

Подключение настраивается через переменные окружения в `backend/.env`.

---

## Таблицы

### users

Хранит информацию о пользователях.

**Структура:**

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  firebase_uid VARCHAR(255) UNIQUE NOT NULL,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Связи:**

- `users.id` → `orders.user_id` (один ко многим)
- `users.id` → `cart_items.user_id` (один ко многим)

**Индексы:**

- `firebase_uid` - уникальный индекс

---

### catalog

Основная таблица товаров.

**Структура:**

```sql
CREATE TABLE catalog (
  id BIGINT PRIMARY KEY,
  title TEXT,
  brand TEXT,
  price SMALLINT,
  product_category TEXT,
  category_id BIGINT REFERENCES categories(id),
  additional_category TEXT,
  additional_category_id BIGINT REFERENCES categories(id),
  product_type TEXT,
  description TEXT,
  how_to_use TEXT,
  volume TEXT,
  ingridients TEXT,
  stock SMALLINT, -- NULL if has_variants is true
  has_variants BOOLEAN DEFAULT false,
  on_sale BOOLEAN DEFAULT false,
  discount_percent INTEGER DEFAULT NULL,
  bestseller BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Связи:**

- `catalog.id` → `catalog_images.catalog_id` (один ко многим)
- `catalog.id` → `product_variants.product_id` (один ко многим)
- `catalog.id` → `cart_items.product_id` (один ко многим)
- `catalog.id` → `order_items.product_id` (один ко многим)
- `catalog.category_id` → `categories.id` (многие к одному)
- `catalog.additional_category_id` → `categories.id` (многие к одному)

**Вычисляемые поля:**

- `finalPrice` - рассчитывается на фронтенде: `on_sale ? price * (1 - discount_percent / 100) : price`

---

### catalog_images

Изображения товаров.

**Структура:**

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

**Связи:**

- `catalog_images.catalog_id` → `catalog.id` (многие к одному)

**Особенности:**

- `is_main = true` - главное изображение товара
- `position` - порядок отображения

---

### product_variants

Варианты товаров (размеры, объемы и т.д.).

**Структура:**

```sql
CREATE TABLE product_variants (
  id BIGINT PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES catalog(id) ON DELETE CASCADE,
  variant_title TEXT,
  variant_price INTEGER,
  variant_stock INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Связи:**

- `product_variants.product_id` → `catalog.id` (многие к одному)
- `product_variants.id` → `variant_images.variant_id` (один ко многим)
- `product_variants.id` → `cart_items.variant_id` (один ко многим)
- `product_variants.id` → `order_items.variant_id` (один ко многим)

---

### variant_images

Изображения вариантов товаров.

**Структура:**

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

**Связи:**

- `variant_images.variant_id` → `product_variants.id` (многие к одному)

---

### categories

Категории товаров.

**Структура:**

```sql
CREATE TABLE categories (
  id BIGINT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL
);
```

---

### cart_items

Элементы корзины пользователей.

**Структура:**

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

**Связи:**

- `cart_items.user_id` → `users.id` (многие к одному)
- `cart_items.product_id` → `catalog.id` (многие к одному)
- `cart_items.variant_id` → `product_variants.id` (многие к одному, опционально)

**Особенности:**

- Уникальная комбинация `(user_id, product_id, variant_id)` предотвращает дубликаты
- Если `variant_id IS NULL` - товар без варианта

---

### orders

Заказы пользователей.

**Структура:**

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
  total INTEGER NOT NULL,
  address TEXT,
  city TEXT,
  status order_status_enum DEFAULT 'created',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Связи:**

- `orders.user_id` → `users.id` (многие к одному)
- `orders.id` → `order_items.order_id` (один ко многим)

**Статусы заказа:**

Enum `order_status_enum` со следующими значениями:

- `created` - заказ создан
- `pending` - заказ ожидает обработки
- `paid` - заказ оплачен
- `cancelled` - заказ отменен
- `in progress` - заказ в обработке
- `out for delivery` - заказ в доставке
- `delivered` - заказ доставлен

---

### order_items

Элементы заказа.

**Структура:**

```sql
CREATE TABLE order_items (
  id INTEGER PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES catalog(id) ON DELETE CASCADE,
  variant_id BIGINT REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price BIGINT NOT NULL
);
```

**Связи:**

- `order_items.order_id` → `orders.id` (многие к одному)
- `order_items.product_id` → `catalog.id` (многие к одному)
- `order_items.variant_id` → `product_variants.id` (многие к одному, опционально)

**Особенности:**

- `price` - цена на момент заказа (сохраняется для истории)
- `variant_id` может быть `NULL` для товаров без вариантов

---

## Представления (Views)

### products_with_images

Представление для упрощения получения товаров с изображениями.

**Использование:**

```sql
SELECT * FROM products_with_images
WHERE product_category = 'anti-age';
```

**Описание:**

- Объединяет таблицы `catalog` и `catalog_images`
- Агрегирует изображения в JSON массив
- Используется в большинстве запросов товаров

**Примечание:** В коде может использоваться прямое обращение к таблицам `catalog` и `catalog_images` через JOIN.

---

## Индексы

Рекомендуемые индексы для оптимизации:

```sql
-- users
CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);

-- catalog
CREATE INDEX idx_catalog_category ON catalog(product_category);
CREATE INDEX idx_catalog_brand ON catalog(brand);
CREATE INDEX idx_catalog_on_sale ON catalog(on_sale);
CREATE INDEX idx_catalog_bestseller ON catalog(bestseller);

-- catalog_images
CREATE INDEX idx_catalog_images_catalog_id ON catalog_images(catalog_id);
CREATE INDEX idx_catalog_images_main ON catalog_images(catalog_id, is_main) WHERE is_main = true;

-- product_variants
CREATE INDEX idx_variants_product_id ON product_variants(product_id);

-- cart_items
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);

-- orders
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
```

---

## Транзакции

### Создание заказа

Создание заказа выполняется в транзакции:

```sql
BEGIN;
  -- 1. Получение/создание пользователя
  -- 2. Создание заказа
  INSERT INTO orders ...;
  -- 3. Создание элементов заказа
  INSERT INTO order_items ...;
  -- 4. Обновление stock
  UPDATE catalog SET stock = stock - quantity WHERE id = ...;
  UPDATE product_variants SET variant_stock = variant_stock - quantity WHERE id = ...;
COMMIT;
```

**Откат при ошибке:**

```sql
ROLLBACK;
```

---

## Управление stock (остатками)

### Уменьшение stock после заказа

При создании заказа автоматически уменьшается stock товаров/вариантов:

**Для товара без варианта:**

```sql
UPDATE catalog
SET stock = GREATEST(0, stock - $1)
WHERE id = $2;
```

**Для варианта товара:**

```sql
UPDATE product_variants
SET variant_stock = GREATEST(0, variant_stock - $1)
WHERE id = $2;
```

`GREATEST(0, ...)` предотвращает отрицательные значения stock.

---

## Миграции

Миграции выполняются через скрипт:

```bash
npm run migrate
```

**Файл:** `backend/scripts/runMigrations.js`

---

## Синхронизация изображений


**Скрипт:** `backend/scripts/syncCatalogImages.js`

**Процесс:**

1. Получение списка файлов из `catalog_images`
2. Парсинг имени файла: `{catalog_id}_{position}.{ext}`
3. Upsert в таблицу `catalog_images`

**Запуск:**

```bash
node backend/scripts/syncCatalogImages.js
```

---

## Резервное копирование

Рекомендуется настроить автоматическое резервное копирование базы данных:

```bash
pg_dump -U username -d database_name > backup.sql
```

---

## Оптимизация

### Connection Pooling

Используется connection pooling через `pg.Pool`:

```javascript
const pool = new Pool({
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT),
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});
```

### Запросы с пагинацией

Все списки товаров используют пагинацию:

```sql
SELECT * FROM catalog
WHERE product_category = $1
ORDER BY id DESC
LIMIT $2 OFFSET $3;
```

### Агрегация изображений

Изображения агрегируются через `json_agg`:

```sql
json_agg(
  json_build_object('url', img.url, 'is_main', img.is_main, 'position', img.position)
  ORDER BY img.position, img.is_main DESC
) FILTER (WHERE img.url IS NOT NULL)
```

---

## Переменные окружения

```env
PG_HOST=localhost
PG_PORT=5432
PG_USER=your_username
PG_PASSWORD=your_password
PG_DATABASE=your_database_name
```
