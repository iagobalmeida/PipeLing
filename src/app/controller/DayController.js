// Requirements
const DatabaseService = require('../services/DatabaseService');

// Day related routes
module.exports = {
  // Get all the days stored in mongoDB
  get: async (req, res, next) => {
    DatabaseService.findDay().then((data) => {
      return res.status(200).json(data);
    }).catch((error) => {
      next(error);
    })
  },
  
  // Get a day from mongoDB by its the date
  getDate: async (req, res, next) => {
    const date = req.params.date;
    DatabaseService.findDay({
      data
    }).then((data) => {
      return res.status(200).json(data);
    }).catch((error) => {
      next(error);
    })
  },
}