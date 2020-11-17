const express = require('express');
const {
    body
} = require('express-validator')
const user = require('../models/user');
const contactNumberController = require('../controller/contactNumber')
const router = express.Router();


router.post('/contactNumber',[
    body('contactNumber').custom((value, {
        req
    }) => {
        return user.findOne({
            contactNumber: value
        }).then(userDoc => {
            console.log(!!userDoc)
            if (!!userDoc) {
                console.log("HELLO")
                return Promise.reject('Contact Number already exists');
            }
        })
    }),
],contactNumberController.register),

router.post('/ContactOtpcheck',contactNumberController.otpCheck);
router.post('/ContactResendOtp',contactNumberController.resend)

module.exports = router