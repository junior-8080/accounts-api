const mongoose = require('mongoose');

const Users = mongoose.model("Users", {
  id: String,
  email: String,
  password: String,
  msisdn: String,
  apikeys:[{id:String,key:String,posted_ts: Date}],
  posted_ts: Date
});


module.exports = {
  Users,
};
