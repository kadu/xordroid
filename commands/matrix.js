exports.default = (client, obs, mqtt, messages) => {
  client.on('message', (target, context, message, isBot) => {
    if (isBot) return;

    let parsedMessage = message.split(" ");
    switch (parsedMessage[0]) {
      case '!matrix':
        let fullMessage = message.replace("!matrix ","").normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        messages.push(fullMessage);
        // mqtt.publish("xordroid/message", fullMessage);
        break;
      default:
        break;
    }
  });
};