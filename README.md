# Zumba MEU Events API

A production-ready Node.js microservice for managing events for the Zumba MEU landing page.

## Features

- ✅ RESTful API with CRUD operations for events
- ✅ JWT-based authentication
- ✅ PostgreSQL database via Supabase
- ✅ TypeScript for type safety
- ✅ Request validation with Zod
- ✅ Clean architecture (routes, controllers, services)
- ✅ Security best practices (Helmet, CORS)
- ✅ Error handling and logging

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT
- **Validation**: Zod
- **Security**: Helmet, CORS, bcrypt

## Project Structure

```
src/
├── config/          # Configuration files (database, environment)
├── controllers/     # Request handlers
├── middleware/      # Custom middleware (auth, validation, error handling)
├── routes/          # API route definitions
├── services/        # Business logic layer
├── types/           # TypeScript type definitions
├── utils/           # Utility functions (JWT, mappers, responses)
├── validators/      # Zod validation schemas
├── app.ts           # Express app setup
└── server.ts        # Server entry point

scripts/
└── 01-create-tables.sql  # Database schema
```

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project
- Admin user already inserted in the database

### 1. Clone and Install

```bash
# Install dependencies
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# Admin Credentials (for reference)
ADMIN_EMAIL=admin@zumbameu.com
```

### 3. Database Setup

Run the SQL script to create the necessary tables:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `scripts/01-create-tables.sql`
4. Execute the script

The admin user should already be inserted in your database. If not, use this query:

```sql
INSERT INTO admins (email, password_hash, name)
VALUES (
  'admin@zumbameu.com',
  -- Replace with bcrypt hash of your password
  '$2b$10$YourBcryptHashHere',
  'Admin User'
);
```

To generate a bcrypt hash for a password, you can use this Node.js script:

```javascript
const bcrypt = require('bcrypt');
const password = 'your_password_here';
bcrypt.hash(password, 10, (err, hash) => {
  console.log(hash);
});
```

### 4. Run the Application

#### Development Mode (with hot reload)

```bash
npm run dev
```

#### Production Mode

```bash
# Build TypeScript
npm run build

# Start server
npm start
```

The API will be available at `http://localhost:3001/api`

## API Endpoints

### Authentication

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@zumbameu.com",
  "password": "your_password"
}

Response:
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "admin": {
      "id": "uuid",
      "email": "admin@zumbameu.com",
      "name": "Admin User"
    }
  }
}
```

### Events (Public Routes)

#### Get All Events
```http
GET /api/events

Response:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Zumba Class",
      "slug": "zumba-class-march",
      "description": "Join us for an exciting Zumba session!",
      "startDate": "2024-03-15T10:00:00Z",
      "endDate": "2024-03-15T11:30:00Z",
      "status": "upcoming",
      "location": "Main Studio",
      "ctaText": "Register Now",
      "ctaUrl": "https://example.com/register",
      "isFeatured": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Get Event by ID
```http
GET /api/events/:id

Response:
{
  "success": true,
  "data": { ... }
}
```

### Events (Protected Routes - Require Authentication)

Add the JWT token to the Authorization header:
```
Authorization: Bearer your_jwt_token_here
```

#### Create Event
```http
POST /api/events
Authorization: Bearer your_jwt_token
Content-Type: application/json

{
  "title": "Zumba Class",
  "slug": "zumba-class-march",
  "description": "Join us for an exciting Zumba session!",
  "startDate": "2024-03-15T10:00:00Z",
  "endDate": "2024-03-15T11:30:00Z",
  "status": "upcoming",
  "location": "Main Studio",
  "ctaText": "Register Now",
  "ctaUrl": "https://example.com/register",
  "isFeatured": true
}

Response:
{
  "success": true,
  "data": { ... }
}
```

#### Update Event
```http
PUT /api/events/:id
Authorization: Bearer your_jwt_token
Content-Type: application/json

{
  "title": "Updated Title",
  "status": "cancelled"
}

Response:
{
  "success": true,
  "data": { ... }
}
```

#### Update Event Dates
```http
PATCH /api/events/:id/dates
Authorization: Bearer your_jwt_token
Content-Type: application/json

{
  "startDate": "2024-03-20T10:00:00Z",
  "endDate": "2024-03-20T11:30:00Z"
}

Response:
{
  "success": true,
  "data": { ... }
}
```

#### Delete Event
```http
DELETE /api/events/:id
Authorization: Bearer your_jwt_token

Response:
{
  "success": true,
  "data": {
    "message": "Event deleted successfully"
  }
}
```

### Health Check
```http
GET /api/health

Response:
{
  "status": "ok",
  "timestamp": "2024-01-15T12:00:00Z"
}
```

## Business Rules

- Events with `status = 'draft'` are **not** returned in public GET requests
- Public events are ordered by `startDate` (ascending)
- Only authenticated admins can create, update, or delete events
- Event slugs must be unique and contain only lowercase letters, numbers, and hyphens
- End date must be after or equal to start date

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "error": "Error message here"
}
```

For validation errors:

```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Helmet for security headers
- CORS protection
- Request validation with Zod
- Environment variable management

## Development

```bash
# Install dependencies
npm install

# Run in development mode with hot reload
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Lint code
npm run lint

# Format code
npm run format
```

## Deployment

This microservice can be deployed to any Node.js hosting platform:

- **Vercel**: Add as a serverless function
- **Railway**: Direct deployment from Git
- **Heroku**: Use Procfile with `web: npm start`
- **DigitalOcean App Platform**: Auto-detected Node.js app
- **AWS Lambda**: Package with Serverless Framework

Make sure to:
1. Set all environment variables in your hosting platform
2. Run database migrations
3. Set `NODE_ENV=production`

## License

MIT
