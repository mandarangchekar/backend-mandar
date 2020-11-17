const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const otpSchema = new Schema({
  
    otp:{
        type:String,
    },
    otp2:
    {
        type:String
    },
    userId:
    {
        type:String,
        required:true
    }

})

module.exports = mongoose.model('otps',otpSchema);