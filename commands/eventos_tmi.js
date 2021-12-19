const changeScenes = require("./changeScenes");
const sound = require("play-sound")(opts = {});

function randomInt(min, max) {
	return min + Math.floor((max - min) * Math.random());
}

exports.default = (client, obs, mqtt, messages) => {
  var thing = this;
      thing.client = client;
      thing.obs = obs;
      thing.mqtt = mqtt;
      thing.currentScene = changeScenes.getCurrentScene(obs);

  async function eventsMessage(effect, chat_message, led_message, timeoutTimer=20000) {
    thing.currentScene = await changeScenes.getCurrentScene(obs);
    // console.log(`Aqui é ${thing.currentScene}`);
    client.say(thing.client.channels[0], chat_message);
    mqtt.publish("wled/158690", "ON");
    if(effect == 100) {
      mqtt.publish("wled/158690/col", "#FF0000");
    }
    mqtt.publish("wled/158690/api", `FX=${effect}`);
    messages.push(led_message);
    changeScenes.change(thing.client, thing.obs, thing.mqtt, "webcam");
    setTimeout(()=> {
      mqtt.publish("wled/158690/col", "#FFFF00");
      mqtt.publish("wled/158690/api", `FX=80`);
      mqtt.publish("wled/158690", "ON");
      changeScenes.change(thing.client, thing.obs, thing.mqtt, thing.currentScene);
    },timeoutTimer);
  }

  client.on('subscription', (channel, username, method, message, userstate) => {
    eventsMessage(100,
      `Ae @${username}, valeu muitão pelo SUB, o coração até para!!! Tks`,
      `a Live agradece @${username}`,
      20000);
      sound.play(`${__dirname}/audio/coracao/coracao01.wav`, function(err){
        if (err) throw err
      });

  });

  client.on("raided", (channel, username, viewers) => {
    eventsMessage(68,
      `Recebendo uma super raid do pessoal da live @${username}, valeu pela raid e sejam todos bem vindos!) `,
      `Oia a raid, valeu @${username} \\p/`,
      19000);
      sound.play(`${__dirname}/audio/raid/welcome2.mp3`, function(err){
        if (err) throw err
      });
  });

  client.on("cheer", (channel, userstate, message) => {
    eventsMessage(40,
      `Olha lá, recebendo um cheer, foram ${userstate.bits}`,
      `Valeu pelos bits!`
      ,20000);
  });

  client.on("anongiftpaidupgrade", (channel, username, userstate) => {
    eventsMessage(40,
      `Valeu ae ${username} por continuar o sub ;)`,
      `Valeu pelo sub!`
      ,20000);
  });

  client.on("giftpaidupgrade", (channel, username, sender, userstate) => {
    eventsMessage(40,
      `Ae ${sender} eu e o ${username} agradecemos pelo sub! ;)`,
      `Valeu ${sender} e ${username}!`
      ,20000);
  });

  client.on("hosted", (channel, username, viewers, autohost) => {
    eventsMessage(40,
      `Obrigado ${username} pelo host! (${viewers}) ;)`,
      `Valeu ${username}!`
      ,20000);
  });

  client.on("resub", (channel, username, months, message, userstate, methods) => {
    // Do your stuff.
    let cumulativeMonths = ~~userstate["msg-param-cumulative-months"];
    eventsMessage(40,
      `Obrigado ${username} pelo ReSUB. Já são ${cumulativeMonths} meses, só agradece ;)`,
      `Valeu ${username}!`
      ,20000);
  });

  client.on("subgift", (channel, username, streakMonths, recipient, methods, userstate) => {
    // Do your stuff.
    let winner = userstate["msg-param-recipient-display-name"];

    eventsMessage(40,
      `Obrigado ${username} pelo subGift, que isso em ${winner} só alegria!`,
      `Valeu ${username} e bem vindo aos subs ${winner}`
      ,20000);
  });

  client.on("submysterygift", (channel, username, numbOfSubs, methods, userstate) => {
    // Do your stuff.
    let senderCount = ~~userstate["msg-param-sender-count"];

    eventsMessage(40,
      `Obrigado ${username} pelo submysterygift!`,
      `Valeu ${username}!!`
      ,20000);
  });
};

