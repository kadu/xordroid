const logs = require('./commons/log');

const request = require('request-promise');
const dotenv = require('dotenv');
dotenv.config();


const id = "UC3pkYuCPdMK7aEqYXcatzNQ"; //channelID
const key = process.env.GOOGLE_KEY;
const url = "https://www.googleapis.com/youtube/v3/channels?part=statistics&id=" + id + "&key=" + key;

let getCounter = async (channelUrl) => {
  try {
    let response = await request({
      method: 'GET',
      url: url
    });
    const json = JSON.parse(response);
    let resultado;
      resultado = json.items[0].statistics.subscriberCount
  } catch (error) {
    resultado = -1;
  }
  return(resultado);
}

exports.default = (client, obs, mqtt, messages) => {
    client.on('message', async (target, context, message, isBot) => {
        if (isBot) return;

        switch (message) {
            case '!ytcount':
                contador = await getCounter();
                messages.push(`Valeu por chegar a ${contador} inscritos no youtube \\o/`);
                logs.logs('YT Counter', `# ${contador}`, context.username);
                break;
            default:
                break;
        }
    });
};

