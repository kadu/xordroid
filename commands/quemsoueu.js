const bent    = require('bent');
const getJSON = bent('json');
const logs    = require('./commons/log');
const nacionalidadeURL = "https://api.nationalize.io/?name=";
const paisInfoURL      = "https://restcountries.com/v2/name/"
const generoURL        = "https://api.genderize.io?name=";
const idadeURL         = "https://api.agify.io?name=";
const urlLocalization  = "&country_id=BR";

exports.default = (client, obs, mqtt, messages, commandQueue, ttsQueue, send) => {
    client.on('message', async (target, context, message, isBot) => {
        if (isBot) return;

        let parsedMessage = message.split(" ");

        switch (parsedMessage[0]) {
            case '!nome':
            case '!quemsoueu':
              logs.logs('Quem sou eu', parsedMessage[0], context.username);
              if(parsedMessage[1] === undefined) {
                client.say(target, 'Necessário enviar um nome, exemplo !quemsoueu Carlos');
                break;
              }

              const nome = parsedMessage[1];
              response   = await getJSON(`${idadeURL}${nome}${urlLocalization}`);
              if(response.age === null) {
                client.say(target, 'Foi mal, nao achei esse nome');
                break;
              }
              let paises;
              const idade = response.age;
              response   = await getJSON(`${generoURL}${nome}${urlLocalization}`);
              const sexo = `${response.gender=="male" ? "homem":"mulher"} (${response.probability.toFixed(2)*100}%)`;
              response   = await getJSON(`${nacionalidadeURL}${nome}${urlLocalization}`);
              if(response.country.length == 0) {
                client.say(target, 'Foi mal, nao achei esse nome');
                paises = `(não vem, sem nacionalidade)`;
              } else {
                try {
                  let [response2]   = await getJSON(`${paisInfoURL}${response.country[0].country_id}`);
                  paises = `${response2.translations.br} (${response.country[0].probability.toFixed(2)*100}%)`
                } catch (error) {
                }
              }

              client.say(
                    target,
                    `Esse nome (${nome}) provavelmente tem ${idade} anos, é ${sexo} e vem deste pais ${paises}`,
              );
              break;
            default:
                break;
        }
    });
};

