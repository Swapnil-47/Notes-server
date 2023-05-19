const mongoose = require('mongoose')

const noteSchema = mongoose.Schema({
  title:{type :String, required : true },
  content:{type :String, required : true },
  email:{type :String, required : true },
  time:{type :String, required : true },
  archive:{type :String, required : true },

})
module.exports = mongoose.model('newNote',noteSchema);

