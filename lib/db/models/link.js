var mongoose = require("mongoose");
var url = require("url"); 

module.exports = function(){
  var LinkSchema = new mongoose.Schema({
    path: {
      type: String, 
      index: {unique: true}
    },
    url: String, 
    inFrame: Boolean, 
    isQuestion: Boolean, 
    owner: String
  });
  
  var cleanupPath = LinkSchema.statics.cleanupPath = function(path){
    // resolve the path
    var resolvedPath = url.resolve("/", path); 
    
    // make sure there is a "/" at the end. 
    if(resolvedPath[resolvedPath.length - 1] !== "/"){
        resolvedPath += "/"; 
    }
    
    // and make sure it starts with "/"
    if(resolvedPath[0] !== "/"){
      return false; 
    }
    
    // it may not be under /!/, /?
    if(resolvedPath.substring(0, 3) === "/!/" || resolvedPath.substring(0, 2) === "/?"){
      return false;
    }
    
    // make sure it is not / either. 
    if(resolvedPath == "/"){
      return false; 
    }
    
    return resolvedPath; 
  }

  var cleanupQuestion = LinkSchema.statics.cleanupQuestion = function(path){
    var niceQuestion = path.toLowerCase()
    .replace(/[\?\!\.]/g, "") // removes some things. 
    .replace(/^\//g, "") // remove a beginning /
    .replace(/\//g, " ") // make /s spaces. 
    .trim() // replaces spaces at the end / beginning
    .replace(/\s+/g, "-"); // make dashes
    
    return url.resolve("/", "/?"+
      (
        niceQuestion
      )
    ); 
  }
  
  LinkSchema.pre('save', function(next){
    // first cleanup the destination to be a proper url. 
    // note that we resolve it relative to "/" which means we allow on-server-urls. 
    this.url = url.resolve("/", this.url); 
        
    // now we need to do a lot more cleaning up depending on if this is a question
    // or not. 
    try{
        var cleanedPath = this.isQuestion?cleanupQuestion(this.path):cleanupPath(this.path);
    } catch(e){
      next(new Error("Something happened. Please consult the server admin for details. ")); 
      return; 
    }
    
    if(!cleanedPath){
      next(new Error("Invalid path - make sure to use a nice name. ")); 
      return; 
    }
    
    // store the cleaned up path. 
    this.path = cleanedPath; 
    
    next(); 
  }); 
  
  mongoose.model('Link', LinkSchema);
  
  
  return mongoose.model('Link');
}; 