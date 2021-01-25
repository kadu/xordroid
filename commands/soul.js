const CP_Carrinho = '41c23fbb-b8ab-4a41-b782-8652bf4723c0';

exports.default = (client, obs, mqtt, messages, botDB, commandQueue) => {
    client.on('message', (target, context, message, isBot) => {
        if (isBot) return;

        switch (message) {
            case '!mostrafila':
                client.say(
                    target,
                    `${commandQueue.length}`,
                );
                break;
            default:
                break;
        }
    });

    client.on("raw_message", async (messageCloned, message) => {
      let hasError = false;
      if(message.tags['custom-reward-id'] === CP_Carrinho) {
        let raw_cmd = message.params[1];

        // raw_cmd = raw_cmd.replace(/ /g, "");
        // raw_cmd = raw_cmd.replace(/[^a-zA-Z,]/g);
        raw_cmd = raw_cmd.replace(/[^a-zA-Z,]/g, "");

        let comandos = raw_cmd.split(",");
        if(comandos.length > 25) {
          client.say(message.params[0], "Você enviou mais de 25 comandos, eu fiquei revoltado e não vou andar MrDestructoid");
          return;
        }
        let comandosErrados = "";
        comandos.forEach(comando => {
          let cmdNumber = -1;
          if(!!comando) {
            console.log(comandos);
            switch (comando.toLowerCase()) {
              case "frente":
                cmdNumber = 1;
                break;
              case "tras":
                cmdNumber = 2;
                break;
              case "direita":
                cmdNumber = 3;
                break;
              case "esquerda":
                cmdNumber = 4;
                break;
              case "lanterna":
                cmdNumber = 5;
                break;
              default:
                cmdNumber = -1;
                hasError = true;
                comandosErrados += comando + " ";
                break;
            }
          }

          if(cmdNumber !== -1) {
            commandQueue.push(cmdNumber.toString());
          }
        });

        if(!hasError) {
          client.say(message.params[0], "Comandos Executados!");
        } else {
          client.say(message.params[0], `Ei @${message.tags['display-name']}, você mandou esses comandos errados:${comandosErrados}, que barberagem em!`);
        }
      }
    });

    setInterval(()=> {
      if(commandQueue.length > 0) {
        comando = commandQueue.shift();
        console.log(`Mandando comando (${comando})`);
        if(comando === '5') {
          mqtt.publish("xordroid/flash", comando.toString());
        } else {
          mqtt.publish("xordroid/motors", comando.toString());
        }
      }
    }, 1500);

};

