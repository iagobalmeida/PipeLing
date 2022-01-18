const mongoose = require("mongoose");

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