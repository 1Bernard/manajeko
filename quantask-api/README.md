# Quantask API

Ruby on Rails API backend for Quantask task management application.

## Tech Stack

- **Rails**: 8.0.4 (API-only mode)
- **Database**: PostgreSQL
- **Authentication**: JWT with 2FA (OTP)
- **Architecture**: Modular Monolith with CQRS pattern

## Setup

```bash
# Install dependencies
bundle install

# Create and migrate database
bin/rails db:create db:migrate

# Start server
bin/rails server -p 3001
```

## Architecture

This project follows a **Feature-Based Modular Monolith** architecture:

```
quantask-api/
├── app/
│   ├── lib/              # Shared utilities (Result, JWT)
│   ├── commands/         # Base Command class
│   ├── queries/          # Base Query class
│   ├── errors/           # Custom errors
│   └── controllers/      # Base controllers
├── features/
│   ├── identity/         # Authentication & User management
│   │   ├── models/
│   │   ├── commands/     # Write operations
│   │   ├── queries/      # Read operations
│   │   ├── services/     # Orchestration layer
│   │   ├── controllers/
│   │   └── serializers/
│   └── global/           # Shared commands (notifications, etc.)
└── config/
```

### CQRS Pattern

- **Commands**: Handle write operations (CreateUser, AuthenticateUser, etc.)
- **Queries**: Handle read operations (FindUser, ListUsers, etc.)
- **Services**: Orchestrate multiple commands/queries and side effects
- **Controllers**: Thin layer that calls services and renders results

## API Endpoints

### Authentication

Base URL: `http://localhost:3001/api/v1`

#### Register

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "first_name": "John",
  "last_name": "Doe",
  "otp_method": "email"
}
```

**Response (201 Created):**
```json
{
  "user": {
    "data": {
      "id": "1",
      "type": "user",
      "attributes": {
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "fullName": "John Doe",
        "initials": "JD",
        "otpMethod": "email",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    }
  },
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

#### Login (Step 1: Request OTP)

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "otpRequired": true,
  "message": "OTP sent to email"
}
```

> **Note**: In development, the OTP code is printed to the console. Check the Rails server logs.

#### Verify OTP (Step 2: Complete Login)

```http
POST /auth/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp_code": "123456"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {
    "data": {
      "id": "1",
      "type": "user",
      "attributes": { ... }
    }
  }
}
```

#### Get Current User

```http
GET /auth/me
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "data": {
    "id": "1",
    "type": "user",
    "attributes": {
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "fullName": "John Doe",
      "initials": "JD",
      "otpMethod": "email",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### Forgot Password

```http
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response (200 OK):**
```json
{
  "message": "If this email exists, a code has been sent"
}
```

> **Note**: The reset token is printed to the console in development.

#### Reset Password

```http
POST /auth/reset-password
Content-Type: application/json

{
  "token": "abc123def456",
  "new_password": "newpassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true
}
```

## Testing with cURL

```bash
# Register a new user
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "first_name": "Test",
    "last_name": "User",
    "otp_method": "email"
  }'

# Login (request OTP)
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Check Rails console for OTP code, then verify
curl -X POST http://localhost:3001/api/v1/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "otp_code": "123456"
  }'

# Get current user (use token from verify-otp response)
curl -X GET http://localhost:3001/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Testing with Rails Console

```bash
bin/rails console
```

```ruby
# Create a user
result = Identity::Services::RegistrationService.call({
  email: 'test@example.com',
  password: 'password123',
  password_confirmation: 'password123',
  first_name: 'John',
  last_name: 'Doe',
  otp_method: 'email'
})

puts result.success? # => true
puts result.value[:token] # => JWT token

# Login
result = Identity::Services::LoginService.call('test@example.com', 'password123')
puts result.value[:message] # => "OTP sent to email"

# Get OTP from database
user = Identity::User.find_by(email: 'test@example.com')
puts user.otp_code # => "123456"

# Verify OTP
result = Identity::Services::VerificationService.call('test@example.com', user.otp_code)
puts result.value[:token] # => JWT token
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "code": "error_code",
  "details": { ... }
}
```

Common HTTP status codes:
- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Invalid parameters
- `401 Unauthorized` - Authentication failed
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Validation failed
- `429 Too Many Requests` - Rate limit exceeded

## Rate Limiting

- **Global**: 60 requests per minute per IP
- **Login**: 5 attempts per 20 seconds per IP
- **Login by email**: 5 attempts per 20 seconds per email

## Security Features

- ✅ JWT authentication with expiration
- ✅ 2FA with OTP (email/SMS)
- ✅ Password hashing with bcrypt
- ✅ Rate limiting with Rack::Attack
- ✅ CORS configuration
- ✅ Secure password reset flow
- ✅ Token-based password reset (2-hour expiration)

## Development

```bash
# Run migrations
bin/rails db:migrate

# Rollback migration
bin/rails db:rollback

# Check routes
bin/rails routes

# Open console
bin/rails console

# Start server on custom port
bin/rails server -p 3001
```

## Next Steps

- [ ] Add Workspace feature
- [ ] Add Project feature
- [ ] Add Task feature
- [ ] Add Comments feature
- [ ] Add Attachments feature
- [ ] Add Activity logs
- [ ] Add Notifications
- [ ] Add real email/SMS sending
- [ ] Add background jobs
- [ ] Add API documentation (Swagger)
