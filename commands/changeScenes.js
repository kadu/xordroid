// /*
// function changeScene(client, obs, mqtt) {
//   if(!["Esquerda + Protobord", "FullScreen", "Esquerda + Webcam"].includes(currentScene)) {
//     if(currentScene == "Obrigado") {
//       client.say(client.channels[0], "Valeu por acompanhar a live! Até a próxima e para de querer xeretar!");
//     } else if(currentScene == "Ja volto") {
//       client.say(client.channels[0], "Eu estou aqui, mas não posso fazer isso agora ;)");
//     } else if(currentScene == "Abertura") {
//       client.say(client.channels[0], "Calma, já vamos começar! Apressado!!!");
//     } else {
//       client.say(client.channels[0], "Putz, não consigo mudar a cena agora, o @Kaduzius deve ter feito alguma meleca!");
//     }
//     return;
//   }

//   let newScene;

//   if(Scene == "proto") {
//     newScene = "Esquerda + Protobord";
//   }

//   if(Scene == "webcam") {
//     newScene = "FullScreen";
//   }

//   if(Scene == "tela") {
//     newScene = "Esquerda + Webcam";
//   }

//   try {
//     obs.send('SetCurrentScene', {
//       'scene-name': newScene
//     });
//   } catch (error) {
//     console.log("erro no setcurrentschene", error);
//   }
// }

// exports.default = changeScene;
// */

// exports.default = (client, obs, mqtt) => {
//   /*
//   function change(scene) {
//     console.log(scene);
//   }
//   */
//   /*
//   change : (Scene) => {
//     console.log("vai planeta ", Scene);
//   }
//   */
// };

let currentScene;
let obsIsConnected;

module.exports = {
  default: function (client, obs, mqtt) {

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

  change: function (client, obs, mqtt, scene) {
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

    if(scene == "proto") {
      newScene = "Esquerda + Protobord";
    }

    if(scene == "webcam") {
      newScene = "FullScreen";
    }

    if(scene == "tela") {
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

}
