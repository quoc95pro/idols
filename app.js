var express = require("express");
var bodyParser = require("body-parser");
var morgan =require("morgan");
var mongoose = require("mongoose");
var syncIdolController = require("./api/controllers/syncIdolController");
var idolController = require("./api/controllers/idolController");
var imageController = require("./api/controllers/imageController");
var fileController = require("./api/controllers/fileController");

var config = require("./config");
var app = express();
var port = process.env.PORT || 3000;

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}


app.use(allowCrossDomain);
 

app.use("/assets", express.static(__dirname + "public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.use(morgan("dev"));
mongoose.connect(config.getDBConnectionString());

app.set("view engine", "ejs");

syncIdolController(app);
idolController(app);
imageController(app);
fileController(app);

app.get("/", function(req, res){
  res.render("index");
});

app.listen(port, function(){
  console.log("App listening on port: " + port);
});

app.post('/getFile', (req,res) =>{
   console.log( req.body);
})