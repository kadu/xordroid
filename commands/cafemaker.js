const axios = require('axios').default;
const dotenv = require('dotenv');
const chalk = require('chalk');

dotenv.config();

exports.default = (client, obs, mqtt, messages) => {
  client.on('message', (target, context, message, isBot) => {

    let proxima_data = "04/12/2021 - Um ano de Café Maker! bora comemorar conosco";

    switch (message) {
        case '!cafemaker':
        case '!cafe':
          client.say(
              target,
              `O Próximo Café Maker será dia ${proxima_data} as 16:00 - Veja os outros episódios no youtube  https://bit.ly/ytcafemaker`,
          );

          setTimeout(() => {
            client.say(
              target,
              `Aproveitando, tem um projeto? quer apresentar no café? prencha o formulário -> https://forms.gle/mb3TNDmu9wtZzsTe9`,
            );
          }, 2000);
          break;        
        default:
          break;
    }
  });
};

