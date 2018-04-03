var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var idolSchema = new Schema({
    name: String,
    apiFolderId: String
});

var Idol = mongoose.model("Idols", idolSchema);

module.exports = Idol;