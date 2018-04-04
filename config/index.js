var configValues = require("./config");

module.exports = {
    getDBConnectionString: function(){
        return 'mongodb://127.0.0.1:27017/idol';
    },
    getIdolFromOpenload: function(){
        return 'https://api.openload.co/1/file/listfolder?login=6d0fa8888208b015&key=CHIhWOYv';
    }
}