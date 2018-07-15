var configValues = require("./config");

module.exports = {
    getDBConnectionString: function(){
        // return 'mongodb://127.0.0.1:27017/idol';
        return `mongodb://${configValues.username}:${configValues.password}@ds235401.mlab.com:35401/idol`;
    },
    getIdolFromOpenload: function(){
        return 'https://api.openload.co/1/file/listfolder?login=6d0fa8888208b015&key=CHIhWOYv';
    },
    getFileFromOpenload: function(){
        return 'https://api.openload.co/1/file/listfolder?login=6d0fa8888208b015&key=CHIhWOYv&folder=';
    }
}