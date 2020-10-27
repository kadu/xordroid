const changeScenes = require("./changeScenes");

exports.default = (client, obs, mqtt) => {
  var thing = this;
      thing.client = client;
      thing.obs = obs;
      thing.mqtt = mqtt;
      thing.currentScene = changeScenes.getCurrentScene();

  function eventsMessage(effect, chat_message, led_message, timeoutTimer) {
    client.say(thing.client.channels[0], chat_message);
    mqtt.publish("wled/158690", "ON");
    mqtt.publish("wled/158690/api", `FX=${effect}&SN=1`);
    mqtt.publish("xordroid/weather/message", led_message);
    setTimeout(()=> {
      mqtt.publish("wled/158690", "OFF");
      changeScenes.change(thing.client, thing.obs, thing.mqtt, thing.currentScene);
    },timeoutTimer);
  }

  client.on('subscription', (channel, username, method, message, userstate) => {
    eventsMessage(100,
      `Ae @${username}, valeu muitão pelo SUB, o coração até para!!! Tks`,
      `a Live agradece @${username}`,
      20000);
  });

  client.on("raided", (channel, username, viewers) => {
    eventsMessage(100,
      `Estamos recebendo uma super raid do pessoal da live => @${username}, valeu pela raid e sejam todos bem vindos (${viewers} viewers!) `,
      `Ei você que veio da live  @${username}, seja bem vindo!`,
      20000);
  });

  // client.on("raw_message", (messageCloned, message) => {
  //   console.log(message.raw);
  // });
};

