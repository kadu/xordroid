const {
  readdirSync
} = require('fs');
const OBSWebSocket = require('obs-websocket-js').default;
const textToSpeech = require('@google-cloud/text-to-speech');
const {
  Console
} = require('console');
const sound = require("play-sound")(opts = {});
const dotenv = require('dotenv');
const obs = new OBSWebSocket();
const tmi = require('tmi.js');
const MQTT = require("mqtt");
const fs = require('fs');
const util = require('util');
const chalk = require('chalk');
const express = require('express');
var favicon = require('serve-favicon');
const app = express();
const dbweather = require("./commands/weather");
const sse = require('easy-server-sent-events');
const Discord = require('discord.js');
const cDiscord = new Discord.Client();
var cors = require('cors');
const {
  logs
} = require('./commands/commons/log');

const clienttts = new textToSpeech.TextToSpeechClient();
async function playTTS(message) {
  isPlayingTTS = true;
  const text = message.msg;
  const inputType = message.inputType;

  const request = {
    input: {
      [inputType]: text
    },
    voice: {
      languageCode: message.lang,
      ssmlGender: 'FEMALE'
    },
    audioConfig: {
      audioEncoding: 'LINEAR16'
    },
  };

  const [response] = await clienttts.synthesizeSpeech(request);
  const writeFile = util.promisify(fs.writeFile);
  const ttsTempFile = `${__dirname}/temp/output.m4a`;
  await writeFile(ttsTempFile, response.audioContent, 'binary');
  sound.play(ttsTempFile, (fim) => {
    isPlayingTTS = false;
  });
}

dotenv.config();

const TWITCH_BOT_USERNAME = process.env.BOT_USERNAME;
const TWITCH_OAUTH_TOKEN = process.env.OAUTH_TOKEN;
const TWITCH_CHANNEL_NAME = process.env.CHANNEL_NAME.split(',');
const MQTT_HOST = process.env.MQTT_HOST;
const MQTT_CLIENT = process.env.MQTT_CLIENT;
const MQTT_USER = process.env.MQTT_USER;
const MQTT_PW = process.env.MQTT_PW;
const DISCORD_KEY = process.env.DISCORD_KEY;
const GOOGLE_KEY = process.env.GOOGLE_KEY;
process.env.GOOGLE_APPLICATION_CREDENTIALS = GOOGLE_KEY

const mqtt_options = {
  host: MQTT_HOST,
  clientId: MQTT_CLIENT,
  username: MQTT_USER,
  password: MQTT_PW
};

var porta;
var messages = [];
var commandQueue = [];
var ttsQueue = [];
var timerIsOn = true;
var isPlayingTTS = false;
var isStreamON = false;
const mqtt = MQTT.connect(mqtt_options);

mqtt.on('connect', function () {
  mqtt.subscribe('xordroid/weather/keepAlive', function (err) {
    if (!err) {
      mqtt.publish('xordroid/weather/keepAlive', 'Hello mqtt');
      console.log("MQTT Ready!");

    }
  });

  mqtt.subscribe('homie/ledmatrix/message/state', function (err) { });

  mqtt.on('message', function (topic, message) {
    if (topic.toString() == 'homie/ledmatrix/message/state') {
      var isTrueSet = (message == 'Idle');
      timerIsOn = isTrueSet;
    }
  });

  setInterval(() => {
    if (timerIsOn) {
      if (messages.length > 0) {
        let message = messages.shift();
        mqtt.publish("homie/ledmatrix/message/message/set", message);
      }
    }
  }, 1500);

  setInterval(async () => {
    if ((ttsQueue.length > 0) && (!isPlayingTTS)) {
      let tts = ttsQueue.shift();
      await playTTS(tts);
    }
  }, 2500);
});

cDiscord.on('ready', () => {
  console.log(`Logged in as ${cDiscord.user.tag}!`);
});

cDiscord.login(DISCORD_KEY);

const client = new tmi.Client({
  options: {
    debug: false,
    level: 'warn',
  },
  connection: {
    reconnect: true,
    secure: true
  },
  identity: {
    username: TWITCH_BOT_USERNAME,
    password: TWITCH_OAUTH_TOKEN
  },
  channels: TWITCH_CHANNEL_NAME
});

client.on("join", (channel, username, self) => {
  if (self) {
    client.say(channel, "XORdroid na área, e aqui caiu é penalti!");
  }
});

client.connect();

obs.on("StreamStarted", (data) => {
  console.log(chalk.bgRedBright.inverse("Stream is ON LINE"));
  isStreamON = true;
});

obs.on("StreamStopped", (data) => {
  console.log(chalk.bgRedBright.inverse("Stream is OFFLINE"));
  isStreamON = false;
});

obs.on('error', function (err) {
  console.error('error!');
  console.error(e.code);
});

setInterval(() => {
  if (isStreamON) {
    client.say("#kaduzius", 'Tem Amazon Prime e ainda não vinculou sua conta ? Faça isso, aproveite e escorrega o Prime aqui e apoie o canal -> 1. Acesse https://gaming.amazon.com |-| 2. Faca login na sua conta da amazon.com.br |-| 3. Selecione vincular conta da Twitch |-| 4. Faca login na sua conta da Twitch e selecione Confirmar. |-| 5. Volte aqui no canal do Kaduzius, clique em Inscrever-se! - E já fica aqui o meu muito obrigado!!');
  }
}, 72 * 60000);

const options = {
  endpoint: '/api/sse',
  script: '/sse.js'
};
const {
  SSE,
  send,
  openSessions,
  openConnections
} = sse(options);



readdirSync(`${__dirname}/commands`)
  .filter((file) => file.slice(-3) === '.js')
  .forEach((file) => {
    logs("BOOTLOADER", `Loading module ${file}`, '')
    require(`./commands/${file}`).default(client, obs, mqtt, messages, commandQueue, ttsQueue, send, cDiscord);
  });
logs("BOOTLOADER", `Finished`, '');

app.use(cors());
app.use(SSE);

// #webserver
app.use(favicon(`${__dirname}/public/favicon.ico`));
app.use('/static', express.static('public'));
app.get('/api', async (req, res) => {
  return res.json(await dbweather.dbweather());
});
app.get('/average', async (req, res) => {
  return res.json(await dbweather.dbweather_resume());
});
app.get('/average2', async (req, res) => {
  return res.json(await dbweather.dbweather_resume2());
});

app.listen(3000, () => {
  console.log(`Weather map is live in http://localhost:${3000}`);
});