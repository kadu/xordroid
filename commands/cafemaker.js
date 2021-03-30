const chalk = require('chalk');

exports.default = (client, obs, mqtt, messages) => {
  client.on('message', (target, context, message, isBot) => {
    if (isBot) return;

    let proxima_data = "20/03/2021 - próximo sabado!"

    switch (message) {
        case '!cafemaker':
        case '!cafe':
            client.say(
                target,
                `O Próximo Café Maker será dia ${proxima_data} as 10:00 am - Playlist no youtube  https://bit.ly/ytcafemaker`,
            );
            break;
        case '!ad':
          client.commercial("kaduzius",60).then((data) => {
            console.log(chalk.redBright("***** COMERCIAL ****"));
            console.log(data);
          });
        default:
            break;
    }
  });
};

