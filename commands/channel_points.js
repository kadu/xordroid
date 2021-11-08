const parseColor = require('./commons/parsecolor');
const CP_LuzCenario = 'e830937d-05c7-4fa0-911a-fcb4f5ed272f';

exports.default = async (client, obs, mqtt, messages) => {
  client.on("raw_message", async (messageCloned, message) => {
    if(message.tags && message.tags['custom-reward-id']) {
      if(message.tags['custom-reward-id'] === CP_LuzCenario) {
        let sendcolor = await parseColor.parseColor(message.params[1]);
        if(sendcolor !== -1) {
          mqtt.publish("cmnd/lightrgb02/Color2", sendcolor);
        }
      }
    }
  });
};