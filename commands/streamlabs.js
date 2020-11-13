const changeScenes = require("./changeScenes");

exports.default = (client, obs, mqtt, messages) => {
  client.on('message', (target, context, message, isBot) => {
      if (isBot) return;

      var thing = this;
      thing.client = client;
      thing.obs = obs;
      thing.mqtt = mqtt;
      thing.currentScene = changeScenes.getCurrentScene();

      if(context.username == "streamlabs") {
        console.log("**** STREAMLABS MESSAGE ****");
        console.log(message);
        console.log("****************************");

        var sendedBy = message.substring(24, message.length-1);
        if(message.substring(0,23) == "Thank you for following") {
          client.say(client.channels[0], `Valeu @${sendedBy} pelo follow, vou até soltar uns rojões!`);
          mqtt.publish("wled/158690", "ON");
          mqtt.publish("wled/158690/api", "FX=90&SN=1");
          messages.push(`Valeu ae @${sendedBy}`);
          changeScenes.change(client, obs, mqtt, "webcam");
          try {
            setTimeout(()=> {
              mqtt.publish("wled/158690/api", "FX=91&SN=1");
              console.log("DENTRO thing.currentScene = ", thing.currentScene);
              changeScenes.change(thing.client, thing.obs, thing.mqtt, thing.currentScene);
            },16000);
          } catch (error) {
            console.log("Erro no settimeout", error);
          }
        }
      }
  });
};