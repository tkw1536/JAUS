var config = require("../../config"); 
var db = require("../../db"); 
var Schema = db.models.User;
var mongoose = require("mongoose")
var handler = require("./handler");


module.exports = function(router, express, auth){
  
  var makeErrorMessage = function(err){
    
    if(err instanceof mongoose.mongo.MongoError){
      if(err.code == 11000){
        return "The given username already exists. "; 
      } 
    }
  
    try{
      return req.user.isAdmin?err.stack:err.toString(); 
    } catch(e){
      return err.toString()
    }
  }
  
  var renderError = function(err, req, res){
    var errorDesc = makeErrorMessage(err); 
    res.render("error_users", {
      "siteName": config.name, 
      "message": errorDesc 
    });
  }; 
  
  handler.mongooseHandler(Schema, router, {
    "deserialiseUpdate": function(req, res, cb){
      Schema.findOne({"name": req.body.id}, function(err, doc){
        if(doc == null || err){
          cb(err || new Error("Specefied item is null. "), null); 
        } else {
          cb(err, doc); 
        }
      }); 
    }, 
    "deserialiseCreate": function(req, res, cb){
      cb(null, {
        "name": req.body.name, 
        "maxLinks": parseInt(req.body.maxLinks), 
        "password": req.body.password, 
        "isAdmin": req.body.isAdmin == "on"
      }); 
    }, 
    "doEdit": function(doc, req, res){
      // you can only change admin state of someone else. 
      if(req.user.name != req.body.name){
        doc.isAdmin = req.body.isAdmin == "on"; 
      }
      
      // if we have a password, we want to save it. 
      if(req.body.password){
        doc.password = req.body.password; 
      }
      
      // set max links - you can not change the username. 
      doc.maxLinks = parseInt(req.body.maxLinks)
      
      return doc; 
    }, 
    "canCreate": function(req, res, cb){
      cb(null, req.user.isAdmin); 
    }, 
    "canTouch": function(doc, req, res, cb){
      cb(null, req.user.isAdmin); 
    }, 
    "filter": function(req, res){
      return {}; 
    },
  }, {
    "list": "/!/!/userman/", 
    "add": "/!/!/userman/new", 
    "delete": "/!/!/userman/delete", 
    "edit": "/!/!/userman/edit", 
    "prefix": auth.needAdmin.bind(auth)
  }, {
    "list": function(error, results, req, res){
      
      if(error){
        return renderError(error, req, res); 
      }
      
      res.render("user", {
        "siteName": config.name, 
        "user": req.user,
        "users": results
      }); 
    }, 
    "afterCreate": function(error, results, req, res){
      if(error){
        renderError(error, req, res); 
      } else {
        res.redirect("/!/!/userman"); 
      }
    }, 
    "afterEdit": function(error, obj, req, res){
      if(error){
        renderError(error, req, res); 
      } else {
        res.redirect("/!/!/userman"); 
      }
    }, 
    "afterDelete": function(error, obj, req, res){
      db.makeSureThereIsAnAdmin(function(){
        if(error){
          renderError(error, req, res); 
        } else {
          res.redirect("/!/!/userman"); 
        }
      }); 
    }
  }); 
}; 