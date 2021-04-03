const dotenv = require('dotenv');
dotenv.config();

const TTS_ENABLED = process.env.TTS_ENABLED;

exports.default = (client, obs, mqtt, messages, commandQueue, ttsQueue) => {
    client.on('message', (target, context, message, isBot) => {
        if (isBot) return;

        const isTTSEnabled = TTS_ENABLED == "true";

        let ttsCommands=[];

        const TTSLanguage = [
          {"command": "!tts"  , "language": "pt-BR", "saidText": "disse" },
          {"command": "!entts", "language": "en"   , "saidText": "said" },
          {"command": "!pttts", "language": "pt-PT", "saidText": "disse" },
          {"command": "!frtts", "language": "fr-FR", "saidText": "mentionné" },
          {"command": "!rutts", "language": "ru-RU", "saidText": "сказал" },
          {"command": "!detts", "language": "ru-RU", "saidText": "sagt" }
        ];

        let parsedMessage = message.split(" ");

        TTSLanguage.forEach((command) => {
          if(parsedMessage[0] === command.command) {
            if(!isTTSEnabled) {
              client.say(target, "TTS is disabled | TTS está desativado");
              return;
            }

            let fullMessage = context["display-name"] + command.saidText  + " : " + message.replace(command.command,"");
            ttsQueue.push( {'msg': fullMessage, 'lang': command.language,'inputType': 'text'});
          }
        });
    });
};