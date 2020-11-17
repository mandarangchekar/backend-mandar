const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email:
    {
        type:String,
        required:true
    },
    login_otp:
    {
        type:String
    },
    contactNumber:
    {
        type:String,
        default:"",
    },
    name:
    {
        type:String,
        required:true
    },
    email_verified:
    {
        type:Boolean,
        default:false
    },
    number_verified:
    {
        type:Boolean,
        default:false
    },
    google_id:
    {
        type:String
    },
    facebook_id:
    {
        type:String
    },
    profile_url:
    {
        type:String
    }
})

module.exports = mongoose.model('users',userSchema);