exports.default = (client, obs, mqtt) => {
    client.on('message', (target, context, message, isBot) => {
        if (isBot) return;

        switch (message) {
            case '!comando':
                client.say(
                    target,
                    `só um teste... básico!`,
                );
                break;
            default:
                break;
        }
    });
};

