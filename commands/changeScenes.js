let currentScene;
let obsIsConnected;

module.exports = {
  default: function (client, obs, mqtt, messages) {
    obs.on('SwitchScenes', data => {
      currentScene = data.sceneName;
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
  },

  getCurrentScene: function() {
    return currentScene;
  },

  change: function (client, obs, mqtt, scene) {
    if(!["Esquerda + Protobord", "FullScreen", "Esquerda + Webcam"].includes(currentScene)) {
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

    obs.send('SetCurrentScene', {
      'scene-name': newScene
    }).catch(error => {
      console.log("*ChangeScenes* erro no setcurrentschene", error);
    });

  }

}
