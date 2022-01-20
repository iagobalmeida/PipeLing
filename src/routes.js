const express = require("express");
const routes = express.Router();
const Controller = require('./app/controller/');

// Deals
routes.get('/deals', Controller.Deals.get);
routes.get('/deal/:id', Controller.Deals.getId);
routes.post('/deal', Controller.Deals.post);
routes.get('/deals/verify/pipedrive', Controller.Deals.verifyPipeDriveDeals);
routes.get('/deals/verify/mongo', Controller.Deals.verifyMongoDeals);

// Days
routes.get('/days', Controller.Days.get);
routes.get('/day/:date', Controller.Days.getDate);

module.exports = routes;