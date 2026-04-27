# Authentication API Documentation

This directory contains the authentication logic for the platform, including Sign Up, Sign In, and Forgot Password functionality.

## Base URL
`/api/auth`

---

## Endpoints

### 1. Sign Up
Create a new user account. By default, new users are assigned the `CUSTOMER` role.

- **URL:** `/signup`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword123",
    "name": "John Doe" (optional)
  }
  ```
- **Success Response (201):**
  ```json
  {
    "message": "User created successfully",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "JWT_ACCESS_TOKEN"
  }
  ```
- **Error Responses:**
  - `400 Bad Request`: Validation failed (invalid email, password too short, etc.)
  - `409 Conflict`: User already exists with this email.

---

### 2. Sign In
Authenticate an existing user and receive a JWT.

- **URL:** `/signin`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword123"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "message": "Logged in successfully",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "JWT_ACCESS_TOKEN"
  }
  ```
- **Error Responses:**
  - `401 Unauthorized`: Invalid email or password.
  - `400 Bad Request`: Validation failed.

---

### 3. Forgot Password
Request a password reset link.

- **URL:** `/forgot-password`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "message": "If an account exists with this email, a password reset link has been sent."
  }
  ```
  *(Note: For security, the API returns the same message regardless of whether the email exists in the database.)*

---

## Security & Implementation Details

- **Password Hashing**: Passwords are hashed using SHA-256 via the Web Crypto API, ensuring compatibility with Edge environments like Cloudflare Workers.
- **Authentication**: JWT tokens are used for session management. Tokens include the user's ID, email, and primary role.
- **Validation**: All inputs are validated using Zod schemas defined in `validation.ts`.
- **Database**: Uses Prisma for database operations, with transactional integrity for user and role creation.

## Types & Schemas
- **Validation Schemas**: See [validation.ts](./validation.ts)
- **TypeScript Types**: See [type.ts](./type.ts)
