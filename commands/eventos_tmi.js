const changeScenes = require("./changeScenes");

exports.default = (client, obs, mqtt, messages) => {
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
    // mqtt.publish("xordroid/message", led_message);
    messages.push(led_message);
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
      `Nossa, tem ${~~viewers} chegando, ta chovendo gente aqui!`,
      20000);
  });

  client.on("cheer", (channel, userstate, message) => {
    eventsMessage(40,
      `Olha lá, recebendo um cheer (eu nem sei direito o que é isso), foram ${userstate.bits}`,
      `Valeu pelos bits!`);
  });

  // client.on("anongiftpaidupgrade", (channel, username, userstate) => {
  //   eventsMessage(40,
  //     `Valeu ae ${username} por continuar o sub ;)`,
  //     `Valeu pelo sub!`);
  // });

  // client.on("giftpaidupgrade", (channel, username, sender, userstate) => {
  //   eventsMessage(40,
  //     `Ae ${sender} eu e o ${username} agradecemos pelo sub! ;)`,
  //     `Valeu ${sender} e ${username}!`);
  // });

  client.on("hosted", (channel, username, viewers, autohost) => {
    eventsMessage(40,
      `Obrigado ${username} pelo host! (${viewers}) ;)`,
      `Valeu ${username}!`);
  });

  client.on("resub", (channel, username, months, message, userstate, methods) => {
    // Do your stuff.
    let cumulativeMonths = ~~userstate["msg-param-cumulative-months"];
    eventsMessage(40,
      `Obrigado ${username} pelo ReSUB. Já são ${cumulativeMonths} meses, só agradece ;)`,
      `Valeu ${username}!`);
  });

  // client.on("subgift", (channel, username, streakMonths, recipient, methods, userstate) => {
  //   // Do your stuff.
  //   let winner = userstate["msg-param-recipient-display-name"];

  //   eventsMessage(40,
  //     `Obrigado ${username} pelo subGift, que isso em ${winner} só alegria!`,
  //     `Valeu ${username} e bem vindo aos subs ${winner}`);
  // });

  // client.on("submysterygift", (channel, username, numbOfSubs, methods, userstate) => {
  //   // Do your stuff.
  //   let senderCount = ~~userstate["msg-param-sender-count"];

  //   eventsMessage(40,
  //     `Obrigado ${username} pelo submysterygift!`,
  //     `Valeu ${username}!!`);
  // });

  // client.on("join", (channel, username, self) => {
  //   // mqtt.publish("xordroid/message", `X9: ${username}`);
  //   // messages.push(`X9: ${username}`);
  // });

  // client.on("part", (channel, username, self) => {
  //   mqtt.publish("xordroid/message", `Dedoduro: Tchau ${username}`);
  // });

  // client.on("raw_message", (messageCloned, message) => {
  //   console.log(message.raw);
  // });
};

