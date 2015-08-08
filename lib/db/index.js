var mongoose = require("mongoose"); 
var winston = require("winston");

// load the config
var config = require("../config"); 

// load the schemas
module.exports.models = require("./models"); 

// set connection handlers
var connect = function () {
  var options = { server: { socketOptions: { keepAlive: 1 } } };
  mongoose.connect(config.mongodb_url, options, function(err){
    if(err){
      winston.log("error", "Could not connect to database at", config.mongodb_url); 
      winston.log("error", "Fatal error encountered, exiting. "); 
      process.exit(1); 
    } else {
      winston.log("info", "Connected to database at", config.mongodb_url); 
    }
  });
};

mongoose.connection.on('error', function(e){
  winston.log('error', e); 
});

mongoose.connection.on('disconnected', connect);

// and connect. 
module.exports.connection = connect(); 

