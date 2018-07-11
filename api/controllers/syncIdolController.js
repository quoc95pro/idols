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
                                    apiFolderId: value.id,
                                    avatar :{
                                        imageId : null,
                                        link : 'https://i.imgur.com/in7NQff.png' 
                                    },
                                    information : 'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth. Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of Lorem Ipsum decided to leave for the far World of Grammar.The Big Oxmox advised her not to do so, because there were thousands of bad Commas, wild Question Marks and devious Semikoli, but the Little Blind Text didn’t listen. She packed her seven versalia, put her initial into the belt and made herself on the way. When she reached the first hills of the Italic Mountains, she had a last view back on the skyline of her hometown Bookmarksgrove, the headline of Alphabet Village and the subline of her own road, the Line Lane.'
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
                
            async.eachSeries(ok, function (eachUrl, done) {
                setTimeout(function () {
                    requestVideo(eachUrl.apiFolderId,(rs)=>{
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
                
                console.log('statusCode:', response && response.statusCode); 
                body = JSON.parse(body);
                console.log('body:', body);
               
            });  
    });
}
