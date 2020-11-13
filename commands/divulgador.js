exports.default = (client, target, context, messages) => {
  client.on('message', (target, context, message, isBot) => {
    if (isBot) return;

    switch (message) {
    case '!jpbrab0':
      client.say(
        target,
        `Papai, é você? @jpbrab0`,
      );
      break;
    case '!caraio':
      client.say(
        target,
        `Acho que cê ta na live errada Kappa. A certa é essa aqui: @pachicodes`,
      );
      break;
    case '!captura':
    case '!capturar':
    case '!selvagem':
      client.say(
        target,
        `Acho que cê ta na live errada Kappa. A certa é essa aqui: @pokemaobr`,
      );
      break;
      case '!participar':
      case '!meme':
        client.say(
          target,
          `Eu ouvi falar C# ? cola lá na live do @daniel_dev`,
        );
        break;
        case '!party':
          client.say(
            target,
            `A festa é com o @webmat1, não é aqui não`,
          );
          break;
    default:
      break;
      }
    });

};