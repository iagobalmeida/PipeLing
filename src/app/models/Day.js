const mongoose = require("mongoose");

// Days aggregate the deals made in a day, holding the sum of all the values from the deals.
const DaySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  value: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model("days", DaySchema);