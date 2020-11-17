const user = require('../models/user');
const {
    validationResult
} = require('express-validator');

exports.signup=(req,res,next)=>
{
   const User = new user({
    email: req.body.email,
    name: req.body.name,
    profile_url:req.body.profile_url,
    google_id:req.body.google_id,
    email_verified:true
});
    User.save()
}
exports.login=(req,res,next)=>
{
     user.findOne({google_id:req.body.google_id}).then(
         user=>
         {
            if (!user) {
                const error = new Error('User dose not exist');
                error.statusCode = 401;
                throw error;
            }
            if (!user.number_verified) {
                res.status(200).json({
                    message: "Contact Number Not Verified",
                    userId: user._id
                })
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
}