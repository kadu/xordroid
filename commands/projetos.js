exports.default = (client, obs, mqtt, messages) => {
    client.on('message', (target, context, message, isBot) => {
        if (isBot) return;

        switch (message) {
            case '!projects':
            case '!projetos':
                client.say(
                    target,
                    `Veja a lista de projetos: ->
                    !xordroid (eu mesmo, o bot),
                    !streamdeck (hello world dos makers na twitch.tv),
                    !gatekeeper (o porteiro),
                    !pcb_natal (Enfeite de arvore de natal),
                    !ledmatrix (Relógio que mostra mensagens),
                    !tts - !pttts e !entts (Mandeiras de fazer o google falar com o streamer),
                    !ytcount (Mostra qtde de pessoas inscritas no canal do youtube),
                    !piada - !joke (Contador de piadas),
                    !dica - !tocansado (Dicas do que fazer nos momentos "boring" da vida)
                    `,
              );
                break;
            case '!ledmatrix':
              client.say(target, "Quer ver como foi implementado nossa Matrix de Led? veja o código aqui https://github.com/kadu/LedMatrixHomieIOT");
              break;
            case '!pcb_natal':
              client.say(target, "O @kaduzius participou de um concurso bem bacana de PCBs artisticas, veja aqui o resultado https://github.com/kadu/christmas_badge_2020");
              break;
            case '!xordroid':
              client.say(target,`Quer me ver por dentro né... veja lá => https://github.com/kadu/xordroid`);
              break;
            case '!streamdeckble':
            case '!streamdeck':
              client.say(target,`Nosso StreamDeck ficou bem massa, da uma olhada aqui ó https://github.com/kadu/arduino_stream_deck`);
              break;
            case '!streamdeck-catalog':
              client.say(target,`Veja uma lista de Streamdecks feito pelos makers https://github.com/kadu/streamdeck-catalog`);
              break;
            case '!porteiro':
            case '!porteiroiot':
            case '!gatekeeperiot':
            case '!gatekeeper':
              client.say(target,`Meu amigo porteiro você encontra aqui -> https://github.com/kadu/GateKeeperIOT`);
              break;
            case '!cnc':
            case '!donate':
              client.say(target,`Você pode me ajudar a ter uma "super" cnc para fazer plaquinhas em casa, só mandar um "salve" via picpay pra @kadubr, se conseguirmos a maquineta, faremos lives e videos para o canal (aqui e na vermelhinha) mostrando como usar pra fazer as plaquinhas ;) - Valeu Grandão! (link da cnc: https://bit.ly/cncDU), se preferir, pode usar o PIX -> !pix pra pegar o QRCode `);
              break;
            case '!campainha':
              client.say(target,`Eu fiz um hack na minha campainha para as notificações aparecerem na automação ->  https://www.kaduzi.us/o-dia-que-eu-fiz-um-hack-na-minha-campainha/`);
              break;
            case '!timelapse':
              client.say(target,`Veja como construir um timelapse usando ESP32Cam -> https://www.kaduzi.us/esp32cam-timelapse-nodejs-server/`);
              break;
            default:
                break;
        }
    });
};

