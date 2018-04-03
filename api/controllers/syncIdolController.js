var Idol = require("../models/idolModel");
const https = require("https");
const url = "https://api.openload.co/1/file/listfolder?login=6d0fa8888208b015&key=CHIhWOYv";

function getAllIdol(res){
    Idol.find(function(err, idols){
        if(err){
            res.status(500).json(err);
        }else{
            res.json(idols);
        }
    });
}

module.exports = function(app){
    // sync from openload
    app.get("/api/syncIdol", function(req, res){
         https.get(url, res => {
            res.setEncoding("utf8");
            let body = "";
            res.on("data", data => {
                body += data;
            });
            
            res.on("end", () => {
                var seedIdol = [];
                body = JSON.parse(body);
                for (var i = 0; i < body.result.folders.length; i++) {
                    var idol = {
                        name: body.result.folders[i].name,
                        apiFolderId: body.result.folders[i].id
                    }
                    seedIdol.push(idol);   
                }   
                  Idol.create(seedIdol, function(err, results){
                    
                });
             });
             
        });
        res.send({'status': 'success'});
    });

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
        Idol.find({name:req.params.name}, function(err, idol){
            if(err){
                throw err;
            }else{
                res.json(idol);
            }
        });
    });

}