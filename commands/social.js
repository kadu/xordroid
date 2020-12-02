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

      case '!github':
        client.say(target, 'https://github.com/kadu/');
        break;

      case '!lojinha':
        client.say(target, 'http://kaduzi.us/lojinha');
        break;

      case '!discord':
        client.say(target, 'https://discord.gg/Gk5e5Cx');
        break;

      case '!julialabs':
        client.say(target, 'Discord -> https://discord.gg/qdfaNcPv | Twitch.tv -> https://www.twitch.tv/julialabs | Youtube -> https://www.youtube.com/channel/UChfu9xWITOvsXYLKm7hieSQ');
        break;

      default:
        break;
    }
	});
};