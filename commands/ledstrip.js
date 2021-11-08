const chalk = require('chalk');
const logs = require('./commons/log.js');
const parseColor = require('./commons/parsecolor');
const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const capitalize2 = (string) => {
  return string.split(' ').map(capitalize).join(' ')
  .replace(" In ", " in ")
  .replace(" Of ", " of ");
}

exports.default = (client, obs, mqtt, messages) => {
  client.on('message', async (target, context, message, isBot) => {
      if (isBot) return;

      let parsedMessage = message.split(" ");
      if(parsedMessage[0] === "!led") {
        if(parsedMessage[1] === "ajuda") {
          client.say(client.channels[0], "!led liga | !led desliga | !led cor #RRGGBB | !led efeito [0-101]");
          logs.logs('led', 'Ajuda', context.username);
        }

        if(parsedMessage[1] === "help") {
          client.say(client.channels[0], "!led on | !led off | !led color #RRGGBB | !led effect [0-101]");
          logs.logs('led', 'Help', context.username);
        }

        if((parsedMessage[1] === "liga") || (parsedMessage[1] === "on")) {
          mqtt.publish("wled/158690", "ON");
          logs.logs('led', 'Ligar', context.username);
        }

        if((parsedMessage[1] === "desliga") || (parsedMessage[1] === "off")) {
          mqtt.publish("wled/158690", "OFF");
          logs.logs('led', 'Desligar', context.username);
        }

        if((parsedMessage[1] === "efeito") || (parsedMessage[1] === "effect")) {
          let value = parseInt(parsedMessage[2]);
          if(isNaN(value)) {
            // error
          } else {
            if(value >= 0 && value <= 101) {
              mqtt.publish("wled/158690", "ON");
              mqtt.publish("wled/158690/api", "FX=" + parsedMessage[2] + "&SN=1");
              logs.logs('led', `Mudando efeito para ${parsedMessage[2]}`, context.username);
            }
          }
        }

        if((parsedMessage[1] === "cor")||(parsedMessage[1] === "color")) {
          let sendcolor = await parseColor.parseColor(parsedMessage[2]);
          if(sendcolor == -1) {
            if(parsedMessage[1] === "cor")	client.say(client.channels[0], `@${context.username} Cara, manda a cor assim => #RRGGBB`);
            if(parsedMessage[1] === "color")	client.say(client.channels[0], `@${context.username} Dude, send color like this => #RRGGBB`);
          } else {
            mqtt.publish("wled/158690", "ON");
            mqtt.publish("wled/158690/col", sendcolor);
            logs.logs('led', `Mudando cor para ` + chalk.hex(sendcolor).inverse(sendcolor), context.username);
          }
        }
      }
  });
};