const parseColor = require('./commons/parsecolor');
const mongoose = require('mongoose');

const CP_RecompensaTeste = '8c6749f7-9c70-477e-9081-5840ee39033e';
const CP_LuzCenario = 'e830937d-05c7-4fa0-911a-fcb4f5ed272f';


const botSchema = new mongoose.Schema({
  userid: String,
  points: Number
});


exports.default = (client, obs, mqtt, messages, botDB) => {
    client.on("raw_message", async (messageCloned, message) => {
      if(message.tags && message.tags['custom-reward-id']) {
        console.log(`Debug - custom-reward-id = ${message.tags['custom-reward-id']}`);

        if(message.tags['custom-reward-id'] === CP_LuzCenario) {
          let sendcolor = await parseColor.parseColor(message.params[1]);
          if(sendcolor !== -1) {
            mqtt.publish("cmnd/lightrgb02/Color2", sendcolor);

            const silence = new botDB({ userid: `${message.tags['username']}`, points: 10 });
            silence.save();

          }
          else {
          }
        }

        if (message.tags['custom-reward-id'] === CP_RecompensaTeste) {
          console.log(`Alguem (${message.tags['user-id']}) pediu uma recompensa `);
        }
      }


    });
};