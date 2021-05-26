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
let gameStartTime;
let sql;

function getMinutesBetweenDates(startDate, endDate) {
  var diff = endDate.getTime() - startDate.getTime();
  return (diff / 60000);
}

async function inicia_forca(client, obs, mqtt, messages, commandQueue, ttsQueue, send) {
  const checkOpenGame = await hasOpenedHangmanGame();
  if(!checkOpenGame) {
    isGameFinished = false;
    let dbreturn = await db.run("INSERT INTO hangman_games (finish_date) values ((DATETIME(CURRENT_TIMESTAMP, '+6 minutes')))");
    console.log(`dbreturn ${dbreturn}`);
    console.dir(dbreturn);
    const result = await db.get("SELECT ID FROM hangman_games hg2 WHERE finish_date BETWEEN DATETIME(CURRENT_TIMESTAMP, '+3 MINUTES') AND DATETIME(CURRENT_TIMESTAMP, '+8 MINUTES') AND hg2.winner IS NULL", [], (err, row) => {
      if(err) {
        return console.log(err);
      }
    });

    if(typeof result != 'undefined') {
      client.say("kaduzius", "O jogo está iniciado, digita !participar para entrar no jogo! (Chat, vocês tem 1 minuto pra entrar)");

      setTimeout(() => {
        client.say("kaduzius","Que começem os jogos! - Exemplo: !letra a");
      }, 60000);

      gameID = result.id;
      gameStartTime = new Date();
      console.log(`depois dbreturn - gameID ${gameID}`);
    }

    hangword = await getWord();
    displayText = '#'.repeat(hangword.length);

    significado = await getTip(hangword);
    if(significado.length > 0) {
      client.say("kaduzius", `Dica: ${hangmanTip}`);
    }
    else {
      client.say("kaduzius", `Dica: Essa palavra não tem dica KKKK kappa`);
    }

    mqtt.publish("homie/ledmatrix/message/state", "Idle");
    mqtt.publish("homie/ledmatrix/message/fixmessage/set", displayText);
  }
  else {
    client.say("kaduzius","Existe um jogo aberto, manda um !participar e jogue você tambem");
  }
}

function randomInt(min, max) {
	return min + Math.floor((max - min) * Math.random());
}

var replaceAt = function(index, replacement, word) {
  return word.substr(0, index) + replacement + word.substr(index + replacement.length);
}

async function hasOpenedHangmanGame() {
  sql = "select * FROM hangman_games hg2 WHERE finish_date BETWEEN DATETIME(CURRENT_TIMESTAMP, '+3 MINUTES') AND DATETIME(CURRENT_TIMESTAMP, '+8 MINUTES') AND hg2.winner IS NULL";
  const result = await db.get(sql, [], (err, row) => {
    if(err) {
      return console.log(err);
    }
  });

  if(typeof result != 'undefined') {
    gameID = result.id;
    return true;
  } else {
    return false;
  }
}

async function endGame(gameID) {
  console.log(gameID);
  sql = "UPDATE hangman_games SET winner = 'OK' where id = ?";
  let retorno = await db.run(sql,[gameID]);
  console.log(retorno);
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

  if(value.length < 9) {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  } else {
    console.log(`Too long ${value}\n`);
    return await getWord();
  }
}

async function getTip(word) {
  const url = dicPalavra.replace("#", word);
  significado = await getJSON(url);
  if(significado.length > 0) {
    hangmanTip = significado[0].xml.replace(/(<([^>]+)>)/gi, "").replace(/(\r\n|\n|\r)/gm, " ");
    hangmanTip = hangmanTip.toLowerCase().trim();

    let replacer = new RegExp(word, 'g');
    hangmanTip = hangmanTip.replace(replacer,"#".repeat(word.length));

    replacer = new RegExp("\\(.+\\) *$", 'g');
    hangmanTip = hangmanTip.replace(replacer,'');

  } else {
    console.log(`DEU ERRO => ${word}`);
    return "";
  }

  return hangmanTip;
}


exports.default = (client, obs, mqtt, messages, commandQueue, ttsQueue, send) => {
    client.on('message', async (target, context, message, isBot) => {
        if (isBot) return;

        const parsedMessage = message.split(" ");
        switch (parsedMessage[0]) {
          case '!dica':
            hangmanTip = await getTip(hangword);
            if(hangmanTip.length > 0) {
              client.say(target, `Dica: ${hangmanTip}`);
            }
            else {
              client.say(target, `Dica: Essa palavra não tem dica KKKK kappa`);
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
              if(getMinutesBetweenDates(gameStartTime, new Date()) < 1) {
                client.say(target, `Ainda faltam alguns segundos pro jogo começar!`);
                return;
              }

              console.log(`@${context.username} vidas ${result.lives}  gameID ${gameID}`);
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
                // sql = "UPDATE hangman_games SET winner = 'OK' where id = ?";
                // await db.run(sql,[gameID]);
                endGame(gameID);

                client.say(target, `Parabéns CHAT \\o/, a palavra foi revelada!`);
                gameID = 0;
                sound.play(`${__dirname}\\audio\\forca\\vitoria0${randomInt(1,7)}.mp3`)
                  .then((response) => {})
                  .catch((error) => {
                    console.error(error);
                  });
              }
            }
            break;
          case '!lives':
          case '!vidas':
            sql = "SELECT lives from hangman_players where hangman_gameid = ? AND twitch_account = ?";
            // const result = await db.get(sql, [gameID, context.username], (err, row) => {
            //   if(err) {
            //     return console.log(err);
            //   }
            // });

            // if(typeof result != 'undefined') {
            //   if(result.lives === 0) {
            //     client.say(target,`@${context.username}, você tem ${result.lives} vidas`);
            //     return;
            //   }
            // } else {
            //   client.say(target,`Sem jogo ativo @${context.username}`);
            // }
            break;
          case '!participar':
            if(gameID === 0) return

            if(getMinutesBetweenDates(gameStartTime, new Date()) > 1) {
              client.say(target, `@${context.username} o jogo já começou, vai ter que ficar para o próximo :/`);
              return;
            }


            sql = `INSERT INTO hangman_players (hangman_gameid, twitch_account) values (${gameID},"${context.username}")`;
            await db.run(sql);
            // calcular tempo para por nos segundos
            client.say(target, `@${context.username} você está participando do jogo, que vai começar daqui X segundos.`);
            break;
          case '!hangman':
          case '!forca':
            inicia_forca(client, obs, mqtt, messages, commandQueue, ttsQueue, send);
          case '!fimforca':
            if(context.username !== 'kaduzius') return;
            endGame(gameID);
            break;
          default:
              break;
        }
    });
};

