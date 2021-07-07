var CronJob = require('cron').CronJob;
let lastTime = 0;
let lastUser = "";
let numMessages = 0;

exports.default = (client, obs, mqtt, messages, commandQueue, ttsQueue, send) => {
  client.on('message', (target, context, message, isBot) => {
    lastMessage = context["tmi-sent-ts"];
    lastUser = context.username;
    numMessages++;
  });

  // var job = new CronJob('40 * * * *', () => {
  //   if (( Math.floor((new Date() - lastTime)/60000) > 20 ) && (lastUser !== "xordroid" ) && (numMessages > 10)){
  //     client.say('#kaduzius','!cafe');
  //     numMessages = 0;
  //   }
  // }, null, true, 'America/Sao_Paulo');

  job.start();
};