# API Документация

## Базовый URL

- **Development**: `http://localhost:4000`
- **Production**: Настраивается через переменную окружения

## Аутентификация

Большинство endpoints требуют аутентификации. Для защищенных запросов необходимо включить заголовок:

```
Authorization: Bearer <JWT_TOKEN>
```

JWT токен получается через Firebase Authentication на фронтенде.

---

## Products API

### Получить список всех категорий

```
GET /api/products/categoriesList
```

**Response:**

```json
[
  {
    "id": 1,
    "title": "Anti-Age",
    "slug": "anti-age"
  },
  {
    "id": 2,
    "title": "Foundation",
    "slug": "foundation"
  }
]
```

---

### Получить все бренды

```
GET /api/products/brands
```

**Response:**

```json
["Brand 1", "Brand 2", "Brand 3"]
```

---

### Получить товары по категории

```
GET /api/products/categories/:category?page=1&limit=12
```

**Parameters:**

- `category` (path) - название категории
- `page` (query, optional) - номер страницы (по умолчанию 1)
- `limit` (query, optional) - количество товаров на странице (по умолчанию 12)

**Response:**

```json
{
  "products": [
    {
      "id": 45,
      "title": "La'dor Real Intensive Acid Shampoo",
      "brand": "La'dor",
      "price": 15,
      "finalPrice": 15,
      "stock": 10,
      "has_variants": false,
      "on_sale": false,
      "discount_percent": 0,
      "bestseller": false,
      "product_category": "hair",
      "product_type": null,
      "category_id": null,
      "additional_category": null,
      "additional_category_id": null,
      "volume": "900 ml",
      "description": "Lador Real Intensive Acid Shampoo for dry and damaged hair rinses the scalp thoroughly...",
      "how_to_use": "Apply shampoo to damp scalp, distribute massaging motions, lather and rinse with water.",
      "ingridients": "Water, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Ammonium Laureth Sulfate",
      "images": [
        {
          "url": "image-url",
          "is_main": true,
          "position": 0
        }
      ],
      "created_at": "2024-01-03T12:39:38.482Z"
    }
  ],
  "page": 1,
  "hasMore": false
}
```

---

### Получить товары по бренду

```
GET /api/products/brands/:brand?page=1&limit=12
```

**Parameters:**

- `brand` (path) - название бренда
- `page` (query, optional) - номер страницы
- `limit` (query, optional) - количество товаров на странице

**Response:** Аналогично `/api/products/categories/:category`

---

### Получить новые товары

```
GET /api/products/new?page=1&limit=12
```

**Parameters:**

- `page` (query, optional) - номер страницы
- `limit` (query, optional) - количество товаров на странице

**Response:** Аналогично предыдущим endpoints

---

### Получить товары со скидкой

```
GET /api/products/on-sale?page=1&limit=12
```

**Parameters:**

- `page` (query, optional) - номер страницы
- `limit` (query, optional) - количество товаров на странице

**Response:** Аналогично предыдущим endpoints

---

### Получить хиты продаж

```
GET /api/products/bestsellers?page=1&limit=12
```

**Parameters:**

- `page` (query, optional) - номер страницы
- `limit` (query, optional) - количество товаров на странице

**Response:** Аналогично предыдущим endpoints

---

### Получить товар по slug

```
GET /api/products/slug/:slug
```

**Parameters:**

- `slug` (path) - slug товара (формат: `{id}-{title}`)

**Response:**

```json
    {
      "id": 45,
      "title": "La'dor Real Intensive Acid Shampoo",
      "brand": "La'dor",
      "price": 15,
      "finalPrice": 15,
      "stock": 10,
      "has_variants": false,
      "on_sale": false,
      "discount_percent": 0,
      "bestseller": false,
      "product_category": "hair",
      "product_type": null,
      "category_id": null,
      "additional_category": null,
      "additional_category_id": null,
      "volume": "900 ml",
      "description": "Lador Real Intensive Acid Shampoo for dry and damaged hair rinses the scalp thoroughly..",
      "how_to_use": "Apply shampoo to damp scalp, distribute massaging motions, lather and rinse with water.",
      "ingridients": "Water, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Ammonium Laureth Sulfate",
      "images": [
        {
          "url": "image-url",
          "is_main": true,
          "position": 0
        }
      ],
      "created_at": "2024-01-03T12:39:38.482Z"
    }
```

---


### Поиск товаров

```
GET /api/products/search?search=search+query
```

**Parameters:**

- `search` (query, required) - поисковый запрос (минимум 2 символа)

**Response:** Аналогично получению товара по slug

**Limit:** Максимум 20 результатов

---

### Получить похожие товары

```
GET /api/products/similar?category=anti-age&brand=brand-name&excludeId=1&limit=10
```

**Parameters:**

- `category` (query, required) - категория товара
- `brand` (query, required) - бренд товара
- `excludeId` (query, required) - ID товара для исключения
- `limit` (query, optional) - количество товаров (по умолчанию 10)

**Response:** Массив товаров

---

### Получить варианты товара

```
GET /api/products/:productId/variants
```

**Parameters:**

- `productId` (path) - ID товара

**Response:**

```json
[
  {
    "id": 1,
    "product_id": 1,
    "variant_title": "TAUPE",
    "variant_price": 29.99,
    "variant_stock": 10,
    "images": [
      {
        "id": 1,
        "url": "image-url",
        "is_main": true,
        "position": 1
      }
    ]
  }
]
```

---

## Cart API

### Получить корзину пользователя (гостевого или авторизованного)

```
GET /api/cart
Headers: Authorization: Bearer <token>
```

**Response:**

```json
[
  {
    "id": "45",
    "product_id": "45",
    "title": "La'dor Real Intensive Acid Shampoo",
    "brand": "La'dor",
    "description": "Lador Real Intensive Acid Shampoo for dry and damaged hair rinses the scalp thoroughly...",
    "how_to_use": "Apply shampoo to damp scalp, distribute massaging motions, lather and rinse with water.",
    "ingridients": "Water, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Ammonium Laureth Sulfate, Cocamide MEA",
    "product_category": "hair",
    "volume": "900 ml",
    "price": 15,
    "finalPrice": 15,
    "discount_percent": 0,
    "on_sale": false,
    "stock": 10,
    "quantity": 1,
    "images": [],
    "variant_id": null,
    "variant_title": null,
    "variant_price": null,
    "variant_stock": null,
    "variant_images": []
  }
]
```

---

### Добавить товар в корзину

```
POST /api/cart
Headers: Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": 1,
  "variantId": null,  // опционально
  "quantity": 1
}
```

**Response:**

```json
{
  "message": "Item added to cart"
}
```

---

### Обновить количество товара в корзине

```
PATCH /api/cart/:productId
Headers: Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 3,  // изменение количества (может быть отрицательным)
  "variantId": null  // опционально
}
```

**Parameters:**

- `productId` (path) - ID товара

**Response:**

```json
{
  "message": "Cart item updated"
}
```

---

### Удалить товар из корзины

```
DELETE /api/cart/:productId
Headers: Authorization: Bearer <token>
```

**Query Parameters:**

- `variantId` (optional) - ID варианта товара

**Response:**

```json
{
  "message": "Item removed from cart"
}
```

---

### Очистить корзину

```
DELETE /api/cart
Headers: Authorization: Bearer <token>
```

**Response:**

```json
{
  "message": "Cart cleared"
}
```

---

### Объединить гостевую корзину с пользовательской - товары добавленные в гостевом режиме объедияем с корзиной авторизованного пользователя (после регистрации или авторизации)

```
POST /api/cart/merge
Headers: Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "productId": 1,
      "variantId": null,
      "quantity": 2
    }
  ]
}
```

**Response:**

```json
{
  "message": "Cart merged successfully"
}
```

---

## Orders API

### Создать заказ

```
POST /api/orders
Headers: Authorization: Bearer <token>
Content-Type: application/json

{
  "customer": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "address": "123 Main St",
    "city": "Busan"
  },
  "items": [
    {
      "id": 1,
      "variantId": null,
      "quantity": 2,
      "price": 29.99
    }
  ]
}
```

**Response:**

```json
{
  "message": "Order created",
  "orderId": 123
}
```

**Примечание:** После создания заказа автоматически уменьшается stock товаров/вариантов.

---

### Получить заказ по ID

```
GET /api/orders/:orderId
```

**Response:**

```json
{
  "id": 123,
  "total": 59.98,
  "status": "created",
  "created_at": "2024-01-01T00:00:00Z",
  "customer": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "address": "123 Main St",
    "city": "Busan"
  },
  "items": [
    {
      "product_id": 44,
      "title": "Velvet Lip Tint",
      "product_category": "makeup",
      "variant_id": "2",
      "variant_title": "Bitter Hour",
      "original_price": 12,
      "variant_price": 13,
      "final_price": 13,
      "discount_percent": null,
      "on_sale": false,
      "quantity": 1,
      "image_url": "image-url"
    }
  ]
}
```

---

### Получить заказы пользователя

```
GET /api/orders/user/:firebaseUid
```

**Parameters:**

- `firebaseUid` (path) - Firebase UID пользователя

**Response:**

```json
[
  {
    "id": 123,
    "total": 59.98,
    "status": "created",
    "created_at": "2024-01-01T00:00:00Z",
    "user_id": "66478467ff-47648f-gfhgdfhj-3564f",
    "city": "Busan"
  }
]
```

**Примечание:** Если пользователь не найден, возвращается пустой массив `[]`.



## Users API

### Создать пользователя

```
POST /api/users
Content-Type: application/json

{
  "uid": "firebase-uid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Headers:**

- `Authorization: Bearer <token>` (optional) - если создается авторизованным пользователем

**Response:**

```json
{
  "id": 1,
  "firebase_uid": "firebase-uid",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe"
}
```

---

### Получить текущего пользователя

```
GET /api/users/me
Headers: Authorization: Bearer <token>
```

**Response:**

```json
{
  "id": 1,
  "firebase_uid": "firebase-uid",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe"
}
```

---

## Коды ошибок

- `200` - Успешный запрос
- `201` - Ресурс создан
- `400` - Неверные данные запроса
- `401` - Не авторизован (нет токена или токен недействителен)
- `404` - Ресурс не найден
- `500` - Внутренняя ошибка сервера

## Примеры использования

### JavaScript (Fetch API)

```javascript
// Получить товары по категории
const response = await fetch(
  "http://localhost:4000/api/products/categories/anti-age?page=1&limit=12",
);
const data = await response.json();

// Добавить товар в корзину (требует авторизации)
const token = await getAuthToken();
const response = await fetch("http://localhost:4000/api/cart", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    productId: 1,
    quantity: 2,
  }),
});
```
