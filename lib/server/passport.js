var mongoose = require("mongoose"); 
var LocalStrategy = require('passport-local').Strategy;

var User = mongoose.model("User");

module.exports.init = function(app){
    console.log(new User())
}; 

// generic middleware to make sure the user is logged in. 
module.exports.needUser = function(req, res, next){
  
  // if we are not authenticated, redirect to login. 
  if(!req.isAuthenticated()){
    res.redirect("/!/login/");
  }
  
  // and move on. 
  next(); 
}

// generic middleware to make sure use is admin
module.exports.needAdmin = function(req, res, next){
  
  // make sure the user is authenticated in the first place
  if(!req.isAuthenticated()){
    res.redirect("/!/login/");
  }
  
  // and that they are an admin. 
  if(!req.user.isAdmin){
    res
      .status(403)
      .render("error", {"message": "You need to be an administrator to do this! "}); 
  }
  
  // ok, go on. 
  next(); 
}