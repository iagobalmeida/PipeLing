// Requirements
require('dotenv').config();
const express = require('express');
const basicAuth = require('express-basic-auth');
const mongoose = require('mongoose');
const routes = require('./routes');

// Enviromentals
const PORT = process.env.PORT;
const DB_URI = process.env.DB_URI;
const AUTH_PASSWORD = process.env.AUTH_PASSWORD;

// Main class
class App {
  constructor() {
    this.express = express();
    this.database();
    this.middlewares();
    this.routes();
    this.errorHandling();
    this.express.listen(PORT, () => {
      console.log(`Server up & running.`);
    })
  }

  // Initialize mongoDB
  database() {
    mongoose.connect(DB_URI, () => {
      console.log(`Connected to the database.`);
    });
  }

  // Sign JSON and basicAuth middlewares
  middlewares() {
    this.express.use(express.json());
    this.express.use(basicAuth({
      users: {
        admin: AUTH_PASSWORD
      },
      challenge: true
    }));
  }

  // Sign routes
  routes() {
    this.express.use(routes);
  }

  // Sign error handling postwares 
  errorHandling() {
    // Logging
    this.express.use((err, req, res, next) => {
      console.error(err.message);
      next(err);
    })
    // Returning
    this.express.use((err, req, res, next) => {
      return res.status(500).json({
        error: err
      });
    })
  }
}

module.exports = new App().express;