var express = require("express"); 
var winston = require("winston"); 

var config = require("../config"); 

var app = express(); 

// start listening. 
var port = process.env.PORT || config.port
app.listen(port, function(){
  winston.log("info", "Server started listening on", port)
}); 
module.exports = app; 