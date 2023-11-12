const sqlite3      = require('sqlite3').verbose();
const { response } = require('express');
const sqlite       = require('sqlite');
const chalk        = require('chalk');
const logs         = require('./commons/log');

async function createDB() {
  try {
    db = await sqlite.open({ filename: './databases/xordroid.db', driver: sqlite3.Database });
    await db.run(`CREATE TABLE IF NOT EXISTS sh_so ( id INTEGER PRIMARY KEY AUTOINCREMENT, streamer TEXT NOT NULL UNIQUE, added_by TEXT, added_date DATETIME DEFAULT CURRENT_TIMESTAMP, last_showed DATETIME)`);
    // await db.run(`DROP TABLE sh_so_counter`);
    await db.run(`CREATE TABLE IF NOT EXISTS sh_so_counter (id INTEGER PRIMARY KEY AUTOINCREMENT,	streamer TEXT NOT NULL UNIQUE, count INT NOT NULL DEFAULT 1);`);
    console.log('criando tabelas do sh');
  } catch (error) {
    console.error(error);
  }
};

createDB();

exports.default = (client, obs, mqtt, messages) => {
  let showed = [];

  client.on('message', async (target, context, message, isBot) => {
    if (isBot) return;
    if(context.badges == null)  return;

    if(context.mod == false && context.badges.broadcaster != '1') return;

    let parsedMessage = message.split(" ");

    switch (parsedMessage[0]) {
      case '!add-streamer':
      case '!streamer':
        try {

          if(typeof parsedMessage[1] == 'undefined') return; // forgot to send the streamer
          const streamer = parsedMessage[1].toLowerCase().replace('@','');
          await db.run("INSERT INTO sh_so (streamer, added_by)  VALUES(?,?)", [streamer, context.username]);
          logs.logs('SH SO', `Streamer added `+ chalk.greenBright.bold(`${streamer}`), context.username);
          client.say(client.channels[0], `feito!`);
        } catch (error) {
          const streamer = parsedMessage[1].toLowerCase().replace('@','');
          logs.logs('SH SO', ` Não consegui adicionar `+ chalk.redBright.bold(`${streamer}`) + ` \n\t Motivo: ${error}`, context.username);
          client.say(client.channels[0], `${streamer}, já estava na listinha ;)`);
        }
        break;
      default:
        break;
    }
  });

  client.on('join', async (channel, username, self) => {
    async function shShowed(streamer) {
      const sql = 'SELECT ss.streamer,DATE(ss2.last_showed,"-3 hour") == DATE(CURRENT_TIMESTAMP,"-3 hour") as "showed" FROM sh_so ss LEFT JOIN sh_so ss2 where ss.streamer = ?  AND ss.streamer = ss2.streamer';
      const params = [streamer];
      const result = await db.get(sql, params, (err, row) => {
        if (err) {
          throw err;
        }
      });

      if(typeof result != 'undefined') {
        if(result.showed !== 1) {
          db.run('UPDATE sh_so SET last_showed=CURRENT_TIMESTAMP WHERE streamer=?',[streamer]);
          db.run('INSERT OR REPLACE INTO sh_so_counter (id, streamer, count) VALUES ((select id from sh_so_counter where streamer = ?), ?, (select count from sh_so_counter where streamer = ?)+1)',[streamer, streamer, streamer])
          return false;
        }
      }
      return true;
    }

    const mustShowStreamer = await shShowed(username);
    if(!mustShowStreamer) {
      messages.push(`Ola ${username}!`);
      client.say(client.channels[0], `!sh-so @${username}`);
      logs.logs('SH SO', `@${username}` , '');
    }
  });
};