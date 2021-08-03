const { readdirSync } = require('fs');
const dotenv = require('dotenv');
const OBSWebSocket = require('obs-websocket-js');
const obs = new OBSWebSocket();
const tmi = require('tmi.js');
const MQTT = require("mqtt");
const { Console } = require('console');
const sound = require("sound-play");
const textToSpeech = require('@google-cloud/text-to-speech');
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

const clienttts = new textToSpeech.TextToSpeechClient();
async function playTTS(message) {
  isPlayingTTS = true;
  const text = message.msg;
  const inputType = message.inputType;

  const request = {
    input: {[inputType]: text},
    voice: {languageCode: message.lang, ssmlGender: 'NEUTRAL'},
    audioConfig: {audioEncoding: 'LINEAR16'},
  };

  const [response] = await clienttts.synthesizeSpeech(request);
  const writeFile = util.promisify(fs.writeFile);
  const ttsTempFile = `${__dirname}\\temp\\output.m4a`;
  await writeFile(ttsTempFile, response.audioContent, 'binary');
  sound.play(ttsTempFile).then((response) => {
    isPlayingTTS = false;
  }).catch((error) => {
    isPlayingTTS = false;
    console.error(error);
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
			// mqtt.publish("wled/158690/api", "FX=80&SN=1");
			// mqtt.publish("wled/158690/col", "#7FFF00");
      // mqtt.publish("wled/158690", "ON");
      // mqtt.publish("homie/ledmatrix/matrix/on/set","true");
      // mqtt.publish("homie/ircontrole/InfraRed/code/set", "0xF7C03F");
      // mqtt.publish("homie/ircontrole/InfraRed/code/set", "0xF7609F");

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
  if(self) {
    client.say(channel, "XORdroid na área, e aqui caiu é penalti!");
	}
});

client.connect();

obs.on("StreamStarted", (data) => {
  console.log(chalk.blueBright("Stream is ON LINE"));
  isStreamON = true;
});

obs.on("StreamStopped", (data) => {
  console.log(chalk.blueBright("Stream is OFFLINE"));
  isStreamON = false;
});

setInterval(() => {
  if(isStreamON) {
    client.commercial("kaduzius",60).then((data) => {
      console.log(chalk.redBright("***** COMERCIAL ****"));
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

setInterval(() => {
  if(isStreamON) {
    client.say("#kaduzius", '!prime');
  }
}, 72*60000);

const options = {
  endpoint: '/api/sse',
  script: '/sse.js'
};
const {SSE, send, openSessions, openConnections} = sse(options);


readdirSync(`${__dirname}/commands`)
  .filter((file) => file.slice(-3) === '.js')
  .forEach((file) => {
		require(`./commands/${file}`).default(client, obs, mqtt, messages, commandQueue, ttsQueue, send, cDiscord);
  });



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