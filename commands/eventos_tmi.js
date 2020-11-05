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
    if(effect == 100) {
      mqtt.publish("wled/158690/col", "#FF0000");
    }
    mqtt.publish("wled/158690/api", `FX=${effect}&SN=1`);
    mqtt.publish("xordroid/message", led_message);
    setTimeout(()=> {
      mqtt.publish("wled/158690", "OFF");
      changeScenes.change(thing.client, thing.obs, thing.mqtt, thing.currentScene);
    },timeoutTimer);
  }

  client.on('subscription', (channel, username, method, message, userstate) => {
    eventsMessage(66,
      `Ae @${username}, valeu muitão pelo SUB, o coração até para!!! Tks`,
      `a Live agradece @${username}`,
      20000);
  });

  client.on("raided", (channel, username, viewers) => {
    console.log(channel);
    eventsMessage(57,
      `Recebendo uma super raid do pessoal da live @${username}, valeu pela raid e sejam todos bem vindos!) `,
      `Nossa, tem ${viewers} chegando, ta chovendo gente aqui!`,
      20000);
  });

  client.on("cheer", (channel, userstate, message) => {
    eventsMessage(40,
      `Olha lá, recebendo um cheer (eu nem sei direito o que é isso), foram ${userstate.bits}`,
      `Valeu pelos bits!`);
  });

  client.on("join", (channel, username, self) => {
    mqtt.publish("xordroid/message", `Dedoduro: Bem vindo ${username}`);
  });

  client.on("part", (channel, username, self) => {
    mqtt.publish("xordroid/message", `Dedoduro: Tchau ${username}`);
  });

  // client.on("raw_message", (messageCloned, message) => {
  //   console.log(message.raw);
  // });
};

