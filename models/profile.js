const mongoose = require('mongoose');

const userSchema = new mongoose.Schema ({
    name: String,
    username: String,
    reviews: String,
    pointsAdded: Number,
    availableReports: Number,
    durationReports: Number,

});



module.exports = new mongoose.model("Userdata", userSchema);
