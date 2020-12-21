exports.default = (client, obs, mqtt, messages) => {
    client.on('message', (target, context, message, isBot) => {
        if (isBot) return;

        switch (message) {
            case '!projets':
            case '!projetos':
                client.say(
                    target,
                    `Veja a lista de projetos: ->
                    !xordroid (eu mesmo, o bot),
                    !streamdeck (hello world dos makers na twitch.tv),
                    !gatekeeper (o porteiro)
                    !pcb_natal (Enfeite de arvore de natal)
                    `,
              );
                break;
            default:
                break;
        }
    });
};

