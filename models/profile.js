const mongoose = require('mongoose');

const userSchema = new mongoose.Schema ({
    name: String,
    username: String,
    reviews: String,
    pointsAdded: Number,
    availableReports: Number,
    durationReports: Number,

});

const parkingSchema = new mongoose.Schema({

    userId: Number,
    checkIn: Number,
    checkOut: Number
});


module.exports = new mongoose.model("User", userSchema);

module.exports = new mongoose.model("Park", parkingSchema);
