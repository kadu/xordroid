exports.default = (client, obs, mqtt) => {
  let currentScene;
  let obsIsConnected;

  function obsConnection() {
    obs.connect()
      .then(() => {
        obsIsConnected = true;
        console.log("Finalmente, conectado no OBS");
      })
      .catch(error => {
        var dt = new Date();

        console.log("[" + dt.getHours() + ":" + dt.getMinutes() + "] Nao conseguiu conectar no OBS");
      });
  }

  client.on('connected', (address, port) => {
    mqtt.publish("xordroid/weather/on", "");
    mqtt.publish("wled/158690", "ON");
    obsConnection();
  });

  obs.on('SwitchScenes', data => {
    currentScene = data.sceneName;
  });

  obs.on("ConnectionClosed", (data) => {
    obsIsConnected = false;
    mqtt.publish("xordroid/weather/off", "");
    mqtt.publish("wled/158690", "OFF");
    setTimeout(obsConnection,60000);
  });

  obs.on("ConnectionOpened", (data) => {
    obsIsConnected = true;
    obs.send('GetCurrentScene')
      .then(data => {
        currentScene = data.name;
        console.log("Cena atual ", currentScene);
      })
      .catch(() => {
        console.log("Algo aconteceu aqui!");
      });
  });

  function changeScene(Scene) {

    if(!["Esquerda + Protobord", "FullScreen", "Esquerda + Webcam"].includes(currentScene)) {
      if(currentScene == "Obrigado") {
        client.say(client.channels[0], "Valeu por acompanhar a live! Até a próxima e para de querer xeretar!");
      } else if(currentScene == "Ja volto") {
        client.say(client.channels[0], "Eu estou aqui, mas não posso fazer isso agora ;)");
      } else if(currentScene == "Abertura") {
        client.say(client.channels[0], "Calma, já vamos começar! Apressado!!!");
      } else {
        client.say(client.channels[0], "Putz, não consigo mudar a cena agora, o @Kaduzius deve ter feito alguma meleca!");
      }
      return;
    }

    let newScene;

    if(Scene == "proto") {
      newScene = "Esquerda + Protobord";
    }

    if(Scene == "webcam") {
      newScene = "FullScreen";
    }

    if(Scene == "tela") {
      newScene = "Esquerda + Webcam";
    }

    try {
      obs.send('SetCurrentScene', {
        'scene-name': newScene
      });
    } catch (error) {
      console.log("erro no setcurrentschene", error);
    }
  }

  client.on('message', (target, context, message, isBot) => {
    if (isBot) return;

    switch (message) {
      case '!tela':
      case '!screen':
        changeScene("tela");
        break;
      case '!proto':
      case '!protoboard':
      case '!breadboard':
        changeScene("proto");
        break;
      case '!webcam':
        changeScene("webcam");
        break;
      default:
        break;
    }
	});
};