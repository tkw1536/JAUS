var config = require("../../config"); 
var Link = require("../../db").models.Link;

module.exports = function(router, express){
  router.use("/!/", express.static(__dirname + "/../../../htdocs")); 
  router.use(function(req, res, next){
    
    // get the path, redirect if we are at "!"
    var path = req.url;
    if(path == "/" || path == ""){
      return res.redirect("/!/"); 
    }
    
    var normalLink = Link.cleanupPath(path); 
    var normalQuestion = Link.cleanupQuestion(path); 
    
    Link.findOne({
      $or : [
        {"isQuestion": false, path: normalLink}, 
        {"isQuestion": true, path: normalQuestion}
      ]
    }, function(err, doc){
      if(err || !doc){
        return next(); 
      }
      
      if(doc.inFrame){
        res.render("frame", {url: doc.url})
      } else {
        res.redirect(doc.url);
      }
    }); 
  }, function(req, res){
    res
    .status(404)
    .render("error", {
      "siteName": config.name, 
      "message": "HTTP 404 - Page not found"
    })
  }); 
}; 