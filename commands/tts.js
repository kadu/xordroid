const sqlite3     = require('sqlite3').verbose();
const sqlite      = require('sqlite');
const dotenv      = require('dotenv');
const TTS_ENABLED = process.env.TTS_ENABLED;

dotenv.config();

async function createDB() {
  try {
    db = await sqlite.open({ filename: './databases/xordroid.db', driver: sqlite3.Database });
       await db.run(`CREATE TABLE IF NOT EXISTS environment ( 'id' INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,'tts' BOOLEAN default TRUE, 'ttsgoogle' BOOLEAN default TRUE,'telas' BOOLEAN default TRUE,'forca' BOOLEAN default TRUE,'ttspiada' BOOLEAN default TRUE);`);
  } catch (error) {
    console.error(error);
  }
};

createDB();

async function loadEnvironment() {
  sql = "SELECT *  from environment e WHERE e.id = (SELECT max(id) FROM environment)";
  const result = await db.get(sql, [], (err, row) => {
    if(err) {
      return console.log(err);
    }
  });

  console.table(result);

  // if(typeof result != 'undefined') {

  //   gameID = result.id;
  //   return true;
  // } else {
  //   return false;
  // }
}
let isTTSEnabled = TTS_ENABLED == "true";

exports.default = (client, obs, mqtt, messages, commandQueue, ttsQueue) => {
    client.on('message', (target, context, message, isBot) => {
        if (isBot) return;

        let ttsCommands=[];
        let coolDownControl=[];

        const TTSLanguage = [
          {"command": "!tts"  , "language": "pt-BR", "saidText": "disse" },

          {"command": "!tts-en", "language": "en"   , "saidText": "said" },
          {"command": "!entts", "language": "en"   , "saidText": "said" },

          {"command": "!tts-pt", "language": "pt-PT", "saidText": "disse" },
          {"command": "!pttts", "language": "pt-PT", "saidText": "disse" },

          {"command": "!tts-fr", "language": "fr-FR", "saidText": "mentionné" },
          {"command": "!frtts", "language": "fr-FR", "saidText": "mentionné" },

          {"command": "!tts-ru", "language": "ru-RU", "saidText": "сказал" },
          {"command": "!rutts", "language": "ru-RU", "saidText": "сказал" },

          {"command": "!tts-de", "language": "de-DE", "saidText": "sagt" },
          {"command": "!detts", "language": "de-DE", "saidText": "sagt" },

          {"command": "!tts-es", "language": "es-ES", "saidText": "discho" },
          {"command": "!estts", "language": "es-ES", "saidText": "discho" },

          {"command": "!tts-jp", "language": "ja-JP", "saidText": "前記" },
          {"command": "!jptts", "language": "ja-JP", "saidText": "前記" },

          {"command": "!tts-it", "language": "it-IT", "saidText": "disse" },
          {"command": "!ittts", "language": "it-IT", "saidText": "disse" },

          {"command": "!tts-ch", "language": "yue-HK", "saidText": "说" },
          {"command": "!chtts", "language": "yue-HK", "saidText": "说" },
        ];

        let parsedMessage = message.split(" ");
        if(parsedMessage[0] == '!ttsoff') {
          if(context.username !== 'kaduzius') return;
          client.say(target, 'TTS Desabilitado');
          isTTSEnabled = false;
        }
        if(parsedMessage[0] == '!ttson') {
          if(context.username !== 'kaduzius') return;
          client.say(target, 'TTS Habilitado');
          isTTSEnabled = true;
        }        

        TTSLanguage.forEach((command) => {
          if(parsedMessage[0] === command.command) {
            if(!isTTSEnabled) {
              client.say(target, "TTS is disabled | TTS está desativado");
              return;
            }

            // coolDownControl.push({'user': context["display-name"], 'ts':context["tmi-sent-ts"]});
            // coolDownControl.forEach((k,v) => {
            //   var date = new Date(v.ts * 1000);
            //   date.getTime() <
            // });

            let fullMessage = context["display-name"] + command.saidText  + " : " + message.replace(command.command,"");
            ttsQueue.push( {'msg': fullMessage, 'lang': command.language,'inputType': 'text'});
          }
        });
    });
};