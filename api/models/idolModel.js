var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var idolSchema = new Schema({
    name: String,
    apiFolderId: {type : Number, default : null},
    dob : {type : Date, default : null},
    nationality : {type : String, default : 'Japan'},
    height : {type : Number, default : null},
    measurement : {
        bust : {type : Number, default : null},
        waist : {type : Number, default : null},
        hips : {type : Number, default : null}
    }
});

var Idol = mongoose.model("Idols", idolSchema);

module.exports = Idol;