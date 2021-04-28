// const { response } = require('express');
const sqlite3         = require('sqlite3').verbose();
const sqlite          = require('sqlite');
const bent            = require('bent');
const getJSON         = bent('json');
const jsdom           = require("jsdom");
const { JSDOM }       = jsdom;

const sound           = require("sound-play");
const dicionario      = "https://www.palabrasaleatorias.com";
const dicionarioURI   = "/palavras-aleatorias.php?fs=1&fs2=0&Submit=Nova+palavra";
const dicPalavra      = "https://api.dicionario-aberto.net/word/#/1";
let gameID            = 0;
let hangword          = "";
let displayText       = "";
let hangmanTip        = "";
let isGameFinished    = true;

function randomInt(min, max) {
	return min + Math.floor((max - min) * Math.random());
}

var replaceAt = function(index, replacement, word) {
  return word.substr(0, index) + replacement + word.substr(index + replacement.length);
}

function hasOpenedHangmanGame() {
  //select * FROM hangman_games hg2 WHERE finish_date BETWEEN DATETIME(CURRENT_TIMESTAMP, "+3 MINUTES") AND DATETIME(CURRENT_TIMESTAMP, "+8 MINUTES")
  return false;
}

class HangManGame {

  startNewGame() { // !forca
  }

  joinGame() { // !participar
  }

  guess() { // !letra
  }

  hint() { // !dica
  }


}






async function createDB() {
  try {
    db = await sqlite.open({ filename: './databases/xordroid.db', driver: sqlite3.Database });
    await db.run(`CREATE TABLE IF NOT EXISTS hangman_games (id INTEGER PRIMARY KEY AUTOINCREMENT, start_date DATETIME DEFAULT CURRENT_TIMESTAMP, finish_date DATETIME, winner TEXT)`);
    await db.run(`CREATE TABLE IF NOT EXISTS hangman_players ( id INTEGER PRIMARY KEY AUTOINCREMENT, hangman_gameid INTEGER, twitch_account TEXT, lives DEFAULT 5)`);
  } catch (error) {
    console.error(error);
  }
};

createDB();

async function getWord() {
  const getStream = bent(dicionario);
  let stream = await getStream(dicionarioURI);
  const str = await stream.text();
  const dom = new JSDOM(str);
  value = dom.window.document.querySelector('body > center > center > table:nth-child(4) > tbody > tr > td > div').textContent.trim().toLocaleLowerCase();
  console.log(value);

  if(value.length < 10) {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  } else {
    console.log(`Too long\n`);
    return await getWord();
  }
}


exports.default = (client, obs, mqtt, messages, commandQueue, ttsQueue, send) => {
    client.on('message', async (target, context, message, isBot) => {
        if (isBot) return;
        let sql;

        const parsedMessage = message.split(" ");
        switch (parsedMessage[0]) {
          case '!dica':
            if(hangmanTip.length > 0) {
              client.say(target, `Dica: ${hangmanTip}`);
            }
            break;
          case '!letra':
            if(isGameFinished) {
              client.say(target, `Poxa, a palavra já foi descoberta`);
              return;
            }

            // get users lives
            sql = "SELECT lives from hangman_players where hangman_gameid = ? AND twitch_account = ?";
            const result = await db.get(sql, [gameID, context.username], (err, row) => {
              if(err) {
                return console.log(err);
              }
            });

            if(typeof result != 'undefined') {
              if(result.lives === 0) {
                client.say(target,`@${context.username}, morto não fala, nunca mais! :P`);
                return;
              }
            } else {
              client.say(target,`@${context.username}, para participar você precisa digitar !participar`);
            }


            wordToSearch = String(parsedMessage[1]).toLowerCase();
            if(hangword.indexOf(wordToSearch) == -1) {
              // tira ponto
              sql = "UPDATE hangman_players SET lives = lives - 1 where hangman_gameid = ? AND twitch_account = ?";
              await db.run(sql,[gameID, context.username]);
              if(result.lives-1 == 0 ) {
                client.say(target,`@${context.username}, você morreu!`);
              } else {
                client.say(target,`@${context.username}, errou e agora só resta ${result.lives-1} vidas`);
              }

            } else {
              client.say(target,`@${context.username}, bom palpite`);
              for (let index = 0; index < hangword.length; index++) {
                if(hangword.charAt(index) == wordToSearch) {
                  displayText =replaceAt(index, wordToSearch, displayText);
                }
              }
              mqtt.publish("homie/ledmatrix/message/state", "Idle");
              mqtt.publish("homie/ledmatrix/message/fixmessage/set", displayText);

              if(displayText == hangword) {
                isGameFinished = true;
                client.say(target, `Parabéns CHAT \\o/, a palavra foi revelada!`);
                sound.play(`${__dirname}\\audio\\forca\\vitoria0${randomInt(1,7)}.mp3`)
                  .then((response) => {})
                  .catch((error) => {
                    console.error(error);
                  });
              }
            }
            break;
          case '!participar':
            if(gameID === 0) return
            sql = `INSERT INTO hangman_players (hangman_gameid, twitch_account) values (${gameID},"${context.username}")`;
            await db.run(sql);
            // calcular tempo para por nos segundos
            client.say(target, `@${context.username} você está participando do jogo, que vai começar daqui X segundos.`);
            break;
          case '!hangman':
          case '!forca':
            if(!hasOpenedHangmanGame()) {
              isGameFinished = false;
              await db.run("INSERT INTO hangman_games (finish_date) values ((DATETIME(CURRENT_TIMESTAMP, '+6 minutes')))");
              const result = await db.get("SELECT ID FROM hangman_games hg2 WHERE finish_date BETWEEN DATETIME(CURRENT_TIMESTAMP, '+3 MINUTES') AND DATETIME(CURRENT_TIMESTAMP, '+8 MINUTES')", [], (err, row) => {
                if(err) {
                  return console.log(err);
                }
              });

              if(typeof result != 'undefined') {
                client.say(target, "O jogo está iniciado, digita !participar para entrar no jogo! (Chat, vocês tem 1 minuto pra entrar)");
                gameID = result.id;
              }

              hangword = await getWord();
              displayText = '#'.repeat(hangword.length);

              const url = dicPalavra.replace("#", hangword);
              significado = await getJSON(url);
              try {

                if(significado[0] !== undefined ) {
                  hangmanTip = significado[0].xml.replace(/(<([^>]+)>)/gi, "").replace(/(\r\n|\n|\r)/gm, " ");
                  hangmanTip = hangmanTip.toLowerCase();
                  hangmanTip = hangmanTip.replace(hangword,"#".repeat(hangword.length));
                  client.say(target, `Dica: ${hangmanTip}`);
                }
              } catch (error) {
                console.log(`DEU ERRO => ${hangword}`);
                client.say(target, `Dica: Essa palavra não tem dica KKKK kappa`);
              }

              mqtt.publish("homie/ledmatrix/message/state", "Idle");
              mqtt.publish("homie/ledmatrix/message/fixmessage/set", displayText);
            }

          // check if was game in progress
          // if not, insert o DB a new game, with correct start and stop date, control de timer (overlay in live)
            break;
          case '!palavra':
              hangword = await getWord();
              client.say(
                  target,
                  `só um teste... básico! ${hangword} `,
              );
              break;
            default:
                break;
        }
    });
};

