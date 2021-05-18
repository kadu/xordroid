const axios = require('axios').default;
const dotenv = require('dotenv');
const chalk = require('chalk');

dotenv.config();
OAUTH_TOKEN = process.env.OAUTH_TOKEN;

// async function RodarAd(ad_time_sec, ad_interval_min) {

//   setInterval(async () => {
//     let options = {
//       headers: {
//         'Authorization': `Bearer ${OAUTH_TOKEN}`,
//         'Client-Id': `${auth.getAuth('appID')}`, << == descobrir o q é
//         'Content-Type': 'application/json'
//       }
//     };

//     await console.log("tentando rodar comercial...");
//     //recebe o broadcaster ID via GET
//     response = await axios.get(`https://api.twitch.tv/helix/users?`, options);
//     let broadcasterID = response.data.data[0].id;

//     //solicita geração do commercial via POST
//     await axios.post('https://api.twitch.tv/helix/channels/commercial', {
//       broadcaster_id: broadcasterID, length: ad_time_sec
//     }, options)
//       .then(function (response) {
//         console.log(response.data.data[0].message);
//       })
//       .catch(function (error) {
//         console.log(error.response.data.message);
//       });

//   }, ad_interval_min * 60000);
// }

exports.default = (client, obs, mqtt, messages) => {
  client.on('message', (target, context, message, isBot) => {
    if (isBot) return;

    let proxima_data = "22/05/2021 - E teremos convidados sensacionais ;)";

    switch (message) {
        case '!cafemaker':
        case '!cafe':
            client.say(
                target,
                `O Próximo Café Maker será dia ${proxima_data} as 10:00 am - Playlist no youtube  https://bit.ly/ytcafemaker - Tem um projeto, quer apresentar, prencha o formulário -> https://forms.gle/mb3TNDmu9wtZzsTe9`,
            );
            break;
        case '!ad':
          //https://github.com/hvilela0/DesktopJS/blob/master/modulos/ad.js
          client.commercial("kaduzius",60).then((data) => {
            console.log(chalk.redBright("***** COMERCIAL ****"));
            console.log(data);
          });
        case '!arduinoday':
          client.say(
            target,
            `Veja o vídeo do arduinoday aqui https://www.youtube.com/watch?v=jtolLoAbRh8`
          );
          break;
        default:
            break;
    }
  });
};

