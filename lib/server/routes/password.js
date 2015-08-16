var config = require("../../config"); 

module.exports = function(router, express, auth){
    router.get("/!/!/password", auth.needUser, function(req, res){
      res.render("password", {
        "hasMessage": false, 
        "hasError": false, 
        "user": req.user, 
        "siteName": config.name
      }); 
    });
    
    router.post("/!/!/password", auth.needUser, function(req, res){
      req.user.password = req.body.password; 
      
      req.user.save(function(err){
        if(err){
          res.render("password", {
            "hasMessage": false, 
            "hasError": true, 
            "message": "Could not save password. ", 
            "user": req.user, 
            "siteName": config.name
          }); 
        } else {
          res.render("password", {
            "hasMessage": true, 
            "hasError": false, 
            "message": "Password has been updated. ", 
            "user": req.user, 
            "siteName": config.name
          }); 
        }
      })
      
      
    });
}; 