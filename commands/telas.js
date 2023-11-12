const changeScenes = require("./changeScenes");
const logs = require('./commons/log');
const fs = require('fs');
let windowsIP;

try {
  const data = fs.readFileSync('/etc/resolv.conf', 'utf8');
  let cortado = data.split(" ");
  windowsIP = cortado[cortado.length - 1]
} catch (err) {
  console.error(err)
}

exports.default = (client, obs, mqtt, messages) => {
  let currentScene;
  let obsIsConnected;
  let OBSFaultMessage = false;

  function obsConnection() {

    obs.connect('ws://192.168.11.160:4455')
      .then(() => {
        obsIsConnected = true;
        console.log("Finalmente, conectado no OBS");
        OBSFaultMessage = false;
      })
      .catch(error => {
        var dt = new Date();
        // console.log('Erro OBS:> ', error);

        if (!OBSFaultMessage) {
          console.log("[" + dt.getHours() + ":" + dt.getMinutes() + "] Nao conseguiu conectar no OBS");
          OBSFaultMessage = true;
        }
      });
  }

  client.on('connected', (address, port) => {
    obsConnection();
  });

  obs.on('SwitchScenes', data => {
    currentScene = data.sceneName;
    console.log('Cena Atual ', currentScene);
  });

  obs.on("ConnectionClosed", (data) => {
    obsIsConnected = false;
    // mqtt.publish("xordroid/weather/off", "");
    // mqtt.publish("wled/158690", "OFF");
    setTimeout(obsConnection, 60000);
  });

  obs.on("ConnectionOpened", (data) => {
    if (!obsIsConnected) {
      obsIsConnected = true;
      obs.call('GetCurrentScene')
        .then(data => {
          currentScene = data.name;
          // console.log("Cena atual ", currentScene);
        })
        .catch(() => {
          console.log("Algo aconteceu aqui!");
        });
    }
  });

  client.on('message', (target, context, message, isBot) => {
    if (isBot) return;
    if (OBSFaultMessage) {
      logs.logs('Telas', 'Não está conectado ao OBS (websocket)', '');
      return;
    }

    switch (message) {
      case '!tela':
      case '!screen':
        changeScenes.change(client, obs, mqtt, "tela");
        break;
      case '!cam2':
      case '!proto':
      case '!protoboard':
      case '!breadboard':
        changeScenes.change(client, obs, mqtt, "proto");
        break;
      case '!webcam':
        changeScenes.change(client, obs, mqtt, "webcam");
        break;
      case '!soldagem':
      case '!solda':
        changeScenes.change(client, obs, mqtt, "solda");
        break;
      case '!3D':
      case '!3d':
        changeScenes.change(client, obs, mqtt, "3d");
        break;
      case '!obs':
        changeScenes.getCurrentScene(obs);
        break;
      default:
        break;
    }
  });
};