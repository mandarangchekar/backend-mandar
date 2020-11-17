const Location =  require('../models/home');

app.get('/location/:id', function(req,res){
    Location.findById(req.params.id, function(err, foundUser){
        if(err){
            console.log(err)
        }else{
            res.send(foundUser);
        }
    });
});

app.get("/location", function(req,res){
    Location.find({}, function(err, users){
        if(err){
            console.log(err);
        }else{
            res.send(users);
        }
    });
});
