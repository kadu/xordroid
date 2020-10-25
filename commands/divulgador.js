exports.default = (client, target, context, message) => {
  client.on('message', (target, context, message, isBot) => {
    if (isBot) return;

    switch (message) {
    case '!jpbrab0':
      client.say(
        target,
        `Papai, é você? twitch.tv/jpbrab0`,
      );
      break;
    case '!caraio':
      client.say(
        target,
        `Acho que cê ta na live errada Kappa. A certa é essa aqui: twitch.tv/pachicodes`,
      );
      break;
    case '!captura':
    case '!selvagem':
      client.say(
        target,
        `Acho que cê ta na live errada Kappa. A certa é essa aqui: twitch.tv/pokemaobr`,
      );
      break;
    case '!capturar':
      client.say(
        target,
        `Acho que cê ta na live errada Kappa. A certa é essa aqui: twitch.tv/pokemaobr`,
      );
      break;
    default:
      break;
      }
    });

};