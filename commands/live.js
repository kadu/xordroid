// const chalk  = require('chalk');
const logs = require('./commons/log');

exports.default = (client, obs, mqtt, messages, commandQueue, ttsQueue, send) => {
    client.on('message', (target, context, message, isBot) => {
      if (isBot) return;
      if(context.badges == null)  return;
      if(context.mod == false && context.badges.broadcaster != '1') return;

      let parsedMessage = message.split(" ");
      if(typeof parsedMessage[1] == 'undefined') return;
      if(parsedMessage[0] !== "!live") return;

      try {
        switch (parsedMessage[1].toLowerCase()) {
            case 'liga':
              mqtt.publish("xordroid/weather/on", "");
              mqtt.publish("wled/158690", "ON");
              mqtt.publish("homie/ircontrole/InfraRed/code/set", "0xF7C03F");
              mqtt.publish("wled/158690/api", "FX=80");
              mqtt.publish("wled/158690/col", "#7FFF00");
              mqtt.publish("wled/158690", "ON");
              mqtt.publish("homie/ledmatrix/matrix/on/set","true");
              mqtt.publish("homie/ircontrole/InfraRed/code/set", "0xF7C03F");
              mqtt.publish("homie/ircontrole/InfraRed/code/set", "0xF7609F");
              break;
            case 'desliga':
              mqtt.publish("wled/158690", "OFF");
              mqtt.publish("homie/ircontrole/InfraRed/code/set", "0xF740BF");
              mqtt.publish("homie/ledmatrix/matrix/on/set","false");
              break;
            default:
                break;
        }
      } catch (error) {
        console.log(error);
      }
    });
};

