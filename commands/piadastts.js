const bent = require('bent');
const getJSON = bent('json');
const jokeAPIURL = "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit";
const piadaAPIURL = "https://us-central1-kivson.cloudfunctions.net/charada-aleatoria";

exports.default = (client, obs, mqtt, messages, botDB, commandQueue, ttsQueue) => {
    client.on('message', async (target, context, message, isBot) => {
        if (isBot) return;

        let msgpiada;
        let response;
        switch (message) {
            case '!joke':
              response = await getJSON(jokeAPIURL);
              if(response.type === "single")
                msgpiada = response.joke;
              else {
                msgpiada = response.setup + "|" +  response.delivery; //#TODO melhorar essa concatenacao
              }

              ttsQueue.push( {'msg': msgpiada, 'lang': 'en','inputType': 'text'});
              break;

            case '!piada':
              response = await getJSON(piadaAPIURL);
              msgpiada = `<speak>${response.pergunta}<break time="1400ms"/>${response.resposta}<audio src="https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg"/></speak>`;
              ttsQueue.push( {'msg': msgpiada, 'lang': 'pt-BR', 'inputType': 'ssml'});
              break;
            default:
                break;
        }
    });
};



