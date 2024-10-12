
# React Express PostgreSQL Docker Boilerplate

This project is a boilerplate for building a web application using React for the frontend, Express for the backend, PostgreSQL as the database, and Docker for easy environment setup.

## Features

- **Frontend**: React with MUI for UI components.
- **Backend**: Express.js for building RESTful APIs.
- **Database**: PostgreSQL for data storage.
- **Authentication**: JWT-based authentication, including Google OAuth integration.
- **User Management**: Built-in user management (add, update, delete users, and toggle user active state).
- **Swagger Integration**: API documentation using Swagger.
- **Docker Support**: Docker Compose setup for managing the frontend, backend, and database services.
- **Role-Based Access Control (RBAC)**: Routes and UI visibility controlled based on user roles (`unlogged`, `logged`, `admin`).

## Project Structure

### Frontend Folder Structure:
```
frontend/
├── public/
│   └── assets/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── context/
│   ├── hooks/
│   ├── utils/
│   ├── styles/
│   └── .env
├── package.json
└── README.md
```

### Backend Folder Structure:
```
backend/
├── config/
├── controllers/
├── models/
├── routes/
├── middlewares/
├── services/
├── utils/
├── docs/
├── tests/
├── .env
├── app.js
├── server.js
├── package.json
└── README.md
```

## Setup Instructions

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [PostgreSQL](https://www.postgresql.org/)

### Steps

1. **Clone the repository**:
    ```bash
    git clone https://github.com/your-repo/react-express-postgres-docker-boilerplate.git
    ```

2. **Navigate to the project directory**:
    ```bash
    cd react-express-postgres-docker-boilerplate
    ```

3. **Configure the environment variables**:
    Create a `.env` file in the root of both the `frontend` and `backend` directories based on the `.env.example` files.

4. **Run the Docker services**:
    ```bash
    docker-compose up --build
    ```

5. **Access the application**:
    - Frontend: [http://localhost:3000](http://localhost:3000)
    - Backend API: [http://localhost:5000/api](http://localhost:5000/api)
    - Swagger Docs: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

### API Endpoints

- `/auth/login`: User login.
- `/auth/google-login`: Google OAuth login.
- `/users`: CRUD operations for managing users.
- `/api-docs`: Access the API documentation using Swagger UI.

### Role-Based Access Control (RBAC)

The routes and UI elements are visible based on the role of the logged-in user. The roles are:

- **Unlogged**: Default role for users who are not authenticated.
- **Logged**: Role for authenticated users.
- **Admin**: Role for administrators who have access to advanced functionality such as user management and API docs.

## Contributing

Feel free to submit issues, fork the repository, and send pull requests!

## License

This project is licensed under the MIT License.
