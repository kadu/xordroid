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
async function quickStart(message) {
  const text = message.msg;
  const inputType = message.inputType;

  const request = {
    input: {[inputType]: text},
    voice: {languageCode: message.lang, ssmlGender: 'NEUTRAL'},
    audioConfig: {audioEncoding: 'MP3'},
  };

  const [response] = await clienttts.synthesizeSpeech(request);
  const writeFile = util.promisify(fs.writeFile);
  await writeFile('output.mp3', response.audioContent, 'binary');
  sound.play(`${__dirname}\\output.mp3`);
}

mongoose.connect('mongodb://xordroid_points:TbfUhRuxEvqvA3j4@localhost:27018/admin', {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Papai ta ON");
});

const botSchema = new mongoose.Schema({
  userid: String,
  points: Number
});

const botDB = mongoose.model('BOT', botSchema);

// const silence = new botDB({ userid: 'Silence 17', points: 10 });
// console.log("******************");
// console.log(silence.userid); // 'Silence'
// console.log("******************");
// silence.save();

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
const mqtt = MQTT.connect(mqtt_options);

mqtt.on('connect', function () {
  mqtt.subscribe('xordroid/weather/keepAlive', function (err) {
    if (!err) {
			mqtt.publish('xordroid/weather/keepAlive', 'Hello mqtt');
			console.log("MQTT Ready!");
			mqtt.publish("wled/158690/api", "FX=80&SN=1");
			mqtt.publish("wled/158690/col", "#7FFF00");
			mqtt.publish("wled/158690", "ON");
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
    if(ttsQueue.length > 0) {
      let tts = ttsQueue.shift();
      await quickStart(tts);
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

function parse_commands(raw_commands, username) {
	if(raw_commands[0] === "!comandos"||raw_commands[0] === "!help"| raw_commands[0] === "!ajuda") {
		client.say(client.channels[0], '!led help | !eu | !camera help | !matrix <mensagem> | !donate | !github | !dica | !projetos | tem  mais mas você terá que descobrir :P');
	}
}



client.on("join", (channel, username, self) => {
  if(self) {
    // client.say(channel,"Olá pessoas, eu sou o XORDroid, manda um !comandos ai no chat e veja minhas funcionalidades ;D ... e !projetos pra ver o que já fizemos");
    client.say(channel, "To on!");
	}
});

client.on('message', (channel, tags, message, self) => {
  if(self) return;
  const commands = [
      "!led"
    , "!mqtt"
    , "!comandos"
    , "!social"
    , "!eu"
    , "!camera"
    , "!tela"
    , "!proto"
    , "!webcam"
    , "!youtube"
    , "!instagram"
    , "!github"
    , "!teste"
    , "!matrix"
    , "!donate"
    , "!xordroid"
    , "!streamdeckble"
    , "!streamdeck"
    , "!gatekeeperiot"
    , "!gatekeeper"
    , "!projetos"
    , "!projects"
    , "!ajuda"
    , "!help"
  ];
  message_parse = message.split(" "); // split message
  // verificar se só o primeiro é o comando
	if(commands.includes(message_parse[0])) { // has commands on message
		parse_commands(message_parse, tags.username);
		return;
	}
});

client.connect();

readdirSync(`${__dirname}/commands`)
  .filter((file) => file.slice(-3) === '.js')
  .forEach((file) => {
		require(`./commands/${file}`).default(client, obs, mqtt, messages, botDB, commandQueue, ttsQueue);
  });