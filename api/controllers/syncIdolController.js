var Idol = require("../models/idolModel");
const https = require("https");
var config = require("../../config");
var async = require("async");
function getAllIdol(res){
    Idol.find(function(err, idols){
        if(err){
            res.status(500).json(err);
        }else{
            res.json(idols);
        }
    });
}

function checkIdolExist(name, callback){
     Idol.find({name: name}, function(err, idol){
         
        if(err){
            callback(null);
        }else{
            if(idol.length){
                callback(null); 
                console.log('not null');               
            }else{
                callback(name);
           }
        }
    });
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
               
                // for (var i = 0; i < body.result.folders.length; i++) {
                //         checkIdolExist(body.result.folders[i], function(ok){
                //                 if(ok){ 
                //                     seedIdol.push(ok);
                //                 }
                           
                //     }); 
                    
                // }   
              
                //console.log(seedIdol);
                async.forEachOf(body.result.folders, (value, key, callback) => {
                    // fs.readFile(__dirname + value, "utf8", (err, data) => {
                    //     if (err) return callback(err);
                    //     try {
                    //         configs[key] = JSON.parse(data);
                    //     } catch (e) {
                    //         return callback(e);
                    //     }
                    //     callback();
                    // });
                        checkIdolExist(value.name, function(name){
                            
                            if(name){
                                seedIdol.push({
                                    name: value.name,
                                    apiFolderId: value.id
                                });
                            }
                            callback();
                        });
                
                    
                }, err => {
                    if (err) console.error(err.message);
                      Idol.create(seedIdol, function(err, results){ 
                     });
                    
                });
               
                
               
             });
             
        });
        res.send({'status': 'success'});
    });   

    app.get("/api/test/:name", function(req,res){
       checkIdolExist(req.params.name, function(ok){
            if(ok){
                res.send("ok");
            }else{
                res.send("not ok");
            }
       });
    });
}