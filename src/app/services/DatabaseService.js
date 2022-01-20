const Day = require("../models/Day");
const Deal = require("../models/Deal");

// Abstracts the connection to database
class DatabaseService {
  // Receives the information for inserting a Deal in mongoDB
  // Increment the Deal value in the Day register
  async insertDeal(data) {
    let deal, day;
    try {
      const {
        id,
        person_name,
        value,
        date,
        status
      } = data;
      deal = await Deal.create({
        id,
        person_name,
        value,
        date,
        status
      });
      day = await this.updateDay({ date, value });
      // Day.updateOne({ dayDate }, { $inc: { 'value': value } }, { upsert: true });
    } catch (error) {
      return;
    } finally {
      return {
        deal,
        day
      };
    }
  }

  // Retrieves the deals from MongoDB
  async findDeals(filter) {
    return await Deal.find(filter);
  }

  // Retrieves one unique deal
  async findOneDeal(filter) {
    return await Deal.findOne(filter);
  }

  // Update a deal found by its ID
  async updateDeal(data) {
    const {
      id,
      status
    } = data;
    return await Deal.findOneAndUpdate({ id }, { status }, { new: true });
  }

  // Retrieves the days from MongoDB
  async findDay(filter) {
    return await Day.find(filter);
  }

  // Update a day found by its date
  async updateDay(data) {
    const {
      date,
      value
    } = data;
    const dayDate = new Date(date).toISOString().split('T')[0];
    return await Day.updateOne({ date: dayDate }, { $inc: { 'value': value } }, { upsert: true });
  }
}

module.exports = new DatabaseService();