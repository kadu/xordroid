// const { response } = require('express');
const bent = require('bent');
const getJSON = bent('json');
const dicionario = "https://api.dicionario-aberto.net/random";

async function getWord() {
  value = await getJSON(dicionario);
  if(value.word.length < 10) {
    return value.word;
  } else {
    console.log(`Too long - ${value.word}`);
    return await getWord();
  }
}


exports.default = (client, obs, mqtt, messages, commandQueue, ttsQueue, send) => {
    client.on('message', async (target, context, message, isBot) => {
        if (isBot) return;

        switch (message) {
          case '!palavra':
              hangword = await getWord();
              client.say(
                  target,
                  `só um teste... básico! ${hangword} `,
              );
              break;
            default:
                break;
        }
    });
};

