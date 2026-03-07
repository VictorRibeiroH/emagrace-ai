# FitProject Backend API

A production-quality REST API for body progress and diet tracking, built with Node.js, TypeScript, Express, and PostgreSQL.

## 🚀 Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** Supabase Auth (JWT)
- **Validation:** Zod
- **Testing:** Vitest
- **Code Quality:** ESLint, Prettier

## 📁 Project Structure

```
src/
├── config/           # Configuration files
│   ├── index.ts     # Environment config
│   └── database.ts  # Prisma client setup
├── middlewares/     # Express middlewares
│   ├── auth.middleware.ts
│   └── validation.middleware.ts
├── modules/         # Feature modules
│   ├── users/
│   ├── body-metrics/
│   ├── progress-photos/
│   ├── diets/
│   ├── meals/
│   └── goals/
├── utils/           # Utility functions
│   ├── calculations.ts
│   ├── errors.ts
│   └── errorHandler.ts
├── app.ts           # Express app setup
└── server.ts        # Server entry point
tests/               # Test files
prisma/              # Database schema
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- Supabase account (for authentication)

### 1. Clone and Install

```bash
cd web-backend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/fitproject?schema=public"

# Server
PORT=3000
NODE_ENV=development

# Supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_JWT_SECRET=your_supabase_jwt_secret

# CORS
CORS_ORIGIN=http://localhost:5173
```

### 3. Database Setup

Generate Prisma client and run migrations:

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 4. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## 🧪 Testing

Run tests:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

## 📦 Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## 🔐 Authentication

All API endpoints (except `/health`) require authentication using Supabase JWT tokens.

Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📚 API Endpoints

### Health Check

- `GET /health` - Server health check (no auth required)

### User Profile

- `GET /api/profile` - Get user profile with estimated TDEE
- `PUT /api/profile` - Update user profile

### Body Metrics

- `POST /api/metrics` - Create body measurement
- `GET /api/metrics` - Get paginated metrics
- `GET /api/metrics/history` - Get all metrics history
- `DELETE /api/metrics/:id` - Delete a metric

### Progress Photos

- `POST /api/photos` - Create progress photos entry
- `GET /api/photos` - Get paginated photos
- `GET /api/photos/:id` - Get specific photo entry
- `DELETE /api/photos/:id` - Delete photo entry

### Diet Plans

- `POST /api/diet` - Create diet plan (auto-calculates macros)
- `GET /api/diet` - Get all diet plans
- `GET /api/diet/:id` - Get specific diet plan with meals
- `DELETE /api/diet/:id` - Delete diet plan

### Diet Meals

- `POST /api/diet/:id/meals` - Add meal to diet plan
- `GET /api/diet/:id/meals` - Get all meals for a diet
- `DELETE /api/meals/:id` - Delete a meal

### Goals

- `POST /api/goals` - Create fitness goal
- `GET /api/goals` - Get all goals
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal

## 🧮 Calculations

The API automatically calculates:

### TDEE (Total Daily Energy Expenditure)

Uses the Mifflin-St Jeor equation:

- **Men:** BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age + 5
- **Women:** BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age - 161

Then multiplied by activity level factor.

### Diet Calories

- **Cutting:** TDEE - 500 kcal
- **Maintenance:** TDEE
- **Bulking:** TDEE + 300 kcal

### Macronutrients

- **Protein:** 2.2g per kg body weight
- **Fat:** 0.8g per kg body weight
- **Carbs:** Remaining calories (4 kcal/g)

## 🔒 Security Features

- Helmet.js for security headers
- CORS configuration
- Rate limiting (100 requests per 15 minutes)
- Input validation with Zod
- SQL injection protection via Prisma
- JWT authentication

## 📝 Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

Common error codes:

- `VALIDATION_ERROR` - Invalid input data
- `UNAUTHORIZED` - Missing or invalid authentication
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Resource already exists
- `INTERNAL_ERROR` - Server error

## 🏗️ Architecture

The project follows **clean architecture** principles:

- **Controllers:** Handle HTTP requests/responses
- **Services:** Contains business logic
- **Repositories:** Database access layer
- **Schemas:** Input validation with Zod

This separation ensures:

- Testability
- Maintainability
- Scalability
- Clear separation of concerns

## 🚢 Production Deployment

1. Build the project:

```bash
npm run build
```

2. Set `NODE_ENV=production` in your environment

3. Run migrations:

```bash
npm run prisma:migrate
```

4. Start the server:

```bash
npm start
```

## 📊 Database Schema

The database includes the following tables:

- `users` - User profiles
- `body_metrics` - Body measurements
- `progress_photos` - Progress photo URLs
- `diets` - Diet plans
- `meals` - Individual meals in diet plans
- `goals` - Fitness goals

See `prisma/schema.prisma` for the complete database schema.

## 🤝 Contributing

1. Follow the existing code structure
2. Write tests for new features
3. Run linting and formatting before committing
4. Ensure all tests pass

## � Troubleshooting

Having issues with VS Code showing errors in `schema.prisma` or `tsconfig.json`?

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for solutions to common IDE warnings and false positives.

## �📄 License

MIT
