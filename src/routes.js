const express = require("express");
const routes = express.Router();
const DealController = require('./app/controller/DealController');


routes.post('/deal',        DealController.post);
routes.put('/deal',         DealController.put);
routes.delete('/deal/:id',  DealController.delete);
routes.get('/deals',        DealController.get);
routes.get('/deal/:id',     DealController.getById);

module.exports = routes;