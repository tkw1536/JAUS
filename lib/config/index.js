var winston = require("winston"); 
var extend = require("extend");

// default config
var default_config = {
  "port": 3000, // port for the express server to listen to
  "mongodb_url": "mongodb://localhost/JAUS" // connection for mongodb
}; 

// user config
var user_config = {}; 

// try to load from /config.json
try{
  user_config = require("../../config.json"); 
  winston.log("info", "Loaded user configuration. ");
} catch(e){
  winston.log("warn", "No user configuration found, using defaults. Edit or create config.json to silence this warning. "); 
}

module.exports = extend(default_config, user_config); 