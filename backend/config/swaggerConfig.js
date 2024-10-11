require('dotenv').config();  // Load environment variables
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API with PostgreSQL',
      version: '1.0.0',
      description: 'A simple Express API with PostgreSQL and Swagger documentation',
    },
    servers: [
      {
        url: `http://${process.env.BACKEND_HOST}:${process.env.BACKEND_PORT}`,  // Use environment variables for the server URL
      },
    ],
  },
  apis: ['./routes/*.js'],  // Path to the route files with Swagger docs
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

module.exports = swaggerDocs;
