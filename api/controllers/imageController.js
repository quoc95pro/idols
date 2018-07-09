var IdolImages = require("../models/imageModel");

module.exports = function(app){
    // get all idol images
    app.get("/api/idolImages/:idIdol", (req, res) => {
        IdolImages.find({idIdol: req.params.id}, (err, idolImages) => {
            if(err){
                throw err;
            } else {
                res.json(idol);
            }
        })
    });

    app.put("/api/idolImages", (req, res) => {
        if(!req.body._id )
    })
}