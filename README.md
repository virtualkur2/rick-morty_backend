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
PORT=3001

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_please_change_this_to_a_strong_random_string!
JWT_EXPIRES_IN=1h

# Rick & Morty API Base URL
RICK_AND_MORTY_API_BASE_URL=[https://rickandmortyapi.com/api](https://rickandmortyapi.com/api)

# Initial Admin User (In-Memory - NOT PERSISTED ACROSS APP RESTARTS)
# If these are set, an admin user will be created in memory on application start.
ADMIN_NAME=Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=SuperSecureAdminPass123!