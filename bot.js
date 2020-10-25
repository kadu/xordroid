const { readdirSync } = require('fs');
const dotenv = require('dotenv');
const OBSWebSocket = require('obs-websocket-js');
const obs = new OBSWebSocket();
const tmi = require('tmi.js');
const MQTT = require("mqtt");
const { Console } = require('console');

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
  })
});


const client = new tmi.Client({
	options: { debug: true },
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
	if(raw_commands[0] === "!comandos") {
		client.say(client.channels[0], '!led help | !eu | !camera help | !matrix <mensagem>');
	}

	// if(raw_commands[0] === "!camera") {
	// 	if(raw_commands[1] === "ajuda") {
	// 		client.say(client.channels[0], "!camera protoboard | !camera webcam | !camera tela");
	// 	}
	// 	if(raw_commands[1] === "help") {
	// 		client.say(client.channels[0], "!camera protoboard | !camera webcam | !camera screen");
	// 	}

	// 	if((raw_commands[1] === "protoboard") || (raw_commands[1] === "proto")) {
	// 		changeScene("proto");
	// 	}

	// 	if(raw_commands[1] === "webcam") {
	// 		changeScene("webcam");
	// 	}

	// 	if((raw_commands[1] === "tela") || (raw_commands[1] === "screen")) {
	// 		changeScene("tela");
	// 	}
	// }


	if(raw_commands[0] === "!led") {
		if(raw_commands[1] === "ajuda") {
			client.say(client.channels[0], "!led liga | !led desliga | !led cor #RRGGBB | !led efeito [0-101]");
		}

		if(raw_commands[1] === "help") {
			client.say(client.channels[0], "!led on | !led off | !led color #RRGGBB | !led effect [0-101]");
		}

		if((raw_commands[1] === "liga") || (raw_commands[1] === "on")) {
			mqtt.publish("wled/158690", "ON");
		}

		if((raw_commands[1] === "desliga") || (raw_commands[1] === "off")) {
			mqtt.publish("wled/158690", "OFF");
		}

		if((raw_commands[1] === "efeito") || (raw_commands[1] === "effect")) {
			let value = parseInt(raw_commands[2]);
			if(isNaN(value)) {
				// error
			} else {
				if(value >= 0 && value <= 101) {
					mqtt.publish("wled/158690/api", "FX=" + raw_commands[2] + "&SN=1");
				}
			}
		}

		if((raw_commands[1] === "cor")||(raw_commands[1] === "color")) {
			let isColor = /^#[0-9A-F]{6}$/i.test(raw_commands[2]);

			if(!isColor) {
				if(raw_commands[1] === "cor")	client.say(client.channels[0], `@${username} Cara, manda a cor assim => #RRGGBB`);
				if(raw_commands[1] === "color")	client.say(client.channels[0], `@${username} Dude, send color like this => #RRGGBB`);

			} else {
				mqtt.publish("wled/158690/col", raw_commands[2]);
			}
		}
	}
}

client.on("join", (channel, username, self) => {
  if(self) {
    client.say(channel,"Olá pessoas, eu sou o XORDroid, manda um !comandos ai no chat e veja minhas funcionalidades ;D");
	}
});

client.on('message', (channel, tags, message, self) => {
	if(self) return;
	const commands = ["!led", "!mqtt", "!comandos", "!social", "!eu", "!camera", "!tela", "!proto", "!webcam", "!youtube", "!instagram", "!github", "!teste", "!matrix"];
	message_parse = message.split(" "); // split message
	if(commands.includes(message_parse[0])) { // has commands on message
		parse_commands(message_parse, tags.username);
		return;
	}

	if(tags.username == "streamlabs") {
		var sendedBy = message.substring(24, message.length-1);
		if(message.substring(0,23) == "Thank you for following") {
			client.say(channel, `Valeu @${sendedBy} pelo follow, vou até soltar uns rojões!`);
			mqtt.publish("wled/158690", "ON");
			mqtt.publish("wled/158690/api", "FX=90&SN=1");
			const saveScene = currentScene;
			changeScene("webcam");
			try {
				setTimeout(()=> {
					mqtt.publish("wled/158690", "OFF");
					changeScene(saveScene);
				},10000);
			} catch (error) {
				console.log("Erro no settimeout", error);
			}
		}
	}
});

client.connect();

readdirSync(`${__dirname}/commands`)
  .filter((file) => file.slice(-3) === '.js')
  .forEach((file) => {
		require(`./commands/${file}`).default(client, obs, mqtt);

		// client.on('message', (target, context, message, isBot) => {
    //   if (isBot) return;
    //   require(`./commands/${file}`).default(client, target, context, message, mqtt, obs);
		// });

	});