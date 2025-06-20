# CRM System API Documentation

Bu hujjat CRM tizimi uchun kerakli barcha API endpointlarni tavsiflaydi. Backend yaratishda quyidagi API'larni implement qilish kerak.

## Base URL
```
https://your-api-domain.com/api/v1
```

## Authentication

### POST /auth/login
Foydalanuvchini tizimga kiritish

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "number",
      "email": "string",
      "name": "string",
      "role": "string"
    },
    "token": "string",
    "refreshToken": "string"
  }
}
```

### POST /auth/logout
Foydalanuvchini tizimdan chiqarish

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully logged out"
}
```

### POST /auth/refresh
Token yangilash

**Request Body:**
```json
{
  "refreshToken": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "string",
    "refreshToken": "string"
  }
}
```

## Customers (Mijozlar)

### GET /customers
Barcha mijozlarni olish

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Sahifa raqami (default: 1)
- `limit` (optional): Sahifadagi elementlar soni (default: 10)
- `search` (optional): Qidiruv so'zi
- `status` (optional): Mijoz holati (active, potential, waiting)

**Response:**
```json
{
  "success": true,
  "data": {
    "customers": [
      {
        "id": "number",
        "name": "string",
        "email": "string",
        "phone": "string",
        "company": "string",
        "status": "active|potential|waiting",
        "value": "string",
        "createdAt": "ISO 8601 date",
        "updatedAt": "ISO 8601 date"
      }
    ],
    "pagination": {
      "currentPage": "number",
      "totalPages": "number",
      "totalItems": "number",
      "itemsPerPage": "number"
    }
  }
}
```

### GET /customers/:id
Bitta mijozni olish

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "customer": {
      "id": "number",
      "name": "string",
      "email": "string",
      "phone": "string",
      "company": "string",
      "status": "active|potential|waiting",
      "value": "string",
      "createdAt": "ISO 8601 date",
      "updatedAt": "ISO 8601 date"
    }
  }
}
```

### POST /customers
Yangi mijoz yaratish

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "company": "string",
  "status": "active|potential|waiting",
  "value": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "customer": {
      "id": "number",
      "name": "string",
      "email": "string",
      "phone": "string",
      "company": "string",
      "status": "active|potential|waiting",
      "value": "string",
      "createdAt": "ISO 8601 date",
      "updatedAt": "ISO 8601 date"
    }
  }
}
```

### PUT /customers/:id
Mijozni yangilash

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "company": "string",
  "status": "active|potential|waiting",
  "value": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "customer": {
      "id": "number",
      "name": "string",
      "email": "string",
      "phone": "string",
      "company": "string",
      "status": "active|potential|waiting",
      "value": "string",
      "createdAt": "ISO 8601 date",
      "updatedAt": "ISO 8601 date"
    }
  }
}
```

### DELETE /customers/:id
Mijozni o'chirish

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Customer deleted successfully"
}
```

## Deals (Kelishuvlar)

### GET /deals
Barcha kelishuvlarni olish

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Sahifa raqami
- `limit` (optional): Sahifadagi elementlar soni
- `status` (optional): Kelishuv holati (new, in_progress, completed, cancelled)
- `customerId` (optional): Mijoz ID'si

**Response:**
```json
{
  "success": true,
  "data": {
    "deals": [
      {
        "id": "number",
        "title": "string",
        "description": "string",
        "value": "number",
        "status": "new|in_progress|completed|cancelled",
        "customerId": "number",
        "customer": {
          "id": "number",
          "name": "string",
          "company": "string"
        },
        "createdAt": "ISO 8601 date",
        "updatedAt": "ISO 8601 date"
      }
    ],
    "pagination": {
      "currentPage": "number",
      "totalPages": "number",
      "totalItems": "number"
    }
  }
}
```

### POST /deals
Yangi kelishuv yaratish

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "value": "number",
  "status": "new|in_progress|completed|cancelled",
  "customerId": "number"
}
```

### PUT /deals/:id
Kelishuvni yangilash

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "value": "number",
  "status": "new|in_progress|completed|cancelled",
  "customerId": "number"
}
```

### DELETE /deals/:id
Kelishuvni o'chirish

**Headers:**
```
Authorization: Bearer <token>
```

## Activities (Faoliyatlar)

### GET /activities
Barcha faoliyatlarni olish

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Sahifa raqami
- `limit` (optional): Sahifadagi elementlar soni
- `type` (optional): Faoliyat turi (call, email, meeting, deal)
- `customerId` (optional): Mijoz ID'si

**Response:**
```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "id": "number",
        "type": "call|email|meeting|deal",
        "description": "string",
        "customerId": "number",
        "customer": {
          "id": "number",
          "name": "string"
        },
        "createdAt": "ISO 8601 date"
      }
    ]
  }
}
```

### POST /activities
Yangi faoliyat yaratish

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "type": "call|email|meeting|deal",
  "description": "string",
  "customerId": "number"
}
```

## Analytics (Analitika)

### GET /analytics/dashboard
Dashboard statistikalarini olish

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalCustomers": "number",
    "monthlySales": "number",
    "activeDeals": "number",
    "conversionRate": "number",
    "customersByStatus": {
      "active": "number",
      "potential": "number",
      "waiting": "number"
    },
    "salesTrend": [
      {
        "month": "string",
        "sales": "number"
      }
    ]
  }
}
```

### GET /analytics/sales
Sotuv analitikasi

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `startDate` (optional): Boshlanish sanasi (YYYY-MM-DD)
- `endDate` (optional): Tugash sanasi (YYYY-MM-DD)
- `period` (optional): Davr (daily, weekly, monthly, yearly)

**Response:**
```json
{
  "success": true,
  "data": {
    "totalSales": "number",
    "salesByPeriod": [
      {
        "period": "string",
        "sales": "number",
        "deals": "number"
      }
    ],
    "topCustomers": [
      {
        "customerId": "number",
        "customerName": "string",
        "totalValue": "number"
      }
    ]
  }
}
```

## Error Responses

Barcha API'lar xatolik holatida quyidagi formatda javob qaytaradi:

```json
{
  "success": false,
  "error": {
    "code": "string",
    "message": "string",
    "details": "object (optional)"
  }
}
```

### Umumiy Xatolik Kodlari:
- `UNAUTHORIZED` (401): Avtorizatsiya talab qilinadi
- `FORBIDDEN` (403): Ruxsat yo'q
- `NOT_FOUND` (404): Resurs topilmadi
- `VALIDATION_ERROR` (400): Ma'lumotlar noto'g'ri
- `INTERNAL_ERROR` (500): Server xatoligi

## Ma'lumotlar Bazasi Sxemasi

### Users jadvali
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Customers jadvali
```sql
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(255),
  status VARCHAR(20) DEFAULT 'potential',
  value VARCHAR(50),
  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Deals jadvali
```sql
CREATE TABLE deals (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  value DECIMAL(10,2),
  status VARCHAR(20) DEFAULT 'new',
  customer_id INTEGER REFERENCES customers(id),
  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Activities jadvali
```sql
CREATE TABLE activities (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  customer_id INTEGER REFERENCES customers(id),
  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Xavfsizlik

1. **JWT Token**: Barcha API'lar JWT token orqali himoyalangan
2. **CORS**: Cross-origin so'rovlar cheklangan
3. **Rate Limiting**: Har bir IP uchun so'rovlar soni cheklangan
4. **Input Validation**: Barcha kiritilgan ma'lumotlar tekshiriladi
5. **SQL Injection Protection**: Prepared statements ishlatiladi

## Deployment

Backend quyidagi muhit o'zgaruvchilarini talab qiladi:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/crm_db
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_SECRET=your-refresh-secret
REFRESH_TOKEN_EXPIRES_IN=7d
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com
```

Bu API dokumentatsiyasi asosida backend yaratib, frontend bilan bog'lash mumkin.
