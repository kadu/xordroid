const logs = require('./commons/log');

exports.default = (client, target, context, messages) => {
  client.on('message', (target, context, message, isBot) => {
    if (isBot) return;

    let parsedMessage = message.split(" ");

    switch (parsedMessage[0]) {
      case '!jpbrab0':
        client.say(target,`Papai, é você? @jpbrab0`);
        logs.logs('Eastereggs', parsedMessage[0], context.username);
        break;
      case '!caraio':
        client.say(target,`Acho que cê ta na live errada Kappa. A certa é essa aqui: @pachicodes`);
        logs.logs('Eastereggs', parsedMessage[0], context.username);
        break;
      case '!captura':
      case '!capturar':
      case '!selvagem':
        client.say(target,`Acho que cê ta na live errada Kappa. A certa é essa aqui: @pokemaobr`);
        logs.logs('Eastereggs', parsedMessage[0], context.username);
        break;
      case '!meme':
        client.say(target,`Eu ouvi falar C# ? cola lá na live do @daniel_dev`);
        logs.logs('Eastereggs', parsedMessage[0], context.username);
        break;
      case '!party':
        client.say(target,`A festa é com o @webmat1, não é aqui não`);
        logs.logs('Eastereggs', parsedMessage[0], context.username);
        break;
      case '!eita':
        client.say(target,`Soma 10 pra @levxyca ae`);
        logs.logs('Eastereggs', parsedMessage[0], context.username);
        break;
      case '!shot':
      case '!spray':
        client.say(target,`Eu não tenho o jogo do canhão, mas passa la no @webmat1, lá tem! ;)`);
        logs.logs('Eastereggs', parsedMessage[0], context.username);
        break;
      case '!eletroblocks':
        client.say(target,`Conheça mais os eletroblocks aqui -> https://www.instagram.com/eletroblocks/, veja também a live da @julialabs, a projetista dos eletroblocks! ;)`);
        logs.logs('Eastereggs', parsedMessage[0], context.username);
        break;
      case '!java':
        client.say(target,`Esse negocio de ficar arrepiando o diabo só acontece la na live do @daviprm_, ja aproveita e da um cola lá, um followzinho ;)`);
        logs.logs('Eastereggs', parsedMessage[0], context.username);
        break;
      case '!hub':
        client.say(target,`Conheça a HUB, A porta de conexão com comunidade! -> http://ahub.tech/discord`);
        logs.logs('Eastereggs', parsedMessage[0], context.username);
        break;
      case '!issue':
      case '!ideia':
      case '!issues':
        client.say(target,`Tem alguma idéia pro XORdroid, coloca uma issue la no GitHub ;) -> https://github.com/kadu/xordroid/issues, Valeu!`);
        logs.logs('Eastereggs', parsedMessage[0], context.username);
        break;
      case '!3bc':
        client.say(target,`A linguagem de programção do Futuro -> https://3bc-lang.org!`);
        logs.logs('Eastereggs', parsedMessage[0], context.username);
        break;
      case '!cachorro':
        client.say(target,`Putz, eu não tenho cachorro, mas eu sei que o @leo_churrasqueiro tem um que fica latindo na live, cola lá conhecer o cachorro dele!`);
        logs.logs('Eastereggs', parsedMessage[0], context.username);
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
      logs.logs('Eastereggs', parsedMessage[0], context.username);
    }
  });
};