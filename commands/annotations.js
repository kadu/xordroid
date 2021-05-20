const sqlite3 = require('sqlite3').verbose();
const sqlite = require('sqlite');
var db = null;

/*
const channel = client.channels.cache.find(channel => channel.name === channelName)
channel.send(message)
*/

async function getStreamTime(obs) {
  return obs.send('GetStreamingStatus', {})
    .then( (value) => {
      return value.streamTimecode;
    })
    .catch( err => {
      return 0;
    });
}

async function createDB() {
  try {
    db = await sqlite.open({ filename: './databases/xordroid.db', driver: sqlite3.Database });
    await db.run(`CREATE TABLE IF NOT EXISTS annotation ( id INTEGER PRIMARY KEY AUTOINCREMENT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, video_time TEXT, username TEXT, annotation TEXT)`);
  } catch (error) {
    console.error(error);
  }
};

createDB();

exports.default = (client, obs, mqtt, messages, commandQueue, ttsQueue, send, cDiscord) => {
    client.on('message', async (target, context, message, isBot) => {
        if (isBot) return;

        const parsedMessage = message.split(" ");

        if(parsedMessage[0] === '!anota') {
          const fullMessage = message.replace("!anota ",""); //.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
          client.say(target, `@${context.username}, anotado, valeu!`);
          await db.run("INSERT INTO annotation (video_time, username, annotation)  VALUES(?,?, ?)", [await getStreamTime(obs), context.username, fullMessage]);

          const channel = cDiscord.channels.cache.find(channel => channel.name === "anotações");
          channel.send(`Enviada por @${context.username} : ${fullMessage}`);
        }
    });
};


process.on('SIGINT', function() {
  console.log("Caught interrupt signal");
  db.close();
  process.exit();
});