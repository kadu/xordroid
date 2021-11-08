const logs  = require('./commons/log');
const chalk = require('chalk');

exports.default = (client, obs, mqtt, messages, commandQueue, ttsQueue, send) => {
    client.on('message', (target, context, message, isBot) => {
        if (isBot) return;

        let parsedMessage = message.split(" ");

        let fullMessage = message.replace("!refletor","").normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        let cidade = fullMessage;

        switch (parsedMessage[0]) {
            case '!refletor':
                switch (parsedMessage[1]) {
                  case "liga":
                    mqtt.publish("homie/ircontrole/InfraRed/code/set", "0xF7C03F");
                    logs.logs('Refletor ', 'Liga ' + String.fromCodePoint('0x1F4A1') , context.username);
                    break;
                  case "desliga":
                    mqtt.publish("homie/ircontrole/InfraRed/code/set", "0xF740BF");
                    logs.logs('Refletor ', 'Desliga ' + String.fromCodePoint('0x1F4A1') , context.username);
                    break;
                  case "vermelho":
                    mqtt.publish("homie/ircontrole/InfraRed/code/set", "0xF720DF");
                    logs.logs('Refletor ', String.fromCodePoint('0x1F4A1') + chalk.red.inverse('Vermelho'), context.username);
                    break;
                  case "azul":
                    mqtt.publish("homie/ircontrole/InfraRed/code/set", "0xF7609F");
                    logs.logs('Refletor ', String.fromCodePoint('0x1F4A1') + chalk.blue.inverse('Azul'), context.username);
                    break;
                  case "verde":
                    mqtt.publish("homie/ircontrole/InfraRed/code/set", "0xF7A05F");
                    logs.logs('Refletor ', String.fromCodePoint('0x1F4A1') + chalk.green.inverse('Verde'), context.username);
                    break;
                  default:
                    break;
                }
                break;
            default:
                break;
        }
    });
};

