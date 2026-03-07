# API Documentation

## Base URL

```
http://localhost:3000/api
```

## Authentication

All endpoints require a valid Supabase JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Response Format

### Success Response

```json
{
  "data": {
    // Response data
  }
}
```

### Paginated Response

```json
{
  "data": [...],
  "pagination": {
    "total": 100,
    "limit": 50,
    "offset": 0,
    "hasMore": true
  }
}
```

### Error Response

```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

---

## User Profile

### Get Profile

```http
GET /profile
```

**Response:**

```json
{
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "height": 180,
    "age": 30,
    "sex": "MALE",
    "activityLevel": "MODERATELY_ACTIVE",
    "estimatedTDEE": 2500,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Update Profile

```http
PUT /profile
```

**Request Body:**

```json
{
  "name": "John Doe",
  "height": 180,
  "age": 30,
  "sex": "MALE",
  "activityLevel": "MODERATELY_ACTIVE"
}
```

**Available Values:**

- `sex`: MALE, FEMALE, OTHER
- `activityLevel`: SEDENTARY, LIGHTLY_ACTIVE, MODERATELY_ACTIVE, VERY_ACTIVE, EXTREMELY_ACTIVE

---

## Body Metrics

### Create Metric

```http
POST /metrics
```

**Request Body:**

```json
{
  "weight": 80.5,
  "waist": 85,
  "chest": 100,
  "arm": 35,
  "thigh": 60,
  "bodyFat": 15.5,
  "date": "2024-01-01T00:00:00.000Z"
}
```

All fields are optional.

### Get Metrics

```http
GET /metrics?limit=50&offset=0
```

**Query Parameters:**

- `limit` (optional): Number of records to return (default: 50)
- `offset` (optional): Number of records to skip (default: 0)

### Get Metrics History

```http
GET /metrics/history
```

Returns all metrics without pagination.

### Delete Metric

```http
DELETE /metrics/:id
```

---

## Progress Photos

### Create Photo Entry

```http
POST /photos
```

**Request Body:**

```json
{
  "frontPhotoUrl": "https://storage.supabase.co/...",
  "sidePhotoUrl": "https://storage.supabase.co/...",
  "backPhotoUrl": "https://storage.supabase.co/...",
  "date": "2024-01-01T00:00:00.000Z"
}
```

All fields are optional.

### Get Photos

```http
GET /photos?limit=50&offset=0
```

### Get Photo by ID

```http
GET /photos/:id
```

### Delete Photo

```http
DELETE /photos/:id
```

---

## Diet Plans

### Create Diet Plan

```http
POST /diet
```

**Request Body:**

```json
{
  "type": "CUTTING",
  "calories": 2000,
  "protein": 150,
  "carbs": 200,
  "fat": 50
}
```

**Required:**

- `type`: CUTTING, MAINTENANCE, or BULKING

**Optional (will be auto-calculated if not provided):**

- `calories`
- `protein`
- `carbs`
- `fat`

If macros are not provided, they will be automatically calculated based on:

- User's TDEE (from profile and latest body weight)
- Diet type
- Standard macro distribution (2.2g protein/kg, 0.8g fat/kg, rest carbs)

### Get All Diets

```http
GET /diet
```

Returns all diet plans with their meals.

### Get Diet by ID

```http
GET /diet/:id
```

### Delete Diet

```http
DELETE /diet/:id
```

---

## Meals

### Add Meal to Diet

```http
POST /diet/:id/meals
```

**Request Body:**

```json
{
  "mealName": "Breakfast",
  "foodName": "Oatmeal with berries",
  "quantity": "100g oats + 50g berries",
  "calories": 350,
  "protein": 12,
  "carbs": 60,
  "fat": 7
}
```

All fields are required.

### Get Meals for Diet

```http
GET /diet/:id/meals
```

### Delete Meal

```http
DELETE /meals/:id
```

---

## Goals

### Create Goal

```http
POST /goals
```

**Request Body:**

```json
{
  "targetWeight": 75,
  "targetBodyFat": 12,
  "deadline": "2024-12-31T00:00:00.000Z"
}
```

All fields are optional.

### Get All Goals

```http
GET /goals
```

### Update Goal

```http
PUT /goals/:id
```

**Request Body:**

```json
{
  "targetWeight": 75,
  "targetBodyFat": 12,
  "deadline": "2024-12-31T00:00:00.000Z"
}
```

### Delete Goal

```http
DELETE /goals/:id
```

---

## Error Codes

| Code             | Status | Description                       |
| ---------------- | ------ | --------------------------------- |
| VALIDATION_ERROR | 400    | Invalid input data                |
| UNAUTHORIZED     | 401    | Missing or invalid authentication |
| NOT_FOUND        | 404    | Resource not found                |
| CONFLICT         | 409    | Resource already exists           |
| DATABASE_ERROR   | 400    | Database operation failed         |
| INTERNAL_ERROR   | 500    | Internal server error             |

---

## Rate Limiting

The API is rate-limited to **100 requests per 15 minutes** per IP address.

When rate limit is exceeded, you'll receive:

```json
{
  "error": "Too many requests from this IP, please try again later.",
  "code": "RATE_LIMIT_EXCEEDED"
}
```

---

## Health Check

```http
GET /health
```

**No authentication required.**

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development"
}
```

---

## Examples

### Complete Flow Example

1. **Update profile with body information:**

```bash
curl -X PUT http://localhost:3000/api/profile \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "height": 180,
    "age": 30,
    "sex": "MALE",
    "activityLevel": "MODERATELY_ACTIVE"
  }'
```

2. **Add body metrics:**

```bash
curl -X POST http://localhost:3000/api/metrics \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "weight": 85,
    "waist": 90,
    "chest": 105,
    "bodyFat": 18
  }'
```

3. **Create a diet plan (auto-calculated):**

```bash
curl -X POST http://localhost:3000/api/diet \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "CUTTING"
  }'
```

4. **Add meals to the diet:**

```bash
curl -X POST http://localhost:3000/api/diet/<diet-id>/meals \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "mealName": "Breakfast",
    "foodName": "Eggs and Toast",
    "quantity": "3 eggs + 2 slices",
    "calories": 400,
    "protein": 25,
    "carbs": 30,
    "fat": 15
  }'
```

5. **Set a goal:**

```bash
curl -X POST http://localhost:3000/api/goals \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "targetWeight": 80,
    "targetBodyFat": 15,
    "deadline": "2024-12-31T00:00:00.000Z"
  }'
```
