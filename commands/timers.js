var CronJob = require('cron').CronJob;

exports.default = (client, obs, mqtt, messages, commandQueue, ttsQueue, send) => {
  var job = new CronJob('45 * * * *', () => {
    client.say('#kaduzius','!cafe');
  }, null, true, 'America/Sao_Paulo');

  job.start();
};