exports.default = (client, obs, mqtt, messages, botDB, commandQueue, ttsQueue) => {
    client.on('message', (target, context, message, isBot) => {
        if (isBot) return;
        let parsedMessage = message.split(" ");

        // if(parsedMessage[0] === '!tts' || parsedMessage[0] === '!entts' || parsedMessage[0] === '!pttts' || parsedMessage[0] === '!frtts') {
        //   return;
        // }

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

        if(parsedMessage[0] === '!frtts') {
          let fullMessage = context["display-name"] + " disse: " + message.replace("!frtts ","");
          ttsQueue.push( {'msg': fullMessage, 'lang': 'fr-FR','inputType': 'text'});
        }
    });
};

