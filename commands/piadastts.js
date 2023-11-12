const bent      = require('bent');
const getJSON   = bent('json');
const jsdom     = require("jsdom");
const { JSDOM } = jsdom;
const axios     = require('axios');
const logs      = require('./commons/log');
const sqlite3   = require('sqlite3').verbose();
const sqlite    = require('sqlite');
var db          = null;

const jokeAPIURL      = "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit";
const cartoonAudioURL = "https://actions.google.com/sounds/v1/cartoon/";
const cartoonAudios = [
  "slide_whistle_to_drum.ogg",
  "slide_whistle.ogg",
  "siren_whistle.ogg",
  "pop.ogg",
  "concussive_hit_guitar_boing.ogg",
  "cartoon_boing.ogg",
];

async function createDB() {
  try {
    db = await sqlite.open({ filename: './databases/xordroid.db', driver: sqlite3.Database });
    await db.run(`CREATE TABLE IF NOT EXISTS piadas ( id INTEGER PRIMARY KEY AUTOINCREMENT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, username TEXT, piada TEXT, ativa INTEGER DEFAULT 0 )`);
  } catch (error) {
    console.error(error);
  }
};

createDB();

function randomInt(min, max) {
	return min + Math.floor((max - min) * Math.random());
}

function getFunAudio() {
  const randomElement = cartoonAudios[Math.floor(Math.random() * cartoonAudios.length)];
  return cartoonAudioURL + randomElement;
}

async function getPiada() {
  let retorno = '';
  const sql = 'select DISTINCT piada from piadas where piadas.ativa = 1 order by RANDOM() limit 1';
  const params = [];
    const result = await db.all(sql, params, (err, row) => {
      if (err) {
        throw err;
      }
    });

    if(typeof result != 'undefined') {
      retorno = result[0].piada;
    }

    return retorno.replace(/^.*?O que é/, "O que é").replace("R.:","");
  return "";
}

exports.default = (client, obs, mqtt, messages, commandQueue, ttsQueue) => {
    client.on('message', async (target, context, message, isBot) => {
        if (isBot) return;

        let msgpiada;
        let response;
        switch (message) {
            case '!joke':
              response = await getJSON(jokeAPIURL);
              if(response.type === "single")
                msgpiada = response.joke;
              else {
                msgpiada = response.setup + "|" +  response.delivery; //#TODO melhorar essa concatenacao
              }
              logs.logs('Piadas TTS', message, context.username + " => " + msgpiada);

              let audiomsgpiada = `<speak>${msgpiada}<audio src="${getFunAudio()}"/></speak>`;
              audiomsgpiada = audiomsgpiada.replace("|", "<break time='1400ms'/>");
              setTimeout(() => {
                client.say(target, msgpiada.replace("|",""));
              }, 3000);
              ttsQueue.push( {'msg': audiomsgpiada, 'lang': 'en','inputType': 'ssml'});
              break;

            case '!piada':
              // response = await getJSON(piadaAPIURL);
              piada = await getPiada();
              logs.logs('Piadas TTS', message, context.username + " => " + piada );
              if (piada.length > 0) {
                piada = piada.replace("?", "?<break time='1400ms'/>");
                msgpiada = `<speak>${piada}<audio src="${getFunAudio()}"/></speak>`;
                ttsQueue.push( {'msg': msgpiada, 'lang': 'pt-BR', 'inputType': 'ssml'});
              }
              break;
            default:
                break;
        }
    });
};



