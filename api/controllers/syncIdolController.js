var Idol = require("../models/idolModel");
const https = require("https");
var config = require("../../config");

function getAllIdol(res){
    Idol.find(function(err, idols){
        if(err){
            res.status(500).json(err);
        }else{
            res.json(idols);
        }
    });
}

function checkIdolExist(name){
     var check = false;
     Idol.find({name: name}, function(err, idol){
        if(err){
            check = true;
        }else{
            check = false;
        }
    });
    return check;
}

module.exports = function(app){
    // sync from openload
    app.get("/api/syncIdol", function(req, res){
         https.get(config.getIdolFromOpenload(), res => {
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

    app.get("/api/test/:name", function(req,res){
        console.log(checkIdolExist(req.param.name));
    });
}