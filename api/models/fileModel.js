var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var filesSchema = new Schema({
    name: String,
    cblock : String,
    sha1 : String,
    folderid: String,
    upload_at : String,
    status : String,
    size : String,
    content_type: String,
    download_count : String,
    cstatus : String,
    link : String,
    linkextid : String 

});

var Files = mongoose.model("Files", filesSchema);

module.exports = Files;