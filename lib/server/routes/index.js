var express = require("express"); 

module.exports = function(passport){
  // create a router
  var router = express.Router();

  // and route towns of stuff
  require("./lib")(router, express); 
   
  router.get("/!/login", function(req, res){
      res.render("login", {"error": false});
  }); 

  return router; 
}; 