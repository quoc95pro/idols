var Idol = require("../models/idolModel");

function getAllIdol(res){
    Idol.find(function(err, idol){
        if(err){
            throw err;
        }else{
            res.json(idol);
        }
    });
}
module.exports = function(app){
    // get all idol from database
    app.get("/api/idols", function(req,res){
        getAllIdol(res);
    });

    // find idol by id
    app.get("/api/idolById/:id", function(req,res){
        Idol.findById({_id: req.params.id}, function(err, idol){
            if(err){
                throw err;
            }else{
                res.json(idol);
            }
        })
    });

    // find idol by name
    app.get("/api/idolByName/:name",function(req,res){
        Idol.find({name: { $regex: '.*' + req.params.name + '.*', $options: "i" } }, function(err, idol){
            if(err){
                throw err;
            }else{
                res.json(idol);
            }
        });
    });
   
}    
