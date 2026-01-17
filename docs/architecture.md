# Архитектура проекта TINT

## Общая структура

Проект использует архитектуру **full-stack** приложения с разделением на фронтенд и бэкенд.

```
korean-cosmetics-TINT/
├── backend/          # Node.js + Express сервер
├── src/              # React фронтенд приложение
├── public/           # Статические файлы
└── docs/             # Документация
```

## Frontend архитектура

### Технологический стек

- **React 18** - UI библиотека
- **Vite** - сборщик и dev-сервер
- **Redux Toolkit** - управление глобальным состоянием
- **React Router v6** - маршрутизация
- **Tailwind CSS** - стилизация

### Архитектурный подход: Feature-Sliced Design

Проект следует принципам **Feature-Sliced Design (FSD)** для организации кода:

```
src/
├── features/              # Изолированные фичи
│   ├── cart/             # Логика корзины
│   │   ├── lib/          # Утилиты (localStorage, редюсеры)
│   │   ├── selectors/    # Redux селекторы
│   │   └── cartAuth.js   # Авторизация для корзины
│   └── products/         # Логика товаров
├── components/           # Переиспользуемые компоненты
│   ├── common/           # Общие компоненты
│   ├── layout/           # Компоненты макета
│   ├── pages/            # Компоненты страниц
│   └── ui/               # UI компоненты
├── pages/                # Страницы приложения
├── hooks/                # Custom React hooks
├── store/                # Redux store
│   └── slices/           # Redux слайсы
├── api/                  # API клиенты
├── utils/                # Утилиты
└── config/               # Конфигурация
```

### Управление состоянием

#### Redux Store структура:

```javascript
{
  auth: {
    user: { uid, email, displayName } | null,
    initialized: boolean
  },
  products: {
    products: { entities: {}, ids: [] },  // Нормализованные данные
    productPage: { id, status, error },
    lists: {
      newProducts: { ids: [], page, limit, hasMore, status },
      onSaleProducts: { ids: [], page, limit, hasMore, status },
      productsByCategory: { ids: [], page, limit, hasMore, status },
      // ... другие списки
    },
    brands: { data: [], status, error },
    categories: { data: [], status, error }
  },
  cart: {
    items: [],
    selected: {},
    source: "guest" | "user"
  }
}
```

#### Особенности:

- **createEntityAdapter** - для нормализации данных товаров
- **createSelector** - для мемоизации селекторов
- **createAsyncThunk** - для асинхронных операций

### Маршрутизация

Приложение использует **React Router v6** с иерархической структурой маршрутов:

```
/                           # Главная страница
├── /categories            # Список категорий
├── /categories/:category  # Товары по категории
├── /brands                # Список брендов
├── /brands/:brand         # Товары по бренду
├── /new-in                # Новые товары
├── /promotions            # Товары со скидкой
├── /bestsellers           # Хиты продаж
├── /product/:slug         # Страница товара
├── /cart                  # Корзина
├── /order/new             # Оформление заказа
├── /order/confirmation/:id # Страница подтвержденного заказа
├── /blog                  # Блог
├── /blog/:postName        # Статья блога
├── /login                 # Вход
├── /signup                # Регистрация
└── /account               # Личный кабинет
```

### Компонентная структура

#### Layout компоненты:

- `HeroLayout` - макет с hero-секцией (главная, категории, бренды)
- `StandardLayout` - стандартный макет (страница товара, аккаунт)
- `HomepageLayout` - макет главной страницы

#### UI компоненты:

- **Cards**: `ProductCard`, `BlogCard`
- **Sliders**: `Slider`, `NewProductsSlider`, `PromotionsSlider`, `BestsellersSlider`
- **Modals**: `SearchModal`, `ImageFullSizeModal`, `ConfirmModal`
- **Forms**: `LoginForm`, `SignUpForm`, `InputField`
- **Skeletons**: Loading states для улучшения UX

### Оптимизация производительности

1. **Code Splitting**:

   - React.lazy() для динамических импортов
   - Lazy loading изображений через Intersection Observer

2. **Мемоизация**:

   - `useMemo` для вычисляемых значений
   - `useCallback` для функций
   - `createSelector` для Redux селекторов

3. **Lazy Loading**:

   - Изображения с атрибутом `loading="lazy"`
   - Intersection Observer для подгрузки контента
   - Infinite scroll для пагинации

4. **Нормализация данных**:
   - `createEntityAdapter` для избежания дублирования данных
   - Централизованное хранилище товаров

## Backend архитектура

### Паттерн: MVC + Repository

```
backend/
├── controllers/      # Обработка HTTP запросов
├── services/         # Бизнес-логика
├── repositories/     # Работа с БД
├── routes/           # Маршруты API
├── middleware/       # Middleware (auth, error handling)
└── db.js            # Подключение к БД
```

### Слои архитектуры:

#### 1. Routes (Маршруты)

Определяют endpoints API и привязывают их к контроллерам.

#### 2. Controllers (Контроллеры)

- Получают HTTP запросы
- Валидируют входные данные
- Вызывают сервисы
- Формируют HTTP ответы

#### 3. Services (Сервисы)

- Содержат бизнес-логику
- Вызывают репозитории для работы с БД
- Обрабатывают транзакции
- Проводят валидацию на уровне бизнес-правил

#### 4. Repositories (Репозитории)

- Инкапсулируют работу с БД
- Выполняют SQL запросы
- Возвращают чистые данные

### Middleware

#### Аутентификация:

```javascript
authenticateToken(req, res, next);
```

- Проверяет JWT токен из заголовка `Authorization`
- Верифицирует токен через Firebase Admin SDK
- Добавляет данные пользователя в `req.user`

### Обработка ошибок

Все ошибки обрабатываются в контроллерах:

```javascript
try {
  // бизнес-логика
} catch (err) {
  res.status(err.status || 500).json({ error: err.message });
}
```

## Потоки данных

### Получение товаров:

```
Frontend (Products.jsx)
  ↓ dispatch(fetchProductsByCategory(...))
Redux Thunk (productsSlice.js)
  ↓ API call
Backend API (/api/products/categories/:category)
  ↓ Controller
Service (products.service.js)
  ↓ Repository call
Repository (products.repository.js)
  ↓ SQL Query
PostgreSQL Database
  ↓ Response
Frontend (normalize → store → render)
```

### Оформление заказа:

```
Frontend (CreateOrder.jsx)
  ↓ dispatch(createOrder(...))
Backend API (/api/orders)
  ↓ Controller (authenticateToken)
Service (order.service.js)
  ↓ BEGIN TRANSACTION
  ↓ Repository operations
  ↓ UPDATE stock
  ↓ COMMIT
Frontend (redirect to confirmation)
```

## Интеграции

### Firebase

- **Frontend**: Аутентификация пользователей
- **Backend**: Верификация JWT токенов

### PostgreSQL

- Основная база данных
- Хранение товаров, заказов, пользователей, корзины

## Безопасность

1. **JWT токены** для аутентификации API запросов
2. **CORS** настройки для защиты от неавторизованных запросов
3. **Параметризованные SQL запросы** для предотвращения SQL инъекций
4. **Валидация данных** на уровне контроллеров и сервисов
5. **Транзакции** для обеспечения целостности данных

## Масштабируемость

### Frontend:

- Code splitting для уменьшения initial bundle size
- Пагинация для больших списков товаров
- Lazy loading для оптимизации загрузки

### Backend:

- Connection pooling для PostgreSQL
- Асинхронная обработка запросов
- Транзакции для критических операций

## Тестирование

- ESLint для проверки кода
- TypeScript типы (опционально через @types пакеты)
