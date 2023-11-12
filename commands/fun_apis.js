const dotenv     = require('dotenv');
const { get }    = require('request-promise');
const translate  = require('translate');
const logs       = require('./commons/log');
const funapi     = "http://api.fungenerators.com/fact/random"
const chuckAPI   = "https://api.chucknorris.io/jokes/random"
const quotesAPI  = "https://api.fisenko.net/v1/quotes/en/random"
const dadJokeAPI = "https://icanhazdadjoke.com/"

dotenv.config();
translate.engine = process.env.TRANSLATE_ENGINE;
translate.key = process.env.TRANSLATE_KEY;

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
                logs.logs('FUN APIS', message, context.username);
                break;
            case '!frase':
            case '!quote':
              response = await get(quotesAPI);
              response = JSON.parse(response);
              translated = await translate(response?.text, { from: 'en', to: 'pt' });

              client.say(
                  target,
                  `Frase!: ${translated} (Autor(a): ${response?.author.name}) `,
              );
              logs.logs('FUN APIS', message, context.username);
              break;
              case '!en-quote':
              case '!enquote':
                response = await get(quotesAPI);
                response = JSON.parse(response);
                translated = await translate(response?.text, { from: 'en', to: 'pt' });

                client.say(
                    target,
                    `Quote: ${response?.text} (Author: ${response?.author.name})`,
                );
                logs.logs('FUN APIS', message, context.username);
                break;

              case '!tiozao':
                  response = await get({uri:dadJokeAPI, json: true});
                  // response = JSON.parse(response);
                  let textHelper = response?.joke.replaceAll('.',';');
                  translated = await translate(textHelper, { from: 'en', to: 'pt' });

                  // console.log(response);
                  // console.log(translated);

                  client.say(
                      target,
                      `Tiozao: ${translated}`,
                  );
                  logs.logs('FUN APIS', message, context.username);
                  break;
                case '!dadjoke':
                    response = await get({uri:dadJokeAPI, json: true});
                    translated = await translate(response?.joke, { text: response?.joke , from: 'en', to: 'pt' });
                    console.log(translated);

                    client.say(
                        target,
                        `DadJoke: ${response?.joke}`,
                    );
                    logs.logs('FUN APIS', message, context.username);
                    break;
              default:
                break;
        }
    });
};

