

const mongoose = require('mongoose');



const parkingSchema = new mongoose.Schema({

    userId: Number,
    checkIn: Number,
    checkOut: Number
});


module.exports = new mongoose.model("Park", parkingSchema);
