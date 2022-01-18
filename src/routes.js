const express = require("express");
const routes = express.Router();
const Controller = require('./app/controller/');

// Deals
routes.post('/deal',        Controller.Deals.post);
routes.get('/deals',        Controller.Deals.get);
routes.get('/deal/:id',     Controller.Deals.getId);

// Days
routes.get('/days',         Controller.Days.get);
routes.get('/day/:date',   Controller.Days.getDate);

// Routine
routes.get('/verifyDeals', Controller.Routines.verifyDeals);

module.exports = routes;