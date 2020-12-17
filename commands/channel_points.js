const CP_RecompensaTeste = '8c6749f7-9c70-477e-9081-5840ee39033e';

exports.default = (client, obs, mqtt, messages) => {
    client.on("raw_message", (messageCloned, message) => {
      if (message.tags && message.tags['custom-reward-id'] === CP_RecompensaTeste) {
        console.log(`Alguem (${message.tags['user-id']}) pediu uma recompensa `);
      }
    });
};