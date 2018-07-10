var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var idolSchema = new Schema({
    name: String,
    apiFolderId: {type : Number, default : null},
    dob : {type : Date, default : null},
    nationality : {type : String, default : 'Japan'},
    height : {type : Number, default : null},
    measurement : {
        Bust : {type : Number, default : null},
        Waist : {type : Number, default : null},
        Hips : {type : Number, default : null}
    },
    information : {type : String, default : null}
});

var Idol = mongoose.model("Idols", idolSchema);

module.exports = Idol;