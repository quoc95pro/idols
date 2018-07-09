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

    // update idol by Id
    app.put("/api/idol", (req, res) =>{
        if(!req.body._id){                                                                                                                                                                                                                                                                                                                                      
            return res.status(500).send("ID is required");
        }else{
            Idol.update({_id : req.body._id},{
                name: req.body.name,
                apiFolderId: req.body.apiFolderId,
                dob : req.body.dob,
                nationality : req.body.nationality,
                height : req.body.height,
                measurement : {
                    bust : req.body.measurement.bust,
                    waist : req.body.measurement.waist,
                    hips : req.body.measurement.hips
                },
                information : req.body.information
            }, (err, idol) =>{
                if(err) return res.status(500).json(err);
                res.send('updated');
            })
        }
    });

    // create idol
    app.post("/api/idol", (req, res) => {
        var idol ={
            name: req.body.name,
            apiFolderId: req.body.apiFolderId,
            dob : req.body.dob,
            nationality : req.body.nationality,
            height : req.body.height,
            measurement : {
                bust : req.body.measurement.bust,
                waist : req.body.measurement.waist,
                hips : req.body.measurement.hips
            },
            information : req.body.information
        };

        Idol.create(idol, (err, idol) => {
            if(err) res.status(500).json(err);
            res.send('created');
        });
    });

    // delete idol 
    app.delete("/api/idol/:id", (req,res) =>{
        Idol.remove({
            _id : req.body._id
        }, (err, idol) => {
            if(err) res.status(500).json(err);
            res.send('deleted');
        })
    })
   
}    
