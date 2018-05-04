var Idol = require("../models/idolModel");
var Files = require("../models/fileModel");
const https = require("https");
var config = require("../../config");
var async = require("async");
var request = require('request');

// get all idol 
function getAllIdol(callback){
    Idol.find(function(err, idols){
        if(err){
            callback(err);
        }else{
            callback(idols);
        }
    });
}

// count all file
function countAllFiles(callback){
    Files.count(function(err, count){
        if(err){
            callback(err);
        }else{
            callback(count);
        }
    })
}

// check idol exist
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

// check file exist
    function checkFileExist(name, callback){
    Files.find({name: name}, function(err, files){
         
        if(err){
            callback(null);
        }else{
            if(files.length){
                callback(null); 
            }else{
                callback(name);
           }
        }
    });
}


// sync file promise
let requestVideoPr = (apiId) => {
    return new Promise((resolve, reject) => {

            request(config.getFileFromOpenload()+apiId, function (error, response, body) {
           
                //console.log('error:', error); 
                //console.log(apiId);
                //console.log('statusCode:', response && response.statusCode); 
                body = JSON.parse(body);
                async.forEachOf(body.result.files, (value, key, callback) => {
                    
                    checkFileExist(value.name, function(name){
                        if(name){
                            //console.log(value.name)
                            Files.create(value, function(err, results){ 
                            });
                        }
                        callback();
                    });

                    
                }, err => {
                    if (err) console.error(err.message);
                });

                    resolve(response.statusCode);
                
            });  
       
    });
 }

 let requestVideo = async (apiId, callback) => {
    let rs = await requestVideoPr(apiId);
    callback(rs);
}

// export api
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

            // async.forEachOf(ok, (value, key, callback) => {
            //     setTimeout(function () {
            //         requestVideo(value.apiFolderId,(rs)=>{
            //                 //console.log(rs);
            //                 callback();
            //         });
            //     },10000);
            // }, err => {
            //     if (err) console.error(err.message);
            //     res.send('ok');
            // });
                
            async.eachSeries(ok, function (eachUrl, done) {
                setTimeout(function () {
                    requestVideo(eachUrl.apiFolderId,(rs)=>{
                                        //console.log(rs);
                                        done();
                                });
                }, 100);
            }, function (err) {
                if (err)
                {
                    console.error(err.message);
                } else{
                    countAllFiles((count)=>{
                        res.send('Total row count : ' + count);
                    });
                }
                    
            });

        });
    });

    app.get("/api/test", (req, res) => {
        request(config.getFileFromOpenload()+'5186505', function (error, response, body) {
           
                //console.log('error:', error); 
                
                console.log('statusCode:', response && response.statusCode); 
                body = JSON.parse(body);
                console.log('body:', body);
               
            });  
    });
}
