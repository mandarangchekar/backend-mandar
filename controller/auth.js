const user = require('../models/user');
const {
    validationResult
} = require('express-validator');
const otps = require('../models/otp')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const transport = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: process.env.API_KEY
    }
}))
var accountSid = process.env.accountSid;
var authToken = process.env.authToken;  

var twilio = require('twilio');
var client = new twilio(accountSid, authToken);



require('dotenv').config();
exports.signup = (req, res, next) => {
    console.log(req.body.email);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const name = req.body.name;
    const contactNumber = req.body.contactNumber;
    
    const strongRegex2 = new RegExp("^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$");
    if (!strongRegex2.test(req.body.contactNumber)) {
        const error = new Error('Enter Correct Contact Number');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    

    const User = new user({
        email: email,
        name: name,
        contactNumber: contactNumber,
    });
    User.save().then(result => {
            res.status(200).json({
                message: "OTP IS SEND TO YOUR Mail and Contact Number",
                userId: result._id.toString()
            })
            let OTP = '';
            let OTP2 = '';
            for (let i = 0; i < 4; i++) {
                OTP = OTP + Math.floor((Math.random() * 10));
                OTP2 = OTP2 + Math.floor((Math.random() * 10));
            }
            console.log(OTP);
            const Otps = new otps({
                otp: OTP,
                otp2: OTP2,
                userId: result._id.toString()
            })

            Otps.save().then((result) => {
                    transport.sendMail({
                        to: req.body.email,
                        from: 'kavikmr9@gmail.com',
                        subject: 'OTP',
                        html: '<p>your otp is' + result.otp + '</p>'
                    })
                    client.messages.create({
                        body: result.otp2,
                        to: req.body.contactNumber,  // Text this number
                        from: process.env.phoneNumber // From a valid Twilio number
                    })
                    .then((message) => console.log(message.sid));
                    console.log(result.otp, result.otp2);
                })
                .then(() => {
                    console.log("otp send")
                    const time = setInterval(() => {
                        otps.findOne({
                            userId: result._id
                        }).then((otp) => {
                            otp.otp = '';
                            otp.otp2 = '';
                            otp.save()
                                .then((result) => {
                                    console.log(result)
                                })
                        })

                        clearInterval(time);
                    }, 120000)
                })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.login = (req, res, next) => {

    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(String(req.body.credential).toLowerCase())) {
        user.findOne({
                email: req.body.credential.toLowerCase()
            })
            .then(user => {

                if (!user) {
                    const error = new Error('A user with this email could not be found');
                    error.statusCode = 401;
                    throw error;
                }
                if (!user.verified) {
                    res.status(200).json({
                        message: "Please Verify Yourself First",
                        userId: user._id
                    })
                }
                let OTP = '';
                for (let i = 0; i < 4; i++) {
                    OTP = OTP + Math.floor((Math.random() * 10));
                }
                user.login_otp = OTP;
                user.save().then((result) => {
                    res.status(200).json({
                        userId: result._id,
                        message: "Otp Send to Your Mail"
                    })
                    transport.sendMail({
                        to:result.email,
                        from: 'kavikmr9@gmail.com',
                        subject: 'OTP',
                        html: '<p>your otp is' + result.login_otp + '</p>'
                    })
                })
                .then(result=>
                    {
                        const time = setInterval(() => {
                                user.login_otp = '';
                                
                                user.save()
                                    .then((result) => {
                                        console.log(result)
                                    })
                        

                            clearInterval(time);
                        }, 120000)
                    })
               
            })
              .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            })
        }          
        else{
            user.findOne({contactNumber:req.body.credential})
            .then(user=>{
                console.log(user);
            if (!user) {
                const error = new Error('A user with this contactNumber could not be found');
                error.statusCode = 401;
                throw error;
            }
            if (!user.verified) {
                res.status(200).json({
                    message: "Please Verify Yourself First",
                    userId: user._id
                })
            }
            let OTP = '';
            for (let i = 0; i < 4; i++) {
                OTP = OTP + Math.floor((Math.random() * 10));
            }
            user.login_otp = OTP;
            user.save().then((result) => {
                res.status(200).json({
                    userId: result._id,
                    message: "Otp Send to Your Contact Number"
                })
                client.messages.create({
                    body: result.login_otp,
                    to: result.contactNumber,  // Text this number
                    from: process.env.phoneNumber // From a valid Twilio number
                })
        
                .then((message) => console.log(message.sid));
            })
            .then(result=>
                {
                    const time = setInterval(() => {
                            user.login_otp = '';
                            
                            user.save()
                                .then((result) => {
                                    console.log(result)
                                })
                    

                        clearInterval(time);
                    }, 120000)
                })
           
        })
          .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
        }
}
exports.loginOtp=(req,res,next)=>
{
    user.findOne({
        _id:req.body.userId
    })
    .then(user => {
         console.log(user)
        if (!user) {
            const error = new Error('A user can not be found');
            error.statusCode = 401;
            throw error;
        }
        if(user.login_otp!=req.body.otp)
        {
            const error = new Error('Otp Dose not Match');
            error.statusCode = 401;
            throw error; 
        }
        const token = jwt.sign({
            email: user.email,
            userId: user._id.toString(),
            date: new Date(),
        }, "somesuperdoopersecret", {

        });
        res.status(200).json({
            token: token,
            user: user
        })

    }
    )
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
}