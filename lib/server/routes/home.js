var config = require("../../config"); 
var Schema = require("../../db").models.Link;
var mongoose = require("mongoose")
var handler = require("./handler");


module.exports = function(router, express, auth){
  
  var makeErrorMessage = function(err){
    
    if(err instanceof mongoose.mongo.MongoError){
      if(err.code == 11000){
        return "The specefied URL is already taken on this server. Please try another one. "; 
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
    res.render("error_links", {
      "siteName": config.name, 
      "message":errorDesc 
    });
  }; 
  
  handler.mongooseHandler(Schema, router, {
    "deserialiseUpdate": function(req, res, cb){
      Schema.findOne({"path": req.body.id}, function(err, doc){
        if(doc == null || err){
          cb(err || new Error("Specefied item is null. "), null); 
        } else {
          cb(err, doc); 
        }
      }); 
    }, 
    "deserialiseCreate": function(req, res, cb){
      cb(null, {
        "owner": req.user.name, 
        "path": req.body.path, 
        "url": req.body.url, 
        "inFrame": req.body.inFrame == "on", 
        "isQuestion": req.body.isQuestion == "on"
      }); 
    }, 
    "doEdit": function(doc, req, res){
      doc.path = req.body.path; 
      doc.url = req.body.url; 
      doc.inFrame = (req.body.inFrame == "on"); 
      doc.isQuestion = (req.body.isQuestion == "on"); 
      return doc; 
    }, 
    "canCreate": function(req, res, cb){
      if(req.user.isAdmin){
        cb(null, true); 
      } else {
        Schema.count({"owner": req.user.name}, function(err, count){
          if(err){
            return cb(err, null); 
          } else {
            cb(null, count < req.user.maxLinks); 
          }
        })
      }
    }, 
    "canTouch": function(doc, req, res, cb){
      cb(null, doc.owner == req.user.name || req.user.isAdmin); 
    }, 
    "filter": function(req, res){
      if(req.user.isAdmin){
        return {}; 
      }
      
      return {"owner": req.user.name}; 
    },
  }, {
    "list": "/!/", 
    "add": "/!/new", 
    "delete": "/!/delete", 
    "edit": "/!/edit", 
    "prefix": auth.needUser.bind(auth)
  }, {
    "list": function(error, results, req, res){
      
      if(error){
        return renderError(error, req, res); 
      }
      
      Schema.count({"owner": req.user.name}, function(err, count){
        if(err){
          renderError(err, req, res); 
        } else {
          res.render("home", {
            "siteName": config.name, 
            "user": req.user, 
            "error": error, 
            "links": results, 
            "canCreateMore": count < req.user.maxLinks || req.user.isAdmin
          }); 
        }
      }); 
    }, 
    "afterCreate": function(error, results, req, res){
      if(error){
        renderError(error, req, res); 
      } else {
        res.redirect("/!/"); 
      }
    }, 
    "afterEdit": function(error, obj, req, res){
      if(error){
        renderError(error, req, res); 
      } else {
        res.redirect("/!/"); 
      }
    }, 
    "afterDelete": function(error, obj, req, res){
      if(error){
        renderError(error, req, res); 
      } else {
        res.redirect("/!/"); 
      }
    }
  }); 
}; 