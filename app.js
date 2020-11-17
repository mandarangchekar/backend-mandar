const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()
const bodyParser = require('body-parser');
const compression = require('compression');
const app = express();

const helmet = require("helmet");

const auth=require('./routes/auth')
const verify=require('./routes/verification')
const profile = require('./routes/profile')
const parking = require('./routes/parking')
const home = require('./routes/home')
const contactNumber=require('./routes/contactNumber_Verification')
app.use(helmet());
app.use(compression());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-6Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

app.use(bodyParser.json());

app.use(auth);
app.use(profile);
app.use(parking);
app.use(home);
app.use(verify);
app.use(contactNumber);
app.use((error,req,res,next)=>{
    const status = error.statusCode || 500;
    const message = error.message;
    const data =error.data;
    res.status(status).json({message:message,data:data});
})
console.log(process.env.mongo);
mongoose.connect(process.env.mongo)
.then(()=>
{
    console.log("connected");
})

.then((result)=>
{
    app.listen(process.env.PORT||8080);
})
.catch(err=>
{
    console.log(err);
    next(err);
})
