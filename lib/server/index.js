var express = require("express"); 
var winston = require("winston"); 

var config = require("../config"); 
var passport = require("./passport");  

// set up express
var app = express();

// configure it
require("./core")(app); 
require("./passport").init(app); 
app.use(require("./routes")(passport)); 

// and start listening
var port = process.env.PORT || config.port
app.listen(port, function(){
  winston.log("info", "Server started listening on", port)
}); 

module.exports = app; 