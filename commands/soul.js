exports.default = (client, obs, mqtt, messages) => {
    client.on('message', (target, context, message, isBot) => {
        if (isBot) return;

        let parsedMessage = message.split(" ");
        if(parsedMessage[0] === "!motor") {
          if(parsedMessage[1] === "frente") {
            mqtt.publish("xordroid/motors", "1");
          }
          if(parsedMessage[1] === "tras") {
            mqtt.publish("xordroid/motors", "2");
          }
          if(parsedMessage[1] === "direita") {
            mqtt.publish("xordroid/motors", "3");
          }
          if(parsedMessage[1] === "esquerda") {
            mqtt.publish("xordroid/motors", "4");
          }
        }

    });
};

