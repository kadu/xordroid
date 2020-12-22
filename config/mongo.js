const mongoose = require('mongoose');

mongoose.connect('mongodb://xordroid_points:TbfUhRuxEvqvA3j4@localhost:27018/admin', {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Papai ta ON");
});

module.exports = mongoose;