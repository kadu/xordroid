exports.default = (client, target, context, messages) => {
  client.on('message', (target, context, message, isBot) => {
    if (isBot) return;

    let parsedMessage = message.split(" ");

    switch (parsedMessage[0]) {
      case '!jpbrab0':
        client.say(target,`Papai, é você? @jpbrab0`);
        break;
      case '!caraio':
        client.say(target,`Acho que cê ta na live errada Kappa. A certa é essa aqui: @pachicodes`);
        break;
      case '!captura':
      case '!capturar':
      case '!selvagem':
        client.say(target,`Acho que cê ta na live errada Kappa. A certa é essa aqui: @pokemaobr`);
        break;
      case '!meme':
        client.say(target,`Eu ouvi falar C# ? cola lá na live do @daniel_dev`);
        break;
      case '!party':
        client.say(target,`A festa é com o @webmat1, não é aqui não`);
        break;
      case '!eita':
        client.say(target,`Soma 10 pra @levxyca ae`);
        break;
      case '!shot':
      case '!spray':
        client.say(target,`Eu não tenho o jogo do canhão, mas passa la no @webmat1, lá tem! ;)`);
        break;
      case '!eletroblocks':
        client.say(target,`Conheça mais os eletroblocks aqui -> https://www.instagram.com/eletroblocks/, veja também a live da @julialabs, a projetista dos eletroblocks! ;)`);
        break;
      case '!java':
        client.say(target,`Esse negocio de ficar arrepiando o diabo só acontece la na live do @daviprm_, ja aproveita e da um cola lá, um followzinho ;)`);
        break;
      case '!hub':
        client.say(target,`Conheça a HUB, A porta de conexão com comunidade! -> http://ahub.tech/discord`);
        break;
      default:
        break;
    }
    message = message.toLowerCase();
    if(message.includes('orgulhodeserdochat')) {
      client.say(
          target,
          `#OrgulhoDeSerDoChat \\o/`,
      );
    }
  });
};