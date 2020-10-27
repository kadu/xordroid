const changeScenes = require("./changeScenes");

exports.default = (client, obs, mqtt) => {
  client.on('message', (target, context, message, isBot) => {
      if (isBot) return;

      //changeScenes.change(client, obs, mqtt, "proto");
      var thing = this;
      thing.client = client;
      thing.obs = obs;
      thing.mqtt = mqtt;
      thing.currentScene = changeScenes.getCurrentScene();

      if(context.username == "streamlabs") {
        var sendedBy = message.substring(24, message.length-1);
        if(message.substring(0,23) == "Thank you for following") {
          client.say(client.channels[0], `Valeu @${sendedBy} pelo follow, vou até soltar uns rojões!`);
          mqtt.publish("wled/158690", "ON");
          mqtt.publish("wled/158690/api", "FX=90&SN=1");
          mqtt.publish("xordroid/weather/message", `Valeu ae @${sendedBy}`);
          changeScenes.change(client, obs, mqtt, "webcam");
          try {
            setTimeout(()=> {
              mqtt.publish("wled/158690", "OFF");
              console.log("DENTRO thing.currentScene = ", thing.currentScene);
              changeScenes.change(thing.client, thing.obs, thing.mqtt, thing.currentScene);
            },10000);
          } catch (error) {
            console.log("Erro no settimeout", error);
          }
        }
        if(message.substring(0,28) == "just raided the channel with") {
          console.log("DENTRO");
          mqtt.publish("wled/158690", "ON");
          mqtt.publish("wled/158690/api", "FX=66&SN=1");
          client.say(client.channels[0], `Valeu pela RAID, Sejam todos bem vindos, vou até ascender uma fogueira maneira pra gente curtir juntos \o/`);
        }
      }
  });
};