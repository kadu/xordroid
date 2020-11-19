exports.default = (client, obs, mqtt, messages) => {
    client.on('message', (target, context, message, isBot) => {
        if (isBot) return;

        switch (message) {
          case '!streamdeckble':
          case '!streamdeck':
              client.say(
                  target,
                  `Ficou bem massa esse projeto, da uma olhada aqui ó https://github.com/kadu/arduino_stream_deck`,
              );
              break;
          default:
              break;
        }
    });
};

