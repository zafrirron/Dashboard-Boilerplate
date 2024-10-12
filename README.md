
# React Express Postgres Docker Boilerplate

## Project Overview

This is a full-stack boilerplate application using React for the frontend, Express for the backend API, Postgres as the database, and Docker for containerization. The project is designed to be scalable, modular, and easy to set up for local development and deployment in Docker environments.

## Table of Contents

- [React Express Postgres Docker Boilerplate](#react-express-postgres-docker-boilerplate)
  - [Project Overview](#project-overview)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Clone the repository:](#clone-the-repository)
    - [Set up environment variables:](#set-up-environment-variables)
    - [Run the application:](#run-the-application)
    - [Access the application:](#access-the-application)
  - [Usage](#usage)
    - [Adding a User](#adding-a-user)
    - [Authentication](#authentication)
  - [Environment Variables](#environment-variables)
  - [Docker Setup](#docker-setup)
  - [User Management](#user-management)
  - [API Documentation](#api-documentation)
  - [Contributing](#contributing)
  - [License](#license)

## Features

- **React** for the frontend.
- **Express** backend with a modular structure.
- **Postgres** as the database.
- **Docker** setup for easy deployment and environment setup.
- JWT authentication.
- Role-based access control (RBAC).
- Google OAuth integration for user authentication.
- Swagger UI for API documentation.

## Installation

### Prerequisites

Make sure you have the following installed on your local development machine:

- Docker and Docker Compose
- Node.js and npm
- Git

### Clone the repository:

```bash
git clone <repository-url>
cd react-express-postgres-docker-boilerplate
```

### Set up environment variables:

1. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

2. Fill in the environment variables (for database, JWT secret, Google OAuth, etc.).

### Run the application:

To start the app with Docker Compose:

```bash
docker-compose up --build
```

This will build and start the containers for the backend, frontend, and Postgres.

### Access the application:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Swagger API docs: http://localhost:5000/api/docs

## Usage

### Adding a User

The project includes user management functionality, where you can:

- Create users.
- Assign roles.
- Enable/disable user accounts.
  
You can access the User Management page from the admin panel after logging in with admin privileges.

### Authentication

The app uses JWT for authentication. On successful login (with credentials or Google OAuth), a JWT token is saved in local storage. The token is used to make authenticated API requests.

## Environment Variables

Here are the main environment variables required for the app to run:

```bash
# Backend
BACKEND_HOST=localhost
BACKEND_PORT=5000
JWT_SECRET=your-jwt-secret

# Frontend
FRONTEND_HOST=localhost
FRONTEND_PORT=3000

# Database
DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=your_db_name

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Docker Setup

The project uses Docker Compose to orchestrate the frontend, backend, and Postgres database in different containers.

To build and run all containers:

```bash
docker-compose up --build
```

To stop and remove all containers:

```bash
docker-compose down
```

To run the containers in the background:

```bash
docker-compose up -d
```

## User Management

The project includes a full-featured user management module:

- **Roles**: Unlogged, Logged, Admin
- **Features**: Add, edit, delete users, toggle active/inactive status, and role-based access control.

The admin can manage users through the UI after logging in as an admin.

## API Documentation

Swagger UI is used for API documentation. After starting the app, access the docs at:

```
http://localhost:5000/api/docs
```

## Contributing

Pull requests are welcome! Please adhere to the following process:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to your branch (`git push origin feature-branch`).
5. Open a pull request.

## License

This project is licensed under the MIT License.
