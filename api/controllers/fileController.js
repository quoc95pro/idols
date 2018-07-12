var file = require("../models/fileModel");

module.exports = function(app){
    app.get("/api/files/:id", (req, res) => {
        file.find({folderid : req.params.id}, (err, file) => {
            if(err){
                throw(err);
            }else{
                res.json(file);
            }
        } )
    })
}