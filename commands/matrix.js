const CP_Matrix = '1c880a37-8dc6-487d-97c6-8f05963c5c75';

exports.default = (client, obs, mqtt, messages) => {
  client.on('message', (target, context, message, isBot) => {
    if (isBot) return;

    if(context.username !== 'kaduzius') return;

    let parsedMessage = message.split(" ");
    switch (parsedMessage[0]) {
      case '!matrix':
        let fullMessage = message.replace("!matrix ","").normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        messages.push(fullMessage);
        break;
      default:
        break;
    }
  });

  client.on("raw_message", async (messageCloned, message) => {
    if(message.tags['custom-reward-id'] === CP_Matrix) {
      let fullMessage = message.params[1].normalize('NFD').replace(/[\u0300-\u036f]/g, "");
      messages.push(fullMessage);
    }
  });

};