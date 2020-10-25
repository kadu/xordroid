exports.default = (client, obs, mqtt) => {
  client.on('message', (target, context, message, isBot) => {
    if (isBot) return;

    let parsedMessage = message.split(" ");
    switch (parsedMessage[0]) {
      case '!matrix':
        let fullMessage = message.replace("!matrix ","").normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        mqtt.publish("xordroid/weather/message", fullMessage);
        break;
      default:
        break;
    }
  });
};