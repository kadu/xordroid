const bent = require('bent');
const getJSON = bent('json');
const jokeAPIURL = "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit";
const piadaAPIURL = "https://us-central1-kivson.cloudfunctions.net/charada-aleatoria";
const cartoonAudioURL = "https://actions.google.com/sounds/v1/cartoon/";
const cartoonAudios = [
  "slide_whistle_to_drum.ogg",
  "slide_whistle.ogg",
  "siren_whistle.ogg",
  "pop.ogg",
  "concussive_hit_guitar_boing.ogg",
  "cartoon_boing.ogg",
];

function getFunAudio() {
  const randomElement = cartoonAudios[Math.floor(Math.random() * cartoonAudios.length)];
  return cartoonAudioURL + randomElement;
}



exports.default = (client, obs, mqtt, messages, commandQueue, ttsQueue) => {
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

              client.say(target, msgpiada);
              ttsQueue.push( {'msg': msgpiada, 'lang': 'en','inputType': 'text'});
              break;

            case '!piada':
              // response = await getJSON(piadaAPIURL);
              // msgpiada = `<speak>${response.pergunta}<break time="1400ms"/>${response.resposta}<audio src="${getFunAudio()}"/></speak>`;
              ttsQueue.push( {'msg': 'Temporariamente desabilitado!', 'lang': 'pt-BR', 'inputType': 'ssml'});
              break;
            default:
                break;
        }
    });
};



