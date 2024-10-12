
# React Express PostgreSQL Docker Boilerplate

This project is a boilerplate setup for a full-stack application using React on the frontend, Express for the backend, PostgreSQL as the database, and Docker for containerization.

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
│   ├── init.sql
│   └── Dockerfile
├── common/
│   └── routesConfig.js
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

### Running the Application

To build and start the containers, run:

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
      icon: icons.home ? icons.home : null,
      page: 'HomePage',
    },
    admin: {
      path: '/admin',
      roles: ['admin'],
      frontendVisible: true,
      icon: icons.admin ? icons.admin : null,
      children: {
        userManagement: {
          path: '/admin/user-management',
          roles: ['admin'],
          frontendVisible: true,
          icon: icons.userManagement ? icons.userManagement : null,
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
  icon: icons.newPage ? icons.newPage : null,
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
