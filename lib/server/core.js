var mustacheExpress = require('mustache-express');
var winston = require("winston"); 
var expressWinston = require('express-winston');


module.exports = function(app){
  // mustache
  app.engine('html', mustacheExpress());
  app.set('view engine', 'html');
  app.set('views', __dirname + '/views'); 

  // Express: Use winston for logging
  // app.use(expressWinston.logger({winstonInstance: winston}));
}; 