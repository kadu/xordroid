const changeScenes = require("./changeScenes");
const sound = require("sound-play");

function randomInt(min, max) {
	return min + Math.floor((max - min) * Math.random());
}

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
          sound.play(`commands/audio/rojoes/firework0${randomInt(1,4)}.wav`).then((response) => {
          }).catch((error) => {
            console.error(error);
          });
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