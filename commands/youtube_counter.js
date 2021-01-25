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
                messages.push(`só tenho ${contador} inscritos no youtube  :( , me ajuda a chegar a 100`);
                // client.say(
                //     target,
                //     `Eu tenho ${contador}  inscritos no meu canal do youtube, se inscreve lá também e me ajuda chegar a 100 inscritos ?`,
                // );
                break;
            default:
                break;
        }
    });
};

