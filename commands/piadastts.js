const bent      = require('bent');
const { response } = require('express');
const getJSON   = bent('json');
const jsdom     = require("jsdom");
const { JSDOM } = jsdom;

const jokeAPIURL = "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit";
const eltroblocks = "https://api.catarse.me/user_details?id=eq.1533481"
const piadaAPIURL = "https://us-central1-kivson.cloudfunctions.net/charada-aleatoria";
const piadasURL = "https://osvigaristas.com.br";
const piadasURI = "/charadas/pagina#.html";
const cartoonAudioURL = "https://actions.google.com/sounds/v1/cartoon/";
const cartoonAudios = [
  "slide_whistle_to_drum.ogg",
  "slide_whistle.ogg",
  "siren_whistle.ogg",
  "pop.ogg",
  "concussive_hit_guitar_boing.ogg",
  "cartoon_boing.ogg",
];

function randomInt(min, max) {
	return min + Math.floor((max - min) * Math.random());
}

function getFunAudio() {
  const randomElement = cartoonAudios[Math.floor(Math.random() * cartoonAudios.length)];
  return cartoonAudioURL + randomElement;
}

async function eletrocount() {
  let retorno = await getJSON(eltroblocks);
  return retorno[0].total_contributed_projects;
}

async function getPiada() {
  const getStream = bent(piadasURL);
  let stream = await getStream(piadasURI.replace("#",randomInt(1,33)));
  const str = await stream.text();
  const dom = new JSDOM(str);
  value = dom.window.document.querySelector(`#main > article:nth-child(${randomInt(2,30)}) > div > div > div:nth-child(2) > div`).textContent.trim().toLocaleLowerCase();
  return value;
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
              piada = await getPiada();
              piada = piada.replace("?", "?<break time='1400ms'/>");
              msgpiada = `<speak>${piada}<audio src="${getFunAudio()}"/></speak>`;
              ttsQueue.push( {'msg': msgpiada, 'lang': 'pt-BR', 'inputType': 'ssml'});
              break;

            case '!piadateste':
              getPiada();
              break;
            case '!eletrocount':
              let valor = await eletrocount();
              client.say(target, `a @julialabs e o eletroblocks já venderam ${valor} kits`);
              break;
            default:
                break;
        }
    });
};



