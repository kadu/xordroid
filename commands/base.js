exports.default = (client, obs, mqtt, messages, commandQueue, ttsQueue, send) => {
    client.on('message', (target, context, message, isBot) => {
        if (isBot) return;

        switch (message) {
            case '!comando':
                client.say(
                    target,
                    `só um teste... básico!`,
                );

                client.whisper("kaduzius", "Your message")
                  .then((data) => {
                    console.log(data);
                  }).catch((err) => {
                    console.log(err);
                  });
                break;
            default:
                break;
        }
    });
};

