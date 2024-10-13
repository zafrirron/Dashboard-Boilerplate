const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swaggerConfig');  // Swagger documentation setup
const requireRole = require('./middlewares/requireRole');  // Import role middleware
const routesConfig = require('/usr/src/common/routesConfig');  // Import centralized config
require('dotenv').config();  // Load environment variables
const cookieParser = require('cookie-parser'); // Import cookie-parser
const bodyParser = require('body-parser');
const rateLimiter = require('./middlewares/rateLimiter');
const helmet = require('helmet');

const app = express();

// Add cookie-parser middleware
app.use(cookieParser());

// Other middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//Rate Limiter
app.use('/api', rateLimiter); // Apply rate limiting to all /api routes
app.use(helmet()); // Apply helmet to secure headers

const PORT = process.env.BACKEND_PORT || 5000;
const HOST = '0.0.0.0';  // Accept connection from all containers
const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';  // Load allowed origin from .env

// Enable CORS using the environment variable
app.use(cors({
  origin: allowedOrigin,
  credentials: true,  // Allow credentials if needed
}));

app.use(express.json());  // Add middleware to parse JSON requests

// Protect the /api-docs route using requireRole('apiDocs') from routesConfig.js
app.use('/api/apidocs', requireRole('apiDocs'), swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// Routes
const itemsRouter = require('./routes/itemsRoutes');
const authRouter = require('./routes/authRoutes');  // Include auth routes
const adminRouter = require('./routes/adminRoutes');  // Include the new admin routes

app.use('/api/items', itemsRouter);
app.use('/api/auth', authRouter);  // Add auth routes
app.use('/api/admin', adminRouter);  // Register the admin routes
//app.use('/api/profile', authRouter);  // Register the admin routes

// Start the server using the host and port from environment variables
app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
  console.log(`Swagger docs available at http://${HOST}:${PORT}/api-docs (Admins only)`);
});
