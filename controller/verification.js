const user = require('../models/user');
const otps = require('../models/otp')
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const transport = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: process.env.API_KEY
    }
}))

exports.otpcheck = (req, res, next) => {
    otps.findOne({
            userId: req.body.userId
        }).then((result) => {
            if (result.otp != req.body.otp) {
                const error = new Error('Invalid Otp');
                error.statusCode = 422;
                throw error;
            }
            user.findOne({
                    _id: req.body.userId
                }).then((USER) => {
                    USER.email_verified = true;
                    return USER.save();
                })
                .then((result) => {
                   
                    res.status(200).json({
                        message: "User Email Varified",
                    
                    })
                })
                .catch(error => {
                    console.log(error)
                })

        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}
exports.resend = (req, res, next) => {
    user.findOne({
            _id: req.body.userId
        }).then((user) => {
            console.log(user)

            if (user.email_verified) {
                const error = new Error('User email already verified');
                error.statusCode = 422;
                throw error;
            }
            
            if (user.number_verified) {
                const error = new Error('User Contact Number already verified');
                error.statusCode = 422;
                throw error;
            }
            let OTP = '';
            for (let i = 0; i < 4; i++) {
                OTP = OTP + Math.floor((Math.random() * 10));
            }
            otps.findOne({
                userId: req.body.userId
            }).then(
                otp => {
                    otp.otp = OTP;
                    res.status(200).json({
                        message: "Otp Send To Your Mail",
                    })
                    otp.save().then((result) => {
                        transport.sendMail({
                            to: user.email,
                            from: 'kavikmr9@gmail.com',
                            subject: 'NEW OTP',
                            html: '<p> your otp is ' + result.otp + ' </p>'

                        })
                        

                        const time = setInterval(() => {
                            otps.findOne({
                                userId: req.body.userId
                            }).then((otp) => {
                                console.log(otp.otp)
                                otp.otp = '';
                                otp.save()
                                    .then((result) => {
                                        console.log(result)
                                    })
                            })

                            clearInterval(time);
                        }, 120000)
                    })
                }
            )
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });

}