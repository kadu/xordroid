const changeScenes = require("./changeScenes");

exports.default = (client, obs, mqtt) => {
  client.on('message', (target, context, message, isBot) => {
      if (isBot) return;

      //changeScenes.change(client, obs, mqtt, "proto");

      if(context.username == "streamlabs") {
        var sendedBy = message.substring(24, message.length-1);
        if(message.substring(0,23) == "Thank you for following") {
          client.say(client.channels[0], `Valeu @${sendedBy} pelo follow, vou até soltar uns rojões!`);
          mqtt.publish("wled/158690", "ON");
          mqtt.publish("wled/158690/api", "FX=90&SN=1");
          //const saveScene = currentScene;
          //changeScene("webcam");
          changeScenes.change(client, obs, mqtt, "webcam");
          // try {
          //   setTimeout(()=> {
          //     mqtt.publish("wled/158690", "OFF");
          //     //changeScene(saveScene);
          //     changeScenes.change(client, obs, mqtt, saveScene);
          //   },10000);
          // } catch (error) {
          //   console.log("Erro no settimeout", error);
          // }
        }
      }
  });
};