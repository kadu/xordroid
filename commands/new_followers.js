const changeScenes = require("./changeScenes");
const sound = require("play-sound")(opts = {});

function randomInt(min, max) {
  return min + Math.floor((max - min) * Math.random());
}

exports.default = (client, obs, mqtt, messages) => {
  client.on('message', async (target, context, message, isBot) => {
    if (isBot) return;

    var thing = this;
    thing.client = client;
    thing.obs = obs;
    thing.mqtt = mqtt;
    thing.currentScene = await changeScenes.getCurrentScene(obs);


    if (context.username.search(/streamelements/i) >= 0) {
      var sendedBy = message.substring(17, message.length - 1);

      if (message.search("Valeu por seguir") >= 0) {
        client.say(client.channels[0], `Valeu @${sendedBy} pelo follow, vou até soltar uns rojões!`);
        mqtt.publish("wled/158690", "ON");
        mqtt.publish("wled/158690/api", "FX=90");
        messages.push(`Valeu ae @${sendedBy}`);
        sound.play(`${__dirname}/audio/rojoes/firework0${randomInt(1,4)}.wav`, function (err) {
          if (err) throw err
        });
        thing.currentScene = await changeScenes.getCurrentScene(obs);
        console.log(thing.currentScene);
        changeScenes.change(client, obs, mqtt, "webcam");
        try {
          setTimeout(() => {
            mqtt.publish("wled/158690/api", "FX=91");
            console.log("DENTRO thing.currentScene = ", thing.currentScene);
            changeScenes.change(thing.client, thing.obs, thing.mqtt, thing.currentScene);
          }, 16000);
        } catch (error) {
          console.log("Erro no settimeout", error);
        }
      }
    }
  });
};