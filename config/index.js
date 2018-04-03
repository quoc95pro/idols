var configValues = require("./config");

module.exports = {
    getDBConnectionString: function(){
        return 'mongodb://127.0.0.1:27017/idol';
    }
}