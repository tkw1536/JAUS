var mongoose = require("mongoose");

module.exports = function(){
  var LinkSchema = new mongoose.Schema({
    path: {
      type: String, 
      index: {unique: true}
    },
    owner: { type: mongoose.Schema.ObjectId, ref: 'User' }
  });

  mongoose.model('Link', LinkSchema);
  return mongoose.model('Link');
}; 