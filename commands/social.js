const logs = require('./commons/log');

exports.default = (client, obs, mqtt, messages) => {

  client.on('message', (target, context, message, isBot) => {
    if (isBot) return;
    switch (message) {
      case '!social':
        client.say(target, 'http://www.kaduzi.us/social/');
        logs.logs('Social', '!social', context.username);
        break;
      case '!eu':
        client.say(target, 'http://kaduzi.us/');
        logs.logs('Social', '!eu', context.username);
        break;
      case '!linkedin':
        client.say(target, 'https://www.linkedin.com/in/kadubr/');
        logs.logs('Social', '!linkedin', context.username);
        break;

      case '!youtube':
        client.say(target, 'https://youtube.com/canaldokadu');
        logs.logs('Social', '!youtube', context.username);
        break;

      case '!insta':
      case '!instagram':
        client.say(target, 'https://www.instagram.com/canaldokadu/');
        logs.logs('Social', '!instagram', context.username);
        break;

      case '!git':
      case '!github':
        client.say(target, 'Github do Kaduzius -> https://github.com/kadu/');
        logs.logs('Social', '!git', context.username);
        break;

      case '!lojinha':
        client.say(target, 'http://kaduzi.us/lojinha');
        logs.logs('Social', '!lojinha', context.username);
        break;

      case '!discord':
        client.say(target, 'Vai la no discord do Kaduzius ;) -> https://discord.gg/rmvBYJc4r5 <- ');
        logs.logs('Social', '!discord', context.username);
        break;

      case '!iotstreamers':
        client.say(target, 'https://discord.gg/Gk5e5Cx');
        logs.logs('Social', '!iotstreamers', context.username);
        break;

      case '!julialabs':
        client.say(target, 'Discord -> https://discord.gg/qdfaNcPv | Twitch.tv -> https://www.twitch.tv/julialabs | Youtube -> https://www.youtube.com/channel/UChfu9xWITOvsXYLKm7hieSQ');
        logs.logs('Social', '!julialabs', context.username);
        break;

      case '!pix':
        client.say(target, 'Donate com PIX -> http://www.kaduzi.us/pix');
        logs.logs('Social', '!pix', context.username);
        break;

      case '!guilda':
        client.say(target, 'Site da Guilda Maker -> https://guildamaker.com/');
        logs.logs('Social', '!guilda', context.username);
        break;

      case '!commands':
      case '!comandos':
        client.say(target, 'A lista ficou grande, bora ver todos os comandos aqui -> https://www.kaduzi.us/twitch-comandos');
        logs.logs('Social', '!comandos', context.username);
        break;
      default:
        break;
    }
  });
};