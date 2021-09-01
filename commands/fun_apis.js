const dotenv = require('dotenv');
const { get } = require('request-promise');
const translate = require('translate');
dotenv.config();
translate.engine = process.env.TRANSLATE_ENGINE;
translate.key = process.env.GOOGLE_KEY;
const funapi = "http://api.fungenerators.com/fact/random"
const chuckAPI = "https://api.chucknorris.io/jokes/random"
const quotesAPI = "https://api.fisenko.net/quotes"
const dadJokeAPI = "https://icanhazdadjoke.com/"


exports.default = (client, obs, mqtt, messages) => {
    client.on('message', async (target, context, message, isBot) => {
        let translated;
        if (isBot) return;

        switch (message) {
            case '!chuck':
                response = await get(chuckAPI);
                response = JSON.parse(response);
                translated = await translate(response?.value, { from: 'en', to: 'pt' });

                client.say(
                    target,
                    `Chuck Facts!: ${translated} (En: ${response?.value})`,
                );
                break;
            case '!quote':
              response = await get(quotesAPI);
              response = JSON.parse(response);
              translated = await translate(response?.text, { from: 'en', to: 'pt' });

              client.say(
                  target,
                  `Frase!: ${translated} (Autor: ${response?.author}) `,
              );
              break;
              case '!en-quote':
              case '!enquote':
                response = await get(quotesAPI);
                response = JSON.parse(response);
                translated = await translate(response?.text, { from: 'en', to: 'pt' });

                client.say(
                    target,
                    `Quote: ${response?.text} (Autor: ${response?.author})`,
                );
                break;

              case '!tiozao':
                  response = await get({uri:dadJokeAPI, json: true});
                  // response = JSON.parse(response);
                  translated = await translate(response?.joke, { from: 'en', to: 'pt' });

                  client.say(
                      target,
                      `Tiozao: ${translated}`,
                  );
                  break;
                case '!dadjoke':
                    response = await get({uri:dadJokeAPI, json: true});
                    translated = await translate(response?.joke, { from: 'en', to: 'pt' });

                    client.say(
                        target,
                        `DadJoke: ${response?.joke}`,
                    );
                    break;
              default:
                break;
        }
    });
};

