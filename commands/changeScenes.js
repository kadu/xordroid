let currentScene;
let obsIsConnected = false;

async function _getCurrentScene(obs) {
  data = await obs.send('GetCurrentScene');
  currentScene = data.name;
}

module.exports = {
  default(client, obs, mqtt, messages) {
    obs.on('SwitchScenes', data => {
      currentScene = data.sceneName;
    });

    obs.on("ConnectionOpened", (data) => {
      if(obsIsConnected) {
        obsIsConnected = true;
        obs.send('GetCurrentScene')
          .then(data => {
            currentScene = data.name;
            console.log("Cena atual ", currentScene);
          })
          .catch(() => {
            console.log("Algo aconteceu aqui!");
          });
      }
    });
  },

  async getCurrentScene(obs) {
    await _getCurrentScene(obs);
    return currentScene;
  },

  async change(client, obs, mqtt, scene) {
    await _getCurrentScene(obs);
    if(!["Esquerda + Protobord", "FullScreen", "Esquerda + Webcam", "Soldagem", "Impressora3D"].includes(currentScene)) {
      return;
    }

    let newScene;
    if(scene == "proto" || scene == "Esquerda + Protobord") {
      newScene = "Esquerda + Protobord";
    }

    if(scene == "webcam" || scene == "FullScreen") {
      newScene = "FullScreen";
    }

    if(scene == "tela" || scene == "Esquerda + Webcam" ) {
      newScene = "Esquerda + Webcam";
    }

    if(scene == "solda" || scene == "Soldagem") {
      newScene = "Soldagem";
    }

    if(scene == "3d" || scene == "Impressora3D") {
      newScene = "Impressora3D";
    }

    obs.send('SetCurrentScene', {
      'scene-name': newScene
    }).catch(error => {
      console.log("*ChangeScenes* erro no setcurrentschene", error);
    });

  }
}
