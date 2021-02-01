var request = require('request-promise');
const dotenv = require('dotenv');
dotenv.config();


var id = "UC3pkYuCPdMK7aEqYXcatzNQ"; //channelID
var key = process.env.GOOGLE_KEY;
var url = "https://www.googleapis.com/youtube/v3/channels?part=statistics&id=" + id + "&key=" + key;

let getCounter = async (channelUrl) => {
  let response = await request({
    method: 'GET',
    url: url
  });
  var json = JSON.parse(response);
  return(json.items[0].statistics.subscriberCount);
}

exports.default = (client, obs, mqtt, messages) => {
    client.on('message', async (target, context, message, isBot) => {
        if (isBot) return;

        switch (message) {
            case '!ytcount':
                contador = await getCounter();
                messages.push(`Valeu por chegar a ${contador} inscritos no youtube \\o/`);
                break;
            default:
                break;
        }
    });
};

