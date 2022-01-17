require('dotenv').config();

const express = require('express');
const basicAuth = require('express-basic-auth');
const mongoose = require('mongoose');
const db = require('./database/config');

class App {
    constructor() {
        this.express = express();
        
        this.initDatabase();
        this.signMiddlwares();
        this.signRoutes();

        this.express.listen(process.env.PORT, () => {
            console.log(`Listening on http://localhost:${process.env.PORT}`);
        })
    }

    initDatabase() {
        mongoose.connect(process.env.DB_URI, () => {
            console.log(`Connected to the database!`);
        });
    }

    signMiddlwares() {
        this.express.use(express.json());
        this.express.use(basicAuth({
            users: {
                admin: process.env.AUTH_PASSWORD
            },
            challenge: true
        }));
    }

    signRoutes() {
        this.express.use(require('./routes'));
    }
}

module.exports = new App().express;