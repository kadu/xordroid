const mongo = require('../config/mongo');

const userSchema = new mongo.Schema({
  _id: mongo.Types.ObjectId,
  points: Number
});

module.exports = mongo.model('Users', userSchema);
