module.exports = function(router, express){
  router.use("/!/", express.static(__dirname + "/../../../htdocs")); 
  router.get("/", function(req, res){
    res.redirect("/!/"); 
  }); 
}; 