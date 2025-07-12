require("dotenv").config()
const cors = require('cors');
const express = require('express');
const path = require('path');
const routes = require('./routes/routes');
const port = process.env.PORT;
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerSpec = swaggerJsdoc({
  definition:{
    openapi: '3.0.0',
    info: {
      title: 'Blog API',
      version: '1.0.0',
      description: 'Blog API with authentication, authorization and pagination'
    },
  },
  apis: [path.join(__dirname, './routes/routes.js')]
});

// Express app
const app = express()
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.urlencoded({extended: true}));
app.use(cors())
app.use(express.json())
app.set('trust proxy',1);

// Routes
app.use(routes)


// Error Handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  if (error.msg === 'Email already exists') { 
    return res.status(409).json({ message: 'Email is already registered' });
  }
  console.error(error)
  res.status(500).json({ message: "Internal Server Error" });
});


// Listening
app.listen(port,()=> console.log(`Serving on http://localhost:${port}`));