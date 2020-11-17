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
        required:true
    },
    name:
    {
        type:String,
        required:true
    },
    verified:
    {
        type:Boolean,
        default:false
    }
})

module.exports = mongoose.model('users',userSchema);