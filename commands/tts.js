const dotenv = require('dotenv');
dotenv.config();

const TTS_ENABLED = process.env.TTS_ENABLED;

exports.default = (client, obs, mqtt, messages, commandQueue, ttsQueue) => {
    client.on('message', (target, context, message, isBot) => {
        if (isBot) return;

        const isTTSEnabled = TTS_ENABLED == "true";

        let ttsCommands=[];
        let coolDownControl=[];

        const TTSLanguage = [
          {"command": "!tts"  , "language": "pt-BR", "saidText": "disse" },

          {"command": "!tts-en", "language": "en"   , "saidText": "said" },
          {"command": "!entts", "language": "en"   , "saidText": "said" },

          {"command": "!tts-pt", "language": "pt-PT", "saidText": "disse" },
          {"command": "!pttts", "language": "pt-PT", "saidText": "disse" },

          {"command": "!tts-fr", "language": "fr-FR", "saidText": "mentionné" },
          {"command": "!frtts", "language": "fr-FR", "saidText": "mentionné" },

          {"command": "!tts-ru", "language": "ru-RU", "saidText": "сказал" },
          {"command": "!rutts", "language": "ru-RU", "saidText": "сказал" },

          {"command": "!tts-de", "language": "de-DE", "saidText": "sagt" },
          {"command": "!detts", "language": "de-DE", "saidText": "sagt" },

          {"command": "!tts-es", "language": "es-ES", "saidText": "discho" },
          {"command": "!estts", "language": "es-ES", "saidText": "discho" },

          {"command": "!tts-jp", "language": "ja-JP", "saidText": "前記" },
          {"command": "!jptts", "language": "ja-JP", "saidText": "前記" },

          {"command": "!tts-it", "language": "it-IT", "saidText": "disse" },
          {"command": "!ittts", "language": "it-IT", "saidText": "disse" },

          {"command": "!tts-ch", "language": "yue-HK", "saidText": "说" },
          {"command": "!chtts", "language": "yue-HK", "saidText": "说" },
        ];

        let parsedMessage = message.split(" ");

        TTSLanguage.forEach((command) => {
          if(parsedMessage[0] === command.command) {
            if(!isTTSEnabled) {
              client.say(target, "TTS is disabled | TTS está desativado");
              return;
            }

            // coolDownControl.push({'user': context["display-name"], 'ts':context["tmi-sent-ts"]});
            // coolDownControl.forEach((k,v) => {
            //   var date = new Date(v.ts * 1000);
            //   date.getTime() <
            // });

            let fullMessage = context["display-name"] + command.saidText  + " : " + message.replace(command.command,"");
            ttsQueue.push( {'msg': fullMessage, 'lang': command.language,'inputType': 'text'});
          }
        });
    });
};