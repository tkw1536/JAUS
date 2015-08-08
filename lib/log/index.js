var winston = require("winston"); 

// enable colors
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
  "colorize": true, 
  "timestamp": true
});

// thats it
module.exports = winston;