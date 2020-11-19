exports.default = (client, obs, mqtt, messages) => {
    client.on('message', (target, context, message, isBot) => {
        if (isBot) return;

        switch (message) {
            case '!xordroid':
                client.say(
                    target,
                    `Quer me ver por dentro né... veja lá => https://github.com/kadu/xordroid`
                );
                break;
            default:
                break;
        }
    });
};

