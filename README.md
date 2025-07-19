# Hexagonal Architecture API - Rick & Morty Favorites

This project demonstrates a Node.js API built with a Hexagonal Architecture (Ports & Adapters) pattern. It integrates with the Rick and Morty API, allows user authentication, managing favorite characters, and includes role-based access control (Admin/User) and an in-memory LRU cache for external API calls.

## Table of Contents

-   [Installation](#installation)
-   [Running the Application](#running-the-application)
-   [Environment Variables](#environment-variables)
-   [API Endpoints](#api-endpoints)
    -   [Authentication](#authentication)
    -   [Rick & Morty Characters](#rick--morty-characters)
    -   [Favorite Characters](#favorite-characters)
    -   [User Management (Admin Only)](#user-management-admin-only)

## Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/virtualkur2/rick-morty_backend.git
    cd rick-morty_backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Build the TypeScript project:**
    ```bash
    npm run build
    ```

## Running the Application

Before running, ensure you have set up your `.env` file as described in the [Environment Variables](#environment-variables) section.

-   **Development Mode (with Nodemon for auto-restart):**
    ```bash
    npm run dev
    ```
-   **Production Mode:**
    ```bash
    npm start
    ```

The API will typically run on `http://localhost:3000` (or the `PORT` specified in your `.env`).

## Environment Variables

Create a `.env` file in the root of your project. This file is **crucial for application configuration** and should **NEVER** be committed to version control (`.gitignore` is configured to ignore it).

```env
# Server Port
PORT=3000

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_please_change_this_to_a_strong_random_string!
JWT_EXPIRES_IN=1d

# Rick & Morty API Base URL
RICK_AND_MORTY_API_BASE_URL=https://rickandmortyapi.com/api

# Initial Admin User (In-Memory - NOT PERSISTED ACROSS APP RESTARTS)
# If these are set, an admin user will be created in memory on application start.
ADMIN_NAME=Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=SuperSecureAdminPass123!

# Cache config
MAX_CACHE_ENTRY_SIZE=1000
```

## API Endpoints

All endpoints are prefixed with `http://localhost:3000` (or your configured `PORT`).

---

### Authentication

#### Sign Up a New User

`POST /auth/signup`

**Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123"
}
```

#### Login User

`POST /auth/login`

**Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response:** Returns a JWT token. Use this token in the `Authorization: Bearer <token>` header for protected routes.

---

### Rick & Morty Characters

> Requires Authentication

#### Get All Characters

`GET /rick-and-morty/characters`

**Query Params (Optional):** `page`, `name`, `species`, `status`

Example:
```
GET /rick-and-morty/characters?page=2&name=rick
```

- **Admin Access:** Includes extended character details (`type`, `gender`, `origin`, `location`, `episode`, `url`, `created`).
- **User Access:** Basic character details only.

---

### Favorite Characters

> Requires Authentication

#### Add a Character to Favorites

`POST /favorites`

**Body:**
```json
{
  "characterId": 1
}
```

#### Remove a Character from Favorites

`DELETE /favorites/:characterId`

Example:
```
DELETE /favorites/1
```

#### Get My Favorite Characters

`GET /favorites`

---

### User Management (Admin Only)

> Requires Admin Role Authentication

#### Get All Registered Users

`GET /users`

#### Get a Specific User's Favorite Characters

`GET /users/:userId/favorites`

Example:
```
GET /users/some-user-id-123/favorites
```

---

Feel free to explore and test the endpoints!