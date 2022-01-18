const mongoose = require("mongoose");

const DealSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },
  value: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true,
    default: 'idle'
  }
});

const Deal = mongoose.model("deals", DealSchema);

Deal.createIndexes();

module.exports = Deal;