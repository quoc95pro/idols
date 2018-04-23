var Idol = require("../models/idolModel");
const https = require("https");
var config = require("../../config");
var async = require("async");
function getAllIdol(callback){
    Idol.find(function(err, idols){
        if(err){
            callback(err);
        }else{
            callback(idols);
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
            }else{
                callback(name);
           }
        }
    });
}

module.exports = function(app){
    // sync from openload
    app.get("/api/syncIdol", function(req, res){
         https.get(config.getIdolFromOpenload(), resp => {
            resp.setEncoding("utf8");
            let body = "";
            resp.on("data", data => {
                body += data;
            });
            
            resp.on("end", () => {
                var seedIdol = [];
                body = JSON.parse(body);
               
                async.forEachOf(body.result.folders, (value, key, callback) => {
                   
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
                         res.send(results);
                     });
                });

             });
             
        });
    });   
    // sync file from openload 
    app.get("/api/syncFile",  (req, res) => {
        getAllIdol(function(ok){
            async.forEachOf(ok, (value, key, callback) => {
                   
                https.get(config.getFileFromOpenload(), resp => {
                    resp.setEncoding("utf8");
                    let body = "";
                    resp.on("data", data => {
                        body += data;
                    });
                    
                    resp.on("end", () => {
                        var seedIdol = [];
                        body = JSON.parse(body);
                       
                        async.forEachOf(body.result.folders, (value, key, callback) => {
                           
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
                                 res.send(results);
                             });
                        });
        
                     });
                     
                });
            //
            }, err => {
                if (err) console.error(err.message);
                Idol.create(seedIdol, function(err, results){ 
                    res.send(results);
                });
            });
        });
    });


}