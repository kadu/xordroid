exports.default = (client, obs, mqtt, messages, botDB, commandQueue, ttsQueue) => {
    client.on('message', (target, context, message, isBot) => {
        if (isBot) return;

        let parsedMessage = message.split(" ");
        if(parsedMessage[0] === '!tts') {
          let fullMessage = context["display-name"] + " disse: " + message.replace("!tts ","");
          ttsQueue.push( {'msg': fullMessage, 'lang': 'pt-BR','inputType': 'text'});
        }

        if(parsedMessage[0] === '!entts') {
          let fullMessage = context["display-name"] + " says: " + message.replace("!entts ","");
          ttsQueue.push( {'msg': fullMessage, 'lang': 'en','inputType': 'text'});
        }

        if(parsedMessage[0] === '!pttts') {
          let fullMessage = context["display-name"] + " disse: " + message.replace("!pttts ","");
          ttsQueue.push( {'msg': fullMessage, 'lang': 'pt-PT','inputType': 'text'});
        }
    });
};

