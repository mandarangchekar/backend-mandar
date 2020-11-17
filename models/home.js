

const mongoose = require('mongoose');


const homeSchema =  new mongoose.Schema({
    currentCity: String,
    pincode: Number,
    postcode: Number,
    currentLoation: Number,
    favourite: Number,
    lastSearchResult: Number
});

module.exports = new mongoose.model("Home", homeSchema);
