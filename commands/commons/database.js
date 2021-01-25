//https://dev.to/perigk/how-to-initialize-a-singleton-mongo-connection-with-expressjs-4a2f

const mongoose = require('mongoose');

mongoose.connect('mongodb://xordroid_points:TbfUhRuxEvqvA3j4@localhost:27018/admin', {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("MongoDB Conected!");
});

var Schema = mongoose.Schema;
var sceneLightSchema = new Schema({
  userId: String,
  userName: String,
  points: Number,
  timestamp : { type : Date, default: Date.now }
}, {collection: 'sceneLight'});

var SceneLihgt = mongoose.model('sceneLight', sceneLightSchema);

class sceneLightStore {
  constructor() {
    if(! sceneLightStore.instance) {
      this._data = [];
      sceneLightStore.instance = this;
    }
    return sceneLightStore.instance;
  }

  save(document) {
    const auxDoc = {
      userId: document.userId,
      userName: document.userName,
      points: document.points,
    }
    const doc = new SceneLihgt(auxDoc);
    doc.save();
  }
}

// const instance = new UserStore();
// Object.freeze(instance);
//export default instance;

