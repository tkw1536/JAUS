var passport = require("passport"); 
var config = require("../../config"); 

module.exports = function(router, express, auth){
  
 router.get("/!/!/login", function(req, res){
   if(!req.isAuthenticated()){
     res.render("login", {
       "hasMessage": false, 
       "hasError": false, 
       "siteName": config.name
     });
   } else {
     res.redirect("/!/!/"); 
   }
 });
 
 router.get("/!/!/login/failed", function(req, res){
   if(!req.isAuthenticated()){
     res.render("login", {
       "hasMessage": false, 
       "hasError": true, 
       "message": "Access denied. ", 
       "siteName": config.name
     });
   } else {
     res.redirect("/!/!/"); 
   }
 }); 
 
 router.get("/!/!/login/again", function(req, res){
   if(!req.isAuthenticated()){
     res.render("login", {
       "hasMessage": true, 
       "hasError": false, 
       "message": "You have been logged out. ", 
       "siteName": config.name
     });
   } else {
     res.redirect("/!/!/"); 
   }
 }); 
 
 router.post('/!/!/login', passport.authenticate('local', {
   successRedirect: '/!/!/',
   failureRedirect: '/!/!/login/failed'
 }));
 
 router.get('/!/!/logout', auth.needUser, function(req, res){
   req.logout();
   res.redirect('/!/!/login/again');
 });
}; 