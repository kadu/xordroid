const parseColor = require('./commons/parsecolor');
const chalk      = require('chalk');
const logs       = require('./commons/log');
const CP_LuzCenario = 'e830937d-05c7-4fa0-911a-fcb4f5ed272f';

exports.default = async (client, obs, mqtt, messages) => {
  client.on("raw_message", async (messageCloned, message) => {
    if(message.tags && message.tags['custom-reward-id']) {
      logs.logs('Custom TAG', message.tags['custom-reward-id'], message.tags['display-name']);
      if(message.tags['custom-reward-id'] === CP_LuzCenario) {
        let sendcolor = await parseColor.parseColor(message.params[1]);
        if(sendcolor !== -1) {
          mqtt.publish("cmnd/lightrgb02/Color2", sendcolor);
          logs.logs('Luz Cenário', chalk.hex(sendcolor).inverse(sendcolor), message.tags.username);
        }
      }
    }
  });
};