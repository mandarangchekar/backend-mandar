

const mongoose = require('mongoose');


const locationSchema =  new mongoose.Schema({
    currentCity: String,
    pincode: Number,
    postcode: Number,
    currentLoation: Number,
    favourite: Number,
    lastSearchResult: Number
});

module.exports = new mongoose.model("Loaction", parkingSchema);
