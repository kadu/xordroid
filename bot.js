const { readdirSync } = require('fs');
const dotenv = require('dotenv');
const OBSWebSocket = require('obs-websocket-js');
const obs = new OBSWebSocket();
const tmi = require('tmi.js');
const MQTT = require("mqtt");
const { Console } = require('console');
const mongoose = require('mongoose');
const sound = require("sound-play");
const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');


const clienttts = new textToSpeech.TextToSpeechClient();
async function playTTS(message) {
  isPlayingTTS = true;
  const text = message.msg;
  const inputType = message.inputType;

  const request = {
    input: {[inputType]: text},
    voice: {languageCode: message.lang, ssmlGender: 'NEUTRAL'},
    audioConfig: {audioEncoding: 'MP3'},
  };

  const [response] = await clienttts.synthesizeSpeech(request);
  const writeFile = util.promisify(fs.writeFile);
  const ttsTempFile = `${__dirname}\\temp\\output.mp3`;
  await writeFile(ttsTempFile, response.audioContent, 'binary');
  sound.play(ttsTempFile).then((response) => {
    isPlayingTTS = false;
  }).catch((error) => {
    isPlayingTTS = false;
    console.error(error);
  });
}

mongoose.connect('mongodb://xordroid_points:TbfUhRuxEvqvA3j4@localhost:27018/admin', {useNewUrlParser: true}).catch(error => {
  console.log("Erro no mongoose.connect");
});

const db = mongoose.connection;
db.once('open', function() {
  console.log("Papai ta ON");
});

const botSchema = new mongoose.Schema({
  userid: String,
  points: Number
});

const botDB = mongoose.model('BOT', botSchema);

dotenv.config();

const TWITCH_BOT_USERNAME = process.env.BOT_USERNAME;
const TWITCH_OAUTH_TOKEN = process.env.OAUTH_TOKEN;
const TWITCH_CHANNEL_NAME = process.env.CHANNEL_NAME.split(',');
const MQTT_HOST = process.env.MQTT_HOST;
const MQTT_CLIENT = process.env.MQTT_CLIENT;
const MQTT_USER = process.env.MQTT_USER;
const MQTT_PW = process.env.MQTT_PW;

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
			mqtt.publish("wled/158690/api", "FX=80&SN=1");
			mqtt.publish("wled/158690/col", "#7FFF00");
      mqtt.publish("wled/158690", "ON");
      mqtt.publish("homie/ledmatrix/matrix/on/set","true");
    }
  });

  mqtt.subscribe('homie/ledmatrix/message/state', function (err) {
  });

  mqtt.on('message', function (topic, message) {
    if(topic.toString() == 'homie/ledmatrix/message/state') {
      var isTrueSet = (message == 'Idle');
      timerIsOn = isTrueSet;
    }
  });

  setInterval(() => {
    if(timerIsOn) {
      if(messages.length > 0) {
            let message = messages.shift();
            mqtt.publish("homie/ledmatrix/message/message/set", message);
      }
    }
  }, 1500);

  setInterval(async () => {
    if((ttsQueue.length > 0) && (!isPlayingTTS)) {
      let tts = ttsQueue.shift();
      await playTTS(tts);
    }
  }, 2500);
});

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
  if(self) {
    client.say(channel, "XORdroid na área, e aqui caiu é penalti!");
	}
});

client.connect();

obs.on("StreamStarted", (data) => {
  isStreamON = true;
});

obs.on("StreamStopped", (data) => {
  isStreamON = false;
});

setInterval(() => {
  if(isStreamON) {
    client.commercial("kaduzius",60).then((data) => {
      console.log("***** COMERCIAL ****");
      console.log(data);


      sound.play(`${__dirname}\\audio\\alarme\\a01.mp3`).then((response) => {
        isPlayingTTS = false;
      }).catch((error) => {
        isPlayingTTS = false;
        console.error(error);
      });


    })
    .catch((err) => {
      console.log("*****ERRO COMERCIAL ****");
      console.log(err);
    });
  }
}, 3600000);


readdirSync(`${__dirname}/commands`)
  .filter((file) => file.slice(-3) === '.js')
  .forEach((file) => {
		require(`./commands/${file}`).default(client, obs, mqtt, messages, botDB, commandQueue, ttsQueue);
  });