var player = require('play-sound')(opts = {})

function randomInt(min, max) {
	return min + Math.floor((max - min) * Math.random());
}

exports.default = (client, obs, mqtt, messages) => {
    client.on('message', (target, context, message, isBot) => {
        if (isBot) return;

        switch (message) {
            case '!toca':
                player.play(`commands/audio/rojoes/firework0${randomInt(1,4)}.wav`, function(err){
                  if (err) throw err
                });
                client.say(
                    target,
                    `só um teste... básico!`,
                );
                break;
            default:
                break;
        }
    });
};

