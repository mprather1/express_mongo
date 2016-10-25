var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var UserSchema = new Schema({
  firstName: String,
  lastName: String,
  phone: String,
  email: String,
  phone_sort_id: String
});

UserSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('User', UserSchema);
