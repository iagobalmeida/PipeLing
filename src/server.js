require('dotenv').config();

const express = require('express');
const basicAuth = require('express-basic-auth');
const mongoose = require('mongoose');
const routes = require('./routes');

class App {
    constructor() {
        this.express = express();
        
        this.database();
        this.middlewares();
        this.routes();
        this.errorHandling();

        this.express.listen(process.env.PORT, () => {
            console.log(`Listening on http://localhost:${process.env.PORT}`);
        })
    }

    database() {
        mongoose.connect(process.env.DB_URI, () => {
            console.log(`Connected to the database!`);
        });
    }

    middlewares() {
        this.express.use(express.json());
        this.express.use(basicAuth({
            users: {
                admin: process.env.AUTH_PASSWORD
            },
            challenge: true
        }));
    }

    routes() {
        this.express.use(routes);
    }

    errorHandling() {
      // Logging
      this.express.use((err, req, res, next) => {
        console.error(err.stack);
        next(err);
      })
      // Returning
      this.express.use((err, req, res, next) => {
        return res.status(500).json({error: err});
      })
    }
}

module.exports = new App().express;