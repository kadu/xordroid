const dotenv = require('dotenv');
dotenv.config();

const TTS_ENABLED = process.env.TTS_ENABLED;

exports.default = (client, obs, mqtt, messages, commandQueue, ttsQueue) => {
    client.on('message', (target, context, message, isBot) => {
        if (isBot) return;

        const isTTSEnabled = TTS_ENABLED == "true";
        const ttsCommands = [
          '!tts'
          ,'!entts'
          ,'!pttts'
          ,'!frtts'
          ,'!rutts'
        ];
        let parsedMessage = message.split(" ");

        if(!ttsCommands.includes(parsedMessage[0])) {
          console.log('não é tts');
          return;
        }

        if(!isTTSEnabled) {
          client.say(target, "TTS is disabled | TTS está desativado");
          return;
        }

        if(parsedMessage[0] === '!tts' && isTTSEnabled) {
          let fullMessage = context["display-name"] + " disse: " + message.replace("!tts ","");
          ttsQueue.push( {'msg': fullMessage, 'lang': 'pt-BR','inputType': 'text'});
        }

        if(parsedMessage[0] === '!entts' && isTTSEnabled) {
          let fullMessage = context["display-name"] + " says: " + message.replace("!entts ","");
          ttsQueue.push( {'msg': fullMessage, 'lang': 'en','inputType': 'text'});
        }

        if(parsedMessage[0] === '!pttts' && isTTSEnabled) {
          let fullMessage = context["display-name"] + " disse: " + message.replace("!pttts ","");
          ttsQueue.push( {'msg': fullMessage, 'lang': 'pt-PT','inputType': 'text'});
        }

        if(parsedMessage[0] === '!frtts' && isTTSEnabled) {
          let fullMessage = context["display-name"] + " disse: " + message.replace("!frtts ","");
          ttsQueue.push( {'msg': fullMessage, 'lang': 'fr-FR','inputType': 'text'});
        }

        if(parsedMessage[0] === '!rutts' && isTTSEnabled) {
          let fullMessage = context["display-name"] + " disse: " + message.replace("!rutts ","");
          ttsQueue.push( {'msg': fullMessage, 'lang': 'ru-RU','inputType': 'text'});
        }
    });
};