exports.default = (client) => {

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

      case '!instagram':
        client.say(target, 'https://www.instagram.com/canaldokadu/');
        break;

      case '!github':
        client.say(target, 'https://github.com/kadu/');
        break;

      default:
        break;
    }
	});
};