var express = require("express"); 

module.exports = function(auth){
  // create a router
  var router = express.Router();

  // and route towns of stuff
  require("./lib")(router, express); 
  
  // set up login routes
   require("./auth")(router, express, auth); 

  return router; 
}; 