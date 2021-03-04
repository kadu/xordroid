const dotenv = require('dotenv');
const bent = require('bent');
const getJSON = bent('json');
const WURL = 'https://api.openweathermap.org/data/2.5/weather?units=metric&lang=pt_br&q=';


//api.openweathermap.org/data/2.5/weather?q={city name},{state code},{country code}&appid={API key}

dotenv.config();
openWeatherKey = process.env.OPENWEATER_KEY;

//let coord = {"latitude": 37, "longitude": -122 };


exports.default = (client, obs, mqtt, messages, botDB, commandQueue, ttsQueue) => {
    client.on('message', async (target, context, message, isBot) => {
        if (isBot) return;

        let parsedMessage = message.split(" ");
        switch (parsedMessage[0]) {
            case '!tempo':
            case '!weather':
                let fullMessage = message.replace("!weather ","").replace("!tempo ","").normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                let cidade = fullMessage;
                let response = "";
                try {
                  response = await getJSON(`${WURL}${cidade}&appid=${openWeatherKey}`);
                  console.log(response);
                  client.say(
                      target,
                      `${response.name} temos ${response.main.temp}ºC com sensação térmica de ${response.main.feels_like}ºC. ${response.weather[0].description}`,
                  );
                } catch (error) {
                  client.say(target, 'Não consegui achar sua cidade :/');
                  console.log(error);
                }
                break;
            default:
                break;
        }
    });
};

