var mongoose = require("mongoose"); 
var passport = require("passport");
var winston = require("winston");
var bodyParser = require('body-parser')

var expressSession = require("express-session");
var LocalStrategy = require("passport-local").Strategy;

var config=require("../config"); 

var User = mongoose.model("User");

module.exports.init = function(app){
  // set up the session stuff
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(expressSession({
    resave: true,
    saveUninitialized: true, 
    secret: process.env.SESSION_KEY || config.session_secret
  }));

  passport.use('local', new LocalStrategy(function(username, password, done) { 
    // find a single user. 
    User.findOne({"name": username}, function(err, person){
      
      // in case of an error, we are done. 
      if(err){
        return done(err); 
      }
      
      // if the user does not exist. 
      if(!person){
        return done(null, false, {message: "Incorrect username/password. "}); 
      }
      
      // else we have the user, so check the password
      person.comparePassword(password, function(err, isMatch){
        
        // there was an error
        if(err){
          return done(err); 
        }
        
        // we did not match
        if(!isMatch){
          return done(null, false, {message: "Incorrect username/password. "}); 
        }
        
        // it worked!
        return done(null, person);         
      }); 
    }); 
  })); 
  
  // set up passport
  app.use("/!/!/", passport.initialize());
  app.use("/!/!/", passport.session());
  
  // user serialisation => just db
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });
 
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}; 

// generic middleware to make sure the user is logged in. 
module.exports.needUser = function(req, res, next){
  
  // if we are not authenticated, redirect to login. 
  if(!req.isAuthenticated()){
    return res.redirect("/!/!/login/");
  }
  
  // and move on. 
  next(); 
}

// generic middleware to make sure use is admin
module.exports.needAdmin = function(req, res, next){
  
  // make sure the user is authenticated in the first place
  if(!req.isAuthenticated()){
    return res.redirect("/!/!/login/");
  }
  
  // and that they are an admin. 
  if(!req.user.isAdmin){
    return res
      .status(403)
      .render("error",{
        "message": "You need to be an administrator to do this! ", 
        "siteName": config.name
      }); 
  }
  
  // ok, go on. 
  next(); 
}

module.exports.passport = passport; 