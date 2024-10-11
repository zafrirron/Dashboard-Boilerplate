const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swaggerConfig');  // Swagger documentation setup
require('dotenv').config();  // Load environment variables

const app = express();
const PORT = process.env.BACKEND_PORT || 5000;
const HOST = '0.0.0.0';  // Accept connection from all containers
const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';  // Load allowed origin from .env

// Enable CORS using the environment variable
app.use(cors({
  origin: allowedOrigin,
  credentials: true,  // Allow credentials if needed
}));


app.get('/api/test', (req, res) => {
  res.send('Test route is working');
});

// Serve Swagger API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Use the items route
const itemsRouter = require('./routes/items');
app.use('/api/items', itemsRouter);

// Start the server using the host and port from environment variables
app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
  console.log(`Swagger docs available at http://${HOST}:${PORT}/api-docs`);
});
