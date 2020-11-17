const userdatas = require('../models/profile');
const parks = require('../models/parking');
const bodyParser = require('body-parser');
const express = require('express');

const app = express();

app.use(bodyParser.urlencoded({
    extended:true
}));


//for personal user details..

// app.get('/user/:id', function(req,res){
//     Userdata.findById(req.params.id, function(err, foundUser){
//         if(err){
//             console.log(err)
//         }else{
//             res.send(foundUser);
//         }
//     });
// });
//
// app.get("/user", function(req,res){
//     Userdata.find({}, function(err, users){
//         if(err){
//             console.log(err);
//         }else{
//             res.send(users);
//         }
//     });
// });
//
//
// //for users parking details
//
// app.get("/park", function(req,res){
//     Park.find({}, function(err, users){
//         if(err){
//             console.log(err);
//         }else{
//             res.send(users);
//         }
//     });
// });
//
// app.get("/park/:id", function(req,res){
//     idOfUser = req.params.id;
//     Park.find({}, function(err, userFound){
//         if(userFound){
//             res.send(userFound);
//         }else{
//             console.log(err);
//         }
//     });
// });
//
//
//
//
//
//
//
exports.createParks=(req,res,next)=>
{
  const Park = new parks({
      checkIn:req.body.checkIn  });
  Park.save().then((result)=>{
    res.status(200).json({
            user:result
        })
  })
}



app.get("/park/:id", function(req,res){
  idOfUser = req.params.id;
  Park.findone({userId : idOfUser}, function(err, userFound){
    if(userFound){
      res.send(userFound)
    }else {
      console.log(err);
    }
  });
});


exports.create=(req,res,next)=>
{
  const Userdata = new userdatas({
      name:req.body.name  });
  Userdata.save().then((result)=>{
    res.status(200).json({
            user:result
        })
  })
}


exports.userData= (req,res,next)=>{
    // Userdata.findById(req.params.id, function(err, foundUser){
    //     if(err){
    //         console.log(err)
    //     }else{
    //         res.send(foundUser);
    //     }
    // });
    console.log(req.params.id);
    userdatas.findOne({_id:req.params.id}).then((result)=>
  {
    res.status(200).json({
            user:result
        })
  })
}

// exports.allUserData = (req,res,next) => {
//     Userdata.find({}, function(err, users){
//         if(err){
//             console.log(err);
//         }else{
//             res.send(users);
//         }
//     });
//
// }
