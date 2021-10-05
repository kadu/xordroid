exports.default = (client, obs, mqtt, messages) => {

  client.on('message', (target, context, message, isBot) => {
    if (isBot) return;
    switch (message) {
      case '!social':
        client.say(target, 'http://www.kaduzi.us/social/');
        break;
      case '!eu':
        client.say(target, 'http://kaduzi.us/');
        break;

      case '!youtube':
        client.say(target, 'https://bit.ly/canaldokadu');
        break;

      case '!insta':
      case '!instagram':
        client.say(target, 'https://www.instagram.com/canaldokadu/');
        break;

      case '!git':
      case '!github':
        client.say(target, 'Github do Kaduzius -> https://github.com/kadu/');
        break;

      case '!lojinha':
        client.say(target, 'http://kaduzi.us/lojinha');
        break;

      case '!discord':
        client.say(target, 'Vai la no discord do Kaduzius ;) -> https://discord.gg/rmvBYJc4r5 <- ');
        break;

      case '!iotstreamers':
        client.say(target, 'https://discord.gg/Gk5e5Cx');
        break;

      case '!julialabs':
        client.say(target, 'Discord -> https://discord.gg/qdfaNcPv | Twitch.tv -> https://www.twitch.tv/julialabs | Youtube -> https://www.youtube.com/channel/UChfu9xWITOvsXYLKm7hieSQ');
        break;

      case '!pix':
        client.say(target, 'Donate com PIX -> http://www.kaduzi.us/pix');
        break;

      case '!guilda':
        client.say(target, 'Arduino Day 2021 -> https://guildamaker.com/');
        break;

      case '!commands':
      case '!comandos':
        client.say(target, 'A lista ficou grande, bora ver todos os comandos aqui -> https://www.kaduzi.us/twitch-comandos');
        break;
      case '!prime':
        client.say(target, 'Tem Amazon Prime e ainda não vinculou sua conta ? Faça isso, aproveite e escorrega o Prime aqui e apoie o canal -> 1. Acesse https://gaming.amazon.com |-| 2. Faca login na sua conta da amazon.com.br |-| 3. Selecione vincular conta da Twitch |-| 4. Faca login na sua conta da Twitch e selecione Confirmar. |-| 5. Volte aqui no canal do Kaduzius, clique em Inscrever-se! - E já fica aqui o meu muito obrigado!!');
        break;
      default:
        break;
    }
	});
};