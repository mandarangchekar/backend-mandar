const User = require('../models/profile');
const Park = require('../models/profile');

//for personal user details..

app.get('/user/:id', function(req,res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            console.log(err)
        }else{
            res.send(foundUser);
        }
    });
});

app.get("/user", function(req,res){
    User.find({}, function(err, users){
        if(err){
            console.log(err);
        }else{
            res.send(users);
        }
    });
});


//for users parking details

app.get("/park", function(req,res){
    Park.find({}, function(err, users){
        if(err){
            console.log(err);
        }else{
            res.send(users);
        }
    });
});

app.get("/park/:id", function(req,res){
    idOfUser = req.params.id;
    Park.find({}, function(err, userFound){
        if(userFound){
            res.send(userFound);
        }else{
            console.log(err);
        }
    });
});
