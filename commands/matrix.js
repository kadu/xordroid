const CP_Matrix = '1c880a37-8dc6-487d-97c6-8f05963c5c75';
const logs = require('./commons/log.js');

exports.default = (client, obs, mqtt, messages) => {
  client.on('message', (target, context, message, isBot) => {
    if (isBot) return;

    if(context.username !== 'kaduzius') return;

    const parsedMessage = message.split(" ");
    const fullMessage = message.replace("!matrix ","").replace("!fixmatrix ","").normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    switch (parsedMessage[0]) {
      case '!matrix':
        messages.push(fullMessage);
        logs.logs('led matrix', fullMessage, context.username);
        break;
        case '!fixmatrix':
          mqtt.publish("homie/ledmatrix/message/state", "Idle");
          mqtt.publish("homie/ledmatrix/message/fixmessage/set", fullMessage);
          logs.logs('led matrix', fullMessage, context.username);
          break;
      default:
        break;
    }
  });

  client.on("raw_message", async (messageCloned, message) => {
    if(message.tags['custom-reward-id'] === CP_Matrix) {
      const fullMessage = message.params[1].normalize('NFD').replace(/[\u0300-\u036f]/g, "");
      messages.push(fullMessage);
      logs.logs('led matrix', fullMessage, message.tags['display-name']);
    }
  });

};