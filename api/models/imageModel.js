var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var imageSchema = new Schema({
    idIdol : String,
    idImgur : String,
    title : {type : String, default : null},
    type : {type : String, default : null},
    size : {type : number, default : null},
    nsfw : {type : String, default : null},
    deletehash : {type : String, default : null},
    link : {type : String, default : null}
})

var IdolImages = mongoose.model("IdolImages", imageSchema);

module.exports = IdolImages;