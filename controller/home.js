const userdatas = require('../models/profile');
const parks = require('../models/parking');
const homes = require('../models/home');
const bodyParser = require('body-parser');
const express = require('express');

const app = express();

app.use(bodyParser.urlencoded({
    extended:true
}));





exports.createLocations=(req,res,next)=>
{
  const Home = new homes({
      currentCity:req.body.currentCity  });
  Home.save().then((result)=>{
    res.status(200).json({
            user:result
        })
  })
}


exports.location= (req,res,next)=>{

    console.log(req.params.id);
    locations.findOne({_id:req.params.id}).then((result)=>
  {
    res.status(200).json({
            user:result
        })
  })
}
