const dotenv    = require('dotenv');
const { get }   = require('request-promise');
const translate = require('translate');
const logs      = require('./commons/log');

dotenv.config();
translate.engine = process.env.TRANSLATE_ENGINE;
translate.key = process.env.TRANSLATE_KEY;
const boredAPIURL = "https://www.boredapi.com/api/activity"

//const translated_color = await translate(cp, { from: 'pt', to: 'en' });

exports.default = (client, obs, mqtt, messages) => {
    client.on('message', async (target, context, message, isBot) => {
        if (isBot) return;

        switch (message) {
            case '!superdica':
            case '!tocansado':
                response = await get(boredAPIURL);
                response = JSON.parse(response);
                const translated = await translate(response.activity, { from: 'en', to: 'pt' });

                client.say(
                    target,
                    `Faça: ${translated} (${response.activity})`,
                );
                logs.logs('Cansado', `Faça: ${translated} (${response.activity})`, context.username);
                break;
            default:
                break;
        }
    });
};

