
# React Express PostgreSQL Docker Boilerplate

## Project Overview

This project is a **full-stack boilerplate** designed to jump-start the development of web applications using **React** for the frontend, **Express** for the backend, **PostgreSQL** as the database, and **Docker** for containerization. 

The boilerplate comes with built-in **role-based user management (RBAC)**, allowing for flexible user roles and permissions. It includes authentication via **JWT tokens** for both traditional email/password logins and **Google OAuth** for seamless social authentication.

### Key Features:

- **Role-Based Access Control (RBAC)**: 
  - Built-in user role management, where different users can have distinct access rights based on their role (e.g., admin, user, guest). 
  - Page visibility and access are dynamically configured in both the frontend and backend based on the user’s role.
  
- **Google OAuth Login Integration**: 
  - Integrated **Google OAuth** support for user authentication in addition to email/password login. Google login can be configured from the backend with JWT tokens generated for authorized users.
  
- **Dynamic RBAC Configuration**: 
  - Configurable routes that allow you to define role-specific access to certain pages or sections of the application, with pages automatically hidden or shown based on the user's role.
  
- **JWT-Based Authentication**: 
  - **JWT tokens** are used for stateless user authentication, ensuring secure communication between the client and server. Tokens are automatically checked for validity and expiration.
  
- **Containerized Environment**: 
  - The project uses **Docker Compose** to orchestrate the services. The entire app (frontend, backend, and PostgreSQL database) runs within Docker containers for an isolated and scalable development environment.
  
- **Centralized Error Handling**: 
  - The backend includes centralized error handling middleware, ensuring consistent and reliable error reporting.
  
- **PostgreSQL with Migrations and Seeding**: 
  - The project uses **PostgreSQL** as the database, and includes support for migrations and seeding for easy database setup and management.

- **PGAdmin**: 
  - The project uses **PGAdmin** as the database management tool.

- **Customizable API and Swagger Documentation**:
  - Built-in support for **Swagger API documentation** for every route, allowing for clear API documentation and testing.

### Additional Features

-  **Rate Limiter**: brute-force attacks protection.
-  **Helmet**: Header security protection.
-  **User Profile Page**
-  **Token Expiry**: set in .env Auto logout after expiry 

---

### Technologies Used:

- **Frontend**: 
  - React with modern hooks and components.
  - MUI (Material-UI) for responsive design and styling.
  
- **Backend**: 
  - Express.js for building the REST API.
  - JWT for authentication.
  - Node.js with PostgreSQL for data persistence.
  
- **Database**: 
  - PostgreSQL with support for migrations and seeding.
  - PGAdmin Postgress db managment Frontend
  
- **Authentication**:
  - Email/password login with hashed credentials.
  - Google OAuth login integration for social login.
  
- **Containerization**:
  - Docker and Docker Compose for setting up the services.
  
- **Role-Based Security**:
  - Secure role-based access control (RBAC) system to manage access to specific pages and API routes based on user roles.
  
---

### How to Use:

1. **Clone the repository**:
    ```bash
    git clone <repository_url>
    ```

2. **Environment Configuration**:
   Create a `.env` file in the root directory to specify environment variables like database connection, JWT secret, and Google OAuth credentials:
   
    ```
    # .env file
    # Backend Frontend params
    REACT_APP_APP_NAME=React Express PG Boilerplate
    REACT_APP_TOKEN_EXPIRY_TIME=3600
    BACKEND_HOST=localhost
    BACKEND_PORT=5000
    FRONTEND_HOST=localhost
    FRONTEND_PORT=3000
    CORS_ORIGIN=http://${FRONTEND_HOST}:${FRONTEND_PORT}
    BACKEND_API_URL=http://${BACKEND_HOST}:${BACKEND_PORT}

    # DB params
    POSTGRES_PASSWORD=superuserpassword
    DB_HOST=db
    DB_PORT=5432
    DB_NAME=your_db_name
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password

    # tokens and google auth params
    JWT_SECRET=your_jwt_secret
    GOOGLE_CLIENT_ID=your_google_client_id
    EACT_APP_GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
    GOOGLE_CLIENT_SECRET=your_google_client_secret

    # Node params
    NODE_ENV=development

    # Logger params
    LOG_LEVEL=info  # error, warn, info, http, verbode, debug, silly

    # PGAdmin params 
    PGADMIN_EMAIL=pgpadmin@email.com
    PGADMIN_PASSWORD=pgpadminpassword

    ```

3. **Docker Setup**:
    Build and run the app with Docker Compose:
    
    ```bash
    docker-compose up --build
    ```

4. **Accessing the App**:
    - The frontend will be available at `http://localhost:3000`.
    - The backend API will be available at `http://localhost:5000`.
    - Swagger documentation will be available at `http://localhost:5000/api-docs`.
    - PGAdmin db management frontend will be available at `http://localhost:5050/browser-docs`.

---


## Project Folder Structure

Here's an overview of the folder structure for this boilerplate:

```
.
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   ├── middlewares/
│   │   └── logger.js
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── tests/
│   ├── Dockerfile
│   ├── app.js
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── assets/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── styles/
│   ├── Dockerfile
│   └── package.json
├── db/
│   └── init.sql
├── pgadmin-data/
├── common/
│   └── routesConfig.js
├── scripts/
├── docker-compose.yml
├── README.md
└── .env
```

## Docker Setup

This project uses Docker to containerize the frontend, backend, and PostgreSQL services.

### Docker Compose

The `docker-compose.yml` file is in the root directory and manages the following services:

1. **Frontend**: React app served by Nginx.
2. **Backend**: Express app running on Node.js.
3. **Database**: PostgreSQL with initialized scripts from the `db/init.sql` file.
4. **DB Managemnt**: PGAdmin db managment tool.

### Running the Application

To build and start the containers, run:

Pgadmin db server registration script (one time)
```bash
bash ./scripts/generate_servers_json.sh
```
Docker Compose 
```bash
docker-compose up --build
```

This will launch all the services and bind the frontend to `http://localhost:3000` and the backend API to `http://localhost:5000`.

## Logger Framework

This boilerplate uses a logging middleware that captures and logs requests. The logger is located in `backend/middlewares/logger.js`.

To use the logger, simply include it in your `app.js`:

```js
const logger = require('./middlewares/logger');
app.use(logger);
```

Logs are generated in the following format:
- Request Method
- Request URL
- Status Code
- Response Time

Example log entry:

```
[INFO] GET /api/users 200 25ms
```

## Routes Configuration

We use a shared `routesConfig.js` located in the `common/` folder to define routes for both the frontend and backend.

### routesConfig.js

This file contains all routes with role-based access control, icons for frontend display, and custom logic to handle child routes.

#### Example Entry:

```js
module.exports = {
  routes: {
    home: {
      path: '/',
      roles: ['unlogged', 'logged', 'admin'],
      frontendVisible: true,
      icon: 'Home',
      page: 'HomePage',
    },
    admin: {
      path: '/admin',
      roles: ['admin'],
      frontendVisible: true,
      icon: 'AdminPanelSettings',
      children: {
        userManagement: {
          path: '/admin/user-management',
          roles: ['admin'],
          frontendVisible: true,
          icon: 'GroupAdd',
          page: 'UserManagementPage',
        },
      },
    },
  },
};
```

### Adding Pages to the Frontend

To add a new page, follow these steps:

1. **Create the page**: Add a new React component to the `frontend/src/pages/` folder, e.g., `MyNewPage.js`.
2. **Define the route**: Update `common/routesConfig.js` to include your new page:

```js
myNewPage: {
  path: '/my-new-page',
  roles: ['logged', 'admin'],
  frontendVisible: true,
  icon:'MUIIconName',
  page: 'MyNewPage',
},
```

3. **Accessing the Page**: After defining the route, the app will dynamically load the component and display it based on user roles.

### Adding API Routes to the Backend

1. **Create a new route**: In the `backend/routes/` folder, create a new route file, e.g., `myNewRoute.js`.
2. **Register the route**: In `backend/app.js`, import and register the route:

```js
const myNewRoute = require('./routes/myNewRoute');
app.use('/api/my-new-route', myNewRoute);
```

3. **Role-based Access Control**: Use the `requireRole` middleware to restrict access:

```js
const requireRole = require('../middlewares/requireRole');
router.get('/', requireRole('admin'), myNewController);
```

### Database Initialization

The `db/` folder contains the `init.sql` script used to initialize the PostgreSQL database. Make sure the `init.sql` script includes the necessary schema definitions.

To reset the database, you can use:

```bash
docker-compose down -v
docker-compose up --build
```

## Additional Notes

- **Environment Variables**: Use the `.env` file to store sensitive configuration such as database credentials, API keys, etc.
- **PostgreSQL Configuration**: The PostgreSQL database is initialized with the `init.sql` script located in the `db/` folder.
- **PGAdmin Configuration**: The PGAdmin PostgreSQL database registration is initialized with the `generate_servers_json.sh` script located in the `scripts/` folder.
