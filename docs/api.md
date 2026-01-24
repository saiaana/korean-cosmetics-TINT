# API Documentation

## Base URL

- **Development**: `http://localhost:4000`
- **Production**: Configured via environment variable

## Authentication

Most endpoints require authentication. For protected requests, include the header:

```
Authorization: Bearer <JWT_TOKEN>
```

JWT token is obtained through Firebase Authentication on the frontend.

---

## Products API

### Get All Categories

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

### Get All Brands

```
GET /api/products/brands
```

**Response:**

```json
["Brand 1", "Brand 2", "Brand 3"]
```

---

### Get Products by Category

```
GET /api/products/categories/:category?page=1&limit=12
```

**Parameters:**

- `category` (path) - category name
- `page` (query, optional) - page number (default: 1)
- `limit` (query, optional) - products per page (default: 12)

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

### Get Products by Brand

```
GET /api/products/brands/:brand?page=1&limit=12
```

**Parameters:**

- `brand` (path) - brand name
- `page` (query, optional) - page number
- `limit` (query, optional) - products per page

**Response:** Similar to `/api/products/categories/:category`

---

### Get New Products

```
GET /api/products/new?page=1&limit=12
```

**Parameters:**

- `page` (query, optional) - page number
- `limit` (query, optional) - products per page

**Response:** Similar to previous endpoints

---

### Get Products on Sale

```
GET /api/products/on-sale?page=1&limit=12
```

**Parameters:**

- `page` (query, optional) - page number
- `limit` (query, optional) - products per page

**Response:** Similar to previous endpoints

---

### Get Bestsellers

```
GET /api/products/bestsellers?page=1&limit=12
```

**Parameters:**

- `page` (query, optional) - page number
- `limit` (query, optional) - products per page

**Response:** Similar to previous endpoints

---

### Get Product by Slug

```
GET /api/products/slug/:slug
```

**Parameters:**

- `slug` (path) - product slug (format: `{id}-{title}`)

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

### Search Products

```
GET /api/products/search?search=search+query
```

**Parameters:**

- `search` (query, required) - search query (minimum 2 characters)

**Response:** Similar to getting product by slug

**Limit:** Maximum 20 results

---

### Get Similar Products

```
GET /api/products/similar?category=anti-age&brand=brand-name&excludeId=1&limit=10
```

**Parameters:**

- `category` (query, required) - product category
- `brand` (query, required) - product brand
- `excludeId` (query, required) - product ID to exclude
- `limit` (query, optional) - number of products (default: 10)

**Response:** Array of products

---

### Get Product Variants

```
GET /api/products/:productId/variants
```

**Parameters:**

- `productId` (path) - product ID

**Response:**

```json
{
  "variants": [
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
}
```

---

## Cart API

### Get User Cart (Guest or Authenticated)

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
    "variant_images": [],
    "product_is_active": true,
    "variant_is_active": true
  }
]
```

---

### Add Item to Cart

```
POST /api/cart
Headers: Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": 1,
  "variantId": null,  // optional
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

### Update Cart Item Quantity

```
PATCH /api/cart/:productId
Headers: Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 3,  // quantity change (can be negative)
  "variantId": null  // optional
}
```

**Parameters:**

- `productId` (path) - product ID

**Response:**

```json
{
  "message": "Cart item updated"
}
```

---

### Remove Item from Cart

```
DELETE /api/cart/:productId
Headers: Authorization: Bearer <token>
```

**Query Parameters:**

- `variantId` (optional) - variant ID

**Response:**

```json
{
  "message": "Item removed from cart"
}
```

---

### Clear Cart

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

### Merge Guest Cart with User Cart

Items added in guest mode are merged with the authenticated user's cart (after registration or login).

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

### Create Order

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

**Note:** After creating an order, stock of products/variants is automatically decreased.

---

### Get Order by ID

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

### Get User Orders

```
GET /api/orders/user/:firebaseUid
```

**Parameters:**

- `firebaseUid` (path) - Firebase UID of the user

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

**Note:** If user is not found, an empty array `[]` is returned.

---

## Users API

### Create User

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

- `Authorization: Bearer <token>` (optional) - if created by authenticated user

**Response:**

```json
{
  "id": 1,
  "firebase_uid": "firebase-uid",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "role": "user"
}
```

---

### Get Current User

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
  "last_name": "Doe",
  "role": "user"
}
```

---

## Admin API (Requires Special Roles)

### Statistics API

#### Get Popular Products (admin only)

```
GET /api/stats/popular-products?limit=20
Headers: Authorization: Bearer <token>
```

**Requirements:** `admin` role

**Parameters:**

- `limit` (query, optional) - number of products (default: 10)

**Response:**

```json
[
  {
    "product_id": 1,
    "variant_id": 2,
    "title": "Product Title",
    "variant_title": "Variant Title",
    "brand": "Brand Name",
    "product_category": "category",
    "total_quantity": 150,
    "order_count": 45,
    "total_revenue": 2999.50,
    "image_url": "image-url"
  }
]
```

---

### Admin Products API (admin only)

#### Get All Products for Admin

```
GET /api/products/admin/all
Headers: Authorization: Bearer <token>
```

**Requirements:** `admin` role

**Response:** Array of products (including inactive)

---

#### Get Product for Editing

```
GET /api/products/admin/:productId
Headers: Authorization: Bearer <token>
```

**Requirements:** `admin` role

**Response:** Product data with variants and images

---

#### Create Product

```
POST /api/products
Headers: Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Product Title",
  "brand": "Brand Name",
  "price": 29.99,
  "product_category": "category",
  "description": "Description",
  "images": [...],
  "variants": [...]
}
```

**Requirements:** `admin` role

---

#### Update Product

```
PUT /api/products/:productId
Headers: Authorization: Bearer <token>
Content-Type: application/json
```

**Requirements:** `admin` role

---

#### Change Product Active Status

```
PUT /api/products/:productId/active
Headers: Authorization: Bearer <token>
Content-Type: application/json

{
  "isActive": true
}
```

**Requirements:** `admin` role

---

### Admin Orders API (admin, manager)

#### Get All Orders

```
GET /api/orders/all?page=1&limit=20
Headers: Authorization: Bearer <token>
```

**Requirements:** `admin` or `manager` role

**Parameters:**

- `page` (query, optional) - page number (default: 1)
- `limit` (query, optional) - orders per page (default: 20)

**Response:**

```json
{
  "orders": [...],
  "total": 100,
  "page": 1,
  "limit": 20,
  "hasMore": true
}
```

---

#### Update Order Status

```
PUT /api/orders/:orderId/status
Headers: Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "paid"
}
```

**Requirements:** `admin` or `manager` role

**Response:**

```json
{
  "id": 123,
  "status": "paid"
}
```

---

## Error Codes

- `200` - Successful request
- `201` - Resource created
- `400` - Invalid request data
- `401` - Unauthorized (no token or token is invalid)
- `403` - Forbidden (insufficient permissions)
- `404` - Resource not found
- `500` - Internal server error

## Usage Examples

### JavaScript (Fetch API)

```javascript
// Get products by category
const response = await fetch(
  "http://localhost:4000/api/products/categories/anti-age?page=1&limit=12",
);
const data = await response.json();

// Add item to cart (requires authentication)
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
