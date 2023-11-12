const CP_Carrinho = '41c23fbb-b8ab-4a41-b782-8652bf4723c0';

exports.default = (client, obs, mqtt, messages, commandQueue) => {
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
        let quantidadeComandos = 15;
        if(comandos.length > quantidadeComandos) {
          client.say(message.params[0], `Você enviou mais de ${quantidadeComandos} comandos, eu fiquei revoltado e não vou andar MrDestructoid`);
          return;
        }
        let comandosErrados = "";
        comandos.forEach(comando => {
          let cmdNumber = -1;
          if(!!comando) {
            console.log(comandos);
            switch (comando.toLowerCase()) {
              case "f":
              case "frente":
                cmdNumber = 1;
                break;
              case "t":
              case "tras":
              case "re":
              case "ré":
                cmdNumber = 2;
                break;
              case "d":
              case "direita":
                cmdNumber = 3;
                break;
              case "e":
              case "esquerda":
                cmdNumber = 4;
                break;
              case "l":
              case "lanterna":
                console.log('Lanterna chamando');
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
        commandQueue.push('6');
        commandQueue.push('6');

        if(!hasError) {
          client.say(message.params[0], "Comandos Executados!");
        } else {
          client.say(message.params[0], `Ei @${message.tags['display-name']}, você mandou esses comandos errados:${comandosErrados}, que barberagem em!`);
        }
      }
    });

    let sendParar = false;

    setInterval(()=> {
      if(commandQueue.length > 0) {
        sendParar = true;
        comando = commandQueue.shift();
        console.log(`Mandando comando (${comando})`);

        if(comando === '5') {
          mqtt.publish("xordroidbody/commands", "led");
        } else {

          switch (comando) {
            case '1':
              mqtt.publish("xordroidbody/commands", "frente");
              break;
            case '2':
              mqtt.publish("xordroidbody/commands", "tras");
              break;
            case '3':
              mqtt.publish("xordroidbody/commands", "direita");
              break;
            case '4':
              mqtt.publish("xordroidbody/commands", "esquerda");
              break;
            case '6':
              console.log('Mandando parar');
              mqtt.publish("xordroidbody/commands", "parar");
              break;
            default:
              break;
          }

          // mqtt.publish("xordroidbody/commands", "");
        }
      } else { // Se não tem mais comandos
        if(sendParar) {
          console.log("Mandando o parar");
          sendParar = false;
          mqtt.publish("xordroidbody/commands", "parar");
        }
      }

    }, 400);

};

