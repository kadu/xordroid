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
                    break;
                  case "desliga":
                    mqtt.publish("homie/ircontrole/InfraRed/code/set", "0xF740BF");
                    break;
                  case "vermelho":
                    mqtt.publish("homie/ircontrole/InfraRed/code/set", "0xF720DF");
                    break;
                  case "azul":
                    mqtt.publish("homie/ircontrole/InfraRed/code/set", "0xF7609F");
                    break;
                  case "verde":
                    mqtt.publish("homie/ircontrole/InfraRed/code/set", "0xF7A05F");
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

