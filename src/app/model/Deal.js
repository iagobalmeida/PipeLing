const mongoose = require("mongoose");

const DealSchema = new mongoose.Schema({
    dealId: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    value: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("deals", DealSchema);