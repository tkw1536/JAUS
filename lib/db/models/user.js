var mongoose = require("mongoose");
var bcrypt = require('bcrypt'); 
// salt factor, should be enough for now. 
var SALT_WORK_FACTOR = 10;

module.exports = function(){
  var UserSchema = new mongoose.Schema({
    name: {
      type: String, 
      validate: /[_a-zA-z0-9]/g, 
      index: {unique: true}
    },
    isAdmin: Boolean,
    maxLinks: {
      type: Number, 
      min: 0, 
      default: 5
    },
    password: {
      type: String, 
      default: ""
    } 
  });
  
  // <adapted from http://blog.mongodb.org/post/32866457221/password-authentication-with-mongoose-part-1>
  UserSchema.pre('save', function(next) {
    var user = this;
    
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();
    
    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      if (err) return next(err);
      
      // hash the password using our new salt
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);
        
        // override the cleartext password with the hashed one
        user.password = hash;
        next();
      });
    });
  });
  
  UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
    });
  };
  // </adapted>
  
  mongoose.model('User', UserSchema);
  return mongoose.model('User');
}; 