const Day = require("../model/Day");
const Deal = require("../model/Deal");

class DatabaseController {
  async insertDeal(data) {
    let deal, day;
    try {
      const { id, value, date, status } = data;
      deal = await Deal.create({ id, value, date, status });
      day = await Day.updateOne({ date }, { $inc: { 'value': value } }, { upsert: true });
    } catch (error) {
      console.log('Error inserting deal and updating day:', error.message);
    } finally {
      return { deal, day };
    }
  }

  async findDeal(filter) {
    return await Deal.find(filter);
  }

  async findOneDeal(filter) {
    return await Deal.findOne(filter);
  }

  async updateDeal(data) {
    const { id, value, status } = data;
    return await Deal.findOneAndUpdate({ id }, { status }, { new: true });
  }

  async findDay(filter) {
    return await Day.find(filter);
  }

  async updateDay(data) {
    const { date, value } = data;
    return await Day.updateOne({ date }, { $inc: { 'value': value } }, { upsert: true });
  }
}

module.exports = new DatabaseController();