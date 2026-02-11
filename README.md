[TYPESCRIPT__BADGE]: https://img.shields.io/badge/typescript-D4FAFF?style=for-the-badge&logo=typescript
[NESTJS__BADGE]: https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs
[DRIZZLE__BADGE]: https://img.shields.io/badge/drizzle-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black
[JWT__BADGE]: https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens
[POSTGRES__BADGE]: https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white
[DOCKER__BADGE]: https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white
[SWAGGER__BADGE]: https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white

# Social Platform API

![TypeScript][TYPESCRIPT__BADGE]
![NestJS][NESTJS__BADGE]
![Drizzle ORM][DRIZZLE__BADGE]
![JWT][JWT__BADGE]
![PostgreSQL][POSTGRES__BADGE]
![Docker][DOCKER__BADGE]
![Swagger][SWAGGER__BADGE]

A robust NestJS REST API for a social blogging platform with JWT authentication, user management, posts, comments, and groups. Built with TypeScript, Drizzle ORM, and PostgreSQL.

## 🚀 Features

### Core Functionality

- **Authentication & Authorization** - JWT-based auth with secure password hashing (bcrypt)
- **User Management** - Complete CRUD operations with profile support
- **Posts & Comments** - Create, read, update, and delete blog posts and comments
- **Groups** - Create and manage groups with member roles (owner/member)
- **Profile System** - Rich user profiles with metadata (bio, avatar, social links, preferences)

### Technical Features

- **Type-Safe ORM** - Drizzle ORM with full TypeScript support
- **API Documentation** - Auto-generated Swagger/OpenAPI documentation
- **Validation** - Class-validator with comprehensive DTO validation
- **Error Handling** - Global exception filters with detailed error responses
- **Rate Limiting** - Built-in throttling (100 requests/minute)
- **Health Checks** - Database health monitoring endpoint
- **Security** - Password hashing, JWT tokens, ownership guards

## 📋 Database Schema

![Database Schema](docs/relations.png)

## 🛠️ Tech Stack

- **Framework**: NestJS 11.0.1
- **Language**: TypeScript 5.7.3
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI (@nestjs/swagger)
- **Security**: bcrypt, @nestjs/throttler
- **Health Checks**: @nestjs/terminus

## 📦 Installation

### Prerequisites

- Node.js 22
- PostgreSQL 17
- pnpm

### Setup

1. **Clone the repository**

```bash
git clone https://github.com/juniorenv/nestjs-social-api.git
cd nestjs-social-api
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Environment configuration**

Create a `.env` file in the root directory based on `.env.example`:

```bash
cp .env.example .env
```

**For Docker deployment (recommended):**

```env
# Database Configuration
POSTGRES_USER=pguser
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_DB=nestjsdrizzle
POSTGRES_PORT=5432

# API Configuration
API_PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRATION=3600
```

The `DATABASE_URL` will be automatically constructed by the application using the individual PostgreSQL variables above.

**For local PostgreSQL (without Docker):**

Add the `DATABASE_URL` to your `.env` file:

```env
# Database Configuration
DATABASE_URL=postgresql://pguser:your_secure_password_here@localhost:5432/nestjsdrizzle

# Or use individual variables (the app will construct the URL)
POSTGRES_USER=pguser
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_DB=nestjsdrizzle
POSTGRES_PORT=5432

# API Configuration
API_PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRATION=3600
```

4. **Database setup**

Generate migration:

```bash
pnpm db:generate
```

Run migrations:

```bash
pnpm db:migrate
```

Seed database (optional):

```bash
pnpm db:seed
```

5. **Start the application**

Development mode:

```bash
pnpm dev
```

Production mode:

```bash
pnpm build
pnpm start:prod
```

### Docker Deployment (Recommended)

The project includes Docker Compose configuration for easy deployment:

1. **Ensure Docker and Docker Compose are installed**

2. **Configure environment**

```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start all services**

```bash
docker compose up -d
```

This will start:

- PostgreSQL database container
- NestJS API container

4. **View logs**

```bash
docker compose logs -f
```

5. **Stop services**

```bash
docker compose down
```

6. **Stop and remove volumes (database data)**

```bash
docker compose down -v
```

## 📚 API Documentation

Once the application is running, access the interactive API documentation at:

```
http://localhost:3000/docs
```

The Swagger UI provides:

- Complete endpoint documentation
- Request/response schemas
- Try-it-out functionality
- Authentication support

## 🔐 Authentication

### Sign Up

```http
POST /auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Response:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "createdAt": "2025-02-10T12:00:00.000Z",
    "updatedAt": "2025-02-10T12:00:00.000Z"
  }
}
```

### Sign In

```http
POST /auth/signin
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Response:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Using the Token

Include the JWT token in the Authorization header for protected endpoints:

```http
GET /users/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📍 API Endpoints

### Authentication

| Method | Endpoint       | Auth | Description       |
| ------ | -------------- | ---- | ----------------- |
| POST   | `/auth/signup` | No   | Register new user |
| POST   | `/auth/signin` | No   | Login user        |

### Users

| Method | Endpoint             | Auth | Description                         |
| ------ | -------------------- | ---- | ----------------------------------- |
| POST   | `/users`             | No   | Create user (alternative to signup) |
| GET    | `/users/:userId`     | No   | Get user by ID                      |
| GET    | `/users/me`          | Yes  | Get current user profile            |
| PATCH  | `/users/me`          | Yes  | Update current user                 |
| DELETE | `/users/me`          | Yes  | Delete current user                 |
| PUT    | `/users/me/password` | Yes  | Change password                     |
| POST   | `/users/me/profile`  | Yes  | Create profile                      |
| PATCH  | `/users/me/profile`  | Yes  | Update profile                      |

### Posts

| Method | Endpoint                  | Auth  | Description         |
| ------ | ------------------------- | ----- | ------------------- |
| POST   | `/posts`                  | Yes   | Create post         |
| GET    | `/posts/:postId`          | No    | Get post by ID      |
| PATCH  | `/posts/:postId`          | Yes\* | Update post         |
| DELETE | `/posts/:postId`          | Yes\* | Delete post         |
| POST   | `/posts/:postId/comments` | Yes   | Add comment to post |

\*Only the post author can update/delete

### Comments

| Method | Endpoint               | Auth  | Description       |
| ------ | ---------------------- | ----- | ----------------- |
| GET    | `/comments/:commentId` | No    | Get comment by ID |
| PATCH  | `/comments/:commentId` | Yes\* | Update comment    |
| DELETE | `/comments/:commentId` | Yes\* | Delete comment    |

\*Only the comment author can update/delete

### Groups

| Method | Endpoint                           | Auth    | Description     |
| ------ | ---------------------------------- | ------- | --------------- |
| POST   | `/groups`                          | Yes     | Create group    |
| GET    | `/groups/:groupId`                 | No      | Get group by ID |
| PATCH  | `/groups/:groupId`                 | Yes\*\* | Update group    |
| DELETE | `/groups/:groupId`                 | Yes\*\* | Delete group    |
| POST   | `/groups/:groupId/join`            | Yes     | Join group      |
| DELETE | `/groups/:groupId/leave`           | Yes     | Leave group     |
| DELETE | `/groups/:groupId/members/:userId` | Yes\*\* | Remove member   |

\*\*Only group owner can perform these actions

### Health

| Method | Endpoint  | Auth | Description         |
| ------ | --------- | ---- | ------------------- |
| GET    | `/health` | No   | Check system health |

## 💡 Usage Examples

### Create a Post

```bash
curl -X POST http://localhost:3000/posts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Post",
    "content": "This is the content of my post about TypeScript and NestJS."
  }'
```

### Get Post with Comments

```bash
curl http://localhost:3000/posts/post-uuid-here
```

**Response:**

```json
{
  "id": "uuid",
  "title": "My First Post",
  "content": "This is the content...",
  "createdAt": "2025-02-10T12:00:00.000Z",
  "updatedAt": "2025-02-10T12:00:00.000Z",
  "author": {
    "id": "uuid",
    "name": "John Doe"
  },
  "comments": [
    {
      "id": "uuid",
      "text": "Great post!",
      "createdAt": "2025-02-10T12:30:00.000Z",
      "updatedAt": "2025-02-10T12:30:00.000Z",
      "author": {
        "id": "uuid",
        "name": "Jane Smith"
      }
    }
  ]
}
```

### Create User Profile

```bash
curl -X POST http://localhost:3000/users/me/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "metadata": {
      "bio": "Full-stack developer passionate about TypeScript",
      "avatar": "https://i.pravatar.cc/300",
      "phone": "+5577996483728",
      "location": "Brazil",
      "website": "https://johndoe.dev",
      "socialLinks": {
        "twitter": "https://twitter.com/johndoe",
        "linkedin": "https://linkedin.com/in/johndoe",
        "github": "https://github.com/johndoe"
      },
      "preferences": {
        "theme": "dark",
        "notifications": true,
        "language": "en",
        "emailNotifications": true,
        "timezone": "America/New_York"
      },
      "occupation": "Software Engineer",
      "company": "Tech Corp",
      "skills": ["TypeScript", "React", "Node.js"]
    }
  }'
```

### Create and Join a Group

```bash
# Create group
curl -X POST http://localhost:3000/groups \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "TypeScript",
    "description": "A community for TypeScript enthusiasts"
  }'

# Join group
curl -X POST http://localhost:3000/groups/group-uuid-here/join \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🏗️ Project Structure

```
src/
├── auth/                   # Authentication module
│   ├── dto/               # Auth DTOs (SignIn, SignUp)
│   ├── interfaces/        # JWT payload interface
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.guard.ts      # JWT authentication guard
│   └── auth.module.ts
│
├── user/                  # User management module
│   ├── dto/              # User DTOs
│   ├── user.controller.ts
│   ├── user.service.ts
│   └── user.module.ts
│
├── post/                 # Post management module
│   ├── dto/
│   ├── post.controller.ts
│   ├── post.service.ts
│   └── post.module.ts
│
├── comment/              # Comment module
│   ├── dto/
│   ├── comment.controller.ts
│   ├── comment.service.ts
│   └── comment.module.ts
│
├── group/                # Group management module
│   ├── dto/
│   ├── group.controller.ts
│   ├── group.service.ts
│   └── group.module.ts
│
├── drizzle/              # Database layer
│   ├── schema/           # Drizzle schemas
│   │   ├── users.schema.ts
│   │   ├── posts.schema.ts
│   │   ├── comments.schema.ts
│   │   ├── groups.schema.ts
│   │   ├── profileInfo.schema.ts
│   │   └── schema.ts
│   ├── types/            # Type definitions
│   ├── drizzle.module.ts
│   ├── migrate.ts        # Migration runner
│   └── seed.ts           # Database seeder
│
├── common/               # Shared utilities
│   ├── constants/        # Swagger examples, etc.
│   ├── decorators/       # Custom decorators
│   ├── filters/          # Exception filters
│   ├── guards/           # Authorization guards
│   └── types/            # Express type extensions
│
├── health/               # Health check module
│   ├── health.controller.ts
│   ├── health.module.ts
│   └── drizzle-health.indicator.ts
│
├── app.module.ts         # Root module
└── main.ts               # Application entry point
```

## 🔒 Security Features

### Password Security

- Passwords are hashed using bcrypt (10 salt rounds)
- Password requirements: 8-50 characters
- Passwords are never returned in API responses (using `@Exclude()` decorator)

### JWT Authentication

- Tokens expire after 1 hour (configurable)
- Secure token validation with error handling
- Tokens required for protected endpoints

### Authorization

- **Resource Ownership Guard**: Users can only modify their own posts/comments
- **Group Ownership Guard**: Only group owners can update/delete groups or remove members
- Role-based access control in groups (owner vs member)

### Rate Limiting

- 100 requests per minute per IP
- Prevents brute-force attacks

### Input Validation

- All request bodies validated using class-validator
- UUID validation for path parameters
- Field length restrictions
- Email format validation
- URL validation for profile links

## 🧪 Database Seeding

The project includes a comprehensive seeder for development:

```bash
pnpm run db:seed
```

This creates:

- 50 users with hashed passwords
- 50 profile records with complete metadata
- 50 posts
- 50 comments
- 3 groups (TypeScript, Rust, GO)
- User-group memberships

## 🔧 Available Scripts

```json
{
  "start": "nest start",
  "start:dev": "nest start --watch",
  "start:prod": "node dist/main",
  "build": "nest build",
  "db:generate": "drizzle-kit generate",
  "db:migrate": "tsx src/drizzle/migrate.ts",
  "db:seed": "tsx src/drizzle/seed.ts",
  "db:studio": "drizzle-kit studio"
}
```

## 🎯 Key Design Patterns

### Guards

- **AuthGuard**: Validates JWT tokens, attaches user to request
- **ResourceOwnershipGuard**: Ensures users can only modify their own resources
- **GroupOwnershipGuard**: Restricts group management to owners

### Custom Decorators

- `@ResourceType()`: Specifies resource type for ownership validation
- `@AtLeastOneField()`: Validates that partial updates have at least one field

### DTO Transformation

- `plainToInstance()`: Ensures response DTOs exclude sensitive fields
- `@Exclude()`: Prevents password from being serialized

### Error Handling

- **DatabaseExceptionFilter**: Catches and formats database errors
- Detailed error responses with timestamps and request paths
- Type guards for Drizzle/PostgreSQL error detection

## 🚨 Error Responses

The API provides consistent error responses:

```json
{
  "statusCode": 400,
  "timestamp": "2026-02-10T12:00:00.000Z",
  "path": "/users/me",
  "message": {
    "message": ["Invalid email format", "..."],
    "error": "Bad Request"
  }
}
```

Common error codes:

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate email/group name)
- `500` - Internal Server Error
- `503` - Service Unavailable (database connection)
