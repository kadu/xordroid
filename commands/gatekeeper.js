exports.default = (client, obs, mqtt, messages) => {
    client.on('message', (target, context, message, isBot) => {
        if (isBot) return;

        switch (message) {
            case '!porteiro':
            case '!porteiroiot':
            case '!gatekeeperiot':
            case '!gatekeeper':
                client.say(
                    target,
                    `Meu amigo porteiro você encontra aqui -> https://github.com/kadu/GateKeeperIOT`,
                );
                break;
            default:
                break;
        }
    });
};