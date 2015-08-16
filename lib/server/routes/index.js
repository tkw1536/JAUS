var express = require("express"); 

module.exports = function(auth){
  // create a router
  var router = express.Router();
  
  // auth && managemenet. 
  require("./auth")(router, express, auth); 
  require("./home")(router, express, auth); 
  require("./user")(router, express, auth); 
  require("./password")(router, express, auth); 
  
  // server library stuff && htdocs
  require("./lib")(router, express); 
  require("./main")(router, express); 

  return router; 
}; 