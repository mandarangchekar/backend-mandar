const user = require('../models/user');
const otps = require('../models/otp')
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const {
  validationResult
} = require('express-validator');

var accountSid = process.env.accountSid;
var authToken = process.env.authToken;
var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

exports.register = (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  user.findOne({
      _id: req.body.userId
    })
    .then(user => {
      console.log(user);
      user.contactNumber = req.body.contactNumber
      user.save().then(result => {
        let OTP = '';
        for (let i = 0; i < 4; i++) {
          OTP = OTP + Math.floor((Math.random() * 10));
        }
        otps.findOne({
            userId: result._id
          }).then(Otp => {
            Otp.otp2 = OTP;
            return Otp.save();
          })
          .then(result2 => {
            client.messages.create({
                body: result2.otp2,
                to: req.body.contactNumber, // Text this number
                from: process.env.phoneNumber // From a valid Twilio number
              })
              .then((message) => console.log(message.sid));
            res.status(200).json({
              message: "OTP SEND TO YOUR  CONTACT NUMBER",
            })
          
              const time = setInterval(() => {
                  otps.findOne({
                      userId: result2.userId
                  }).then((otp) => {
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
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    })
};

exports.otpCheck = (req, res, next) => {
  otps.findOne({
          userId: req.body.userId
      }).then((result) => {
          if (result.otp2 != req.body.otp) {
              const error = new Error('Invalid Otp');
              error.statusCode = 422;
              throw error;
          }
          user.findOne({
                  _id: req.body.userId
              }).then((USER) => {
                  USER.number_verified = true;
                  return USER.save();
              })
              .then((result) => {
                const token = jwt.sign({
                  email: result.email,
                  userId: result._id.toString(),
                  date: new Date(),
              }, "somesuperdoopersecret", {
      
              });
                  res.status(200).json({
                      message: "User Contact Number Verified",
                      token:token
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
                  otp.otp2 = OTP;
                  res.status(200).json({
                      message: "Otp Send To Your Contact Number",
                  })
                  otp.save().then((result) => {
                    console.log(result)
                    console.log(result.otp2)
                    client.messages.create({
                      body: result.otp2,
                      to: user.contactNumber, // Text this number
                      from: process.env.phoneNumber // From a valid Twilio number
                    })
                    .then((message) => console.log(message.sid));
                      
                  })
              
                      const time = setInterval(() => {
                          otps.findOne({
                              userId: req.body.userId
                          }).then((otp) => {
                              console.log(otp.otp2)
                              otp.otp2 = '';
                              otp.save()
                                  .then((result) => {
                                      console.log(result)
                                  })
                          })

                          clearInterval(time);
                      }, 120000)
                  
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