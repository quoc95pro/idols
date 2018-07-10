var IdolImages = require("../models/imageModel");

module.exports = function(app){
    // get all idol 's images
    app.get("/api/idolImages/:idIdol", (req, res) => {
        IdolImages.find({idIdol: req.params.idIdol}, (err, idolImages) => {
            if(err){
                throw err;
            } else {
                res.json(idolImages);
            }
        })
    });

    // get first idol 's image
    app.get("/api/idolImage/:idIdol", (req, res) => {
        IdolImages.find({idIdol: req.params.idIdol}).sort({'title': '1'}).limit(1).exec( (err, idolImages) => {
            if(err){
                throw err;
            } else {
                res.json(idolImages);
            }
        })
    });

    // insert image 's info
    app.post("/api/idolImages", (req, res) => {
        var image = {
            idIdol : req.body.idIdol,
            idImgur : req.body.idImgur,
            title : req.body.title,
            type : req.body.type,
            size : req.body.size,
            nsfw : req.body.nsfw,
            deletehash : req.body.deletehash,
            link : req.body.link
        }

        IdolImages.create(image, (err, img) => {
            if(err) res.status(500).json('err');
            res.send('created');
        })
    });

    // delete image
    app.delete("/api/idolImages/:id", (req, res) => {
        IdolImages.remove({
            _id : req.body._id
        }, (err, img) => {
            if(err) res.status(500).json(err);
            res.send('deleted');
        })
    });
}