
exports.default = (client, obs, mqtt, messages) => {
    client.on('message', async (target, context, message, isBot) => {
        if (isBot) return;

        switch (message) {
            case '!mongotest':
                client.say(
                    target,
                    `Valeu por testar o mongoDB!`,
                );

                // const silence = new botDB({ userid: 'To na mongoTest', points: 10 });
                // console.log("******************");
                // console.log(silence.userid); // 'Silence'
                // console.log("******************");
                // silence.save();
                break;

            case '!getmongo':
              // let x = await botDB.find({"userid" : "Silence 17"}).exec();
              // console.log(x[0]._doc.userid);

              break;
            default:
                break;
        }
    });
};

