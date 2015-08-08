module.exports = function(router, express){
  router.use('/!/lib', express.static(__dirname + "/../lib"));
  router.use('/!/lib/jquery', express.static(__dirname + "/../../../bower_components/jquery/dist"));
  router.use('/!/lib/bootstrap', express.static(__dirname + "/../../../bower_components/bootstrap/dist"));
}; 