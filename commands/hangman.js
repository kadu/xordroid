// const { response } = require('express');
const sqlite3         = require('sqlite3').verbose();
const sqlite          = require('sqlite');
const bent            = require('bent');
const getJSON         = bent('json');
const jsdom           = require("jsdom");
const { JSDOM }       = jsdom;
const logs            = require('./commons/log');
const sound           = require("play-sound")(opts = {});
const dicionario      = "https://www.palabrasaleatorias.com";
const dicionarioURI   = "/palavras-aleatorias.php?fs=1&fs2=0&Submit=Nova+palavra";
const dicPalavra      = "https://api.dicionario-aberto.net/word/#/1";
const CP_Forca        = '72cbe921-36bc-4134-9f50-c488a21587c0';
const dotenv          = require('dotenv');
let gameID            = 0;
let hangword          = "";
let displayText       = "";
let hangmanTip        = "";
let isGameFinished    = true;
let gameStartTime;
let sql;
let gameTimer;
const [TWITCH_CHANNEL_NAME] = process.env.CHANNEL_NAME.split(',');

function matrixFixMessage(mqtt, message, updateStete = true) {
  if(updateStete) {
    mqtt.publish("homie/ledmatrix/message/state", "Idle");
  }
  mqtt.publish("homie/ledmatrix/message/fixmessage/set", message);
}

async function finalizarForca(id, client) {
  const result = await db.get("SELECT * FROM hangman_games hg2 WHERE hg2.id = ?", [id], (err, row) => {
    if(err) {
      return console.log(err);
    }
  });

  if(typeof result != 'undefined') {
    endGame(id);
    client.say(TWITCH_CHANNEL_NAME, `O jogo finalizou e infelizmente o Chat Perdeu :( - A palavra era ${hangword}`);
  }
}

function map( x,  in_min,  in_max,  out_min,  out_max){
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function getMinutesBetweenDates(startDate, endDate) {
  var diff = endDate.getTime() - startDate.getTime();
  return (diff / 60000);
}

async function inicia_forca(client, obs, mqtt, messages, commandQueue, ttsQueue, send) {
  const checkOpenGame = await hasOpenedHangmanGame();
  if(!checkOpenGame) {
    isGameFinished = false;
    let dbreturn = await db.run("INSERT INTO hangman_games (finish_date) values ((DATETIME(CURRENT_TIMESTAMP, '+6 minutes')))");
    const result = await db.get("SELECT ID FROM hangman_games hg2 WHERE finish_date BETWEEN DATETIME(CURRENT_TIMESTAMP, '+3 MINUTES') AND DATETIME(CURRENT_TIMESTAMP, '+8 MINUTES') AND hg2.winner IS NULL", [], (err, row) => {
      if(err) {
        return console.log(err);
      }
    });

    if(typeof result != 'undefined') {
      client.say(TWITCH_CHANNEL_NAME, "O jogo está iniciado, digita !participar para entrar no jogo! (Chat, vocês tem 1 minuto pra entrar)");

      setTimeout(() => {
        client.say(TWITCH_CHANNEL_NAME,"Que começem os jogos! - Exemplo: !letra a");
        logs.logs('Hangman', 'Jogo iniciado', '');
      }, 60000);

      gameID = result.id;
      gameStartTime = new Date();

      gameTimer = setTimeout(() => {
        finalizarForca(gameID, client);
      }, 5*60000);

    }

    hangword = await getWord();
    displayText = '#'.repeat(hangword.length);

    significado = await getTip(hangword);
    if(significado.length > 0) {
      client.say(TWITCH_CHANNEL_NAME, `Dica: ${hangmanTip}`);
    }
    else {
      client.say(TWITCH_CHANNEL_NAME, `Dica: Essa palavra não tem dica KKKK kappa`);
      logs.logs('Hangman', `Palavra sem dica ${hangword}`,'');
    }
    matrixFixMessage(mqtt, displayText);
  }
  else {
    client.say(TWITCH_CHANNEL_NAME,"Existe um jogo aberto, manda um !participar e jogue você tambem");
  }
  logs.logs('Hangman', 'inicia_forca()', '');
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
  clearTimeout(gameTimer);
  console.log(retorno);
  logs.logs('Hangman', 'Fim de jogo', '');
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
          logs.logs('Hangman', parsedMessage[0], context.username);
          break;
        case '!letra':
          logs.logs('Hangman', parsedMessage[0], context.username);
          if(isGameFinished) {
            client.say(target, `Poxa, a palavra já foi descoberta`);
            return;
          }


          sql = "select sum(lives) as totallives from hangman_players hp where hp.hangman_gameid  = ?"
          const result0 = await db.get(sql, [gameID], (err, row) => {
            if(err) {
              return console.log(err);
            }
          });

          if(typeof result0 != 'undefined') {
            if((result0.totallives) === 0) {
              client.say(target, "Oxi, Só tem zumbi por aqui! Se quiser, comece outro jogo mandando !forca");
              endGame(gameID);
              return;
            }
          }


          // get users lives
          sql = "SELECT lives from hangman_players where hangman_gameid = ? AND twitch_account = ?";
          const result = await db.get(sql, [gameID, context.username], (err, row) => {
            if(err) {
              return console.log(err);
            }
          });

          if(typeof result != 'undefined') {
            let pastTime = getMinutesBetweenDates(gameStartTime, new Date());
            let secs = Math.ceil(map(pastTime, 0,1,60,0));
            if(pastTime < 1) {
              client.say(target, `Ainda faltam ${secs} segundos pro jogo começar!`);
              return;
            }

            console.log(`@${context.username} vidas ${result.lives}  gameID ${gameID}`);
            if(result.lives === 0) {
              client.say(target,`@${context.username}, morto não fala, nunca mais! :P`);
              return;
            }
          } else {
            client.say(target,`@${context.username}, para participar você precisa digitar !participar`);
            return;
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
            matrixFixMessage(mqtt, displayText);
            client.say(target, `Forca -> ${displayText}`);

            if(displayText == hangword) {
              isGameFinished = true;
              // sql = "UPDATE hangman_games SET winner = 'OK' where id = ?";
              // await db.run(sql,[gameID]);
              endGame(gameID);

              client.say(target, `Parabéns CHAT \\o/, a palavra era -> TwitchLit ${hangword} CurseLit`);
              setTimeout(() => {
                messages.push("\\o/ Parabens CHAT");
              }, 2000);
              gameID = 0;
              sound.play(`${__dirname}/audio/forca/vitoria0${randomInt(1,7)}.mp3`, function(err){
                if (err) throw err
              });
            }
          }
          break;
        case '!participar':
          if(gameID === 0) return
          logs.logs('Hangman', parsedMessage[0], context.username);

          let pastTime = getMinutesBetweenDates(gameStartTime, new Date());
          if(pastTime > 1) {
            client.say(target, `@${context.username} o jogo já começou, vai ter que ficar para o próximo :/`);
            return;
          }

          sql = `INSERT INTO hangman_players (hangman_gameid, twitch_account) values (${gameID},"${context.username}")`;
          await db.run(sql);
          // calcular tempo para por nos segundos
          let secs = Math.ceil(map(pastTime, 0,1,60,0));
          client.say(target, `@${context.username} você está participando do jogo, que vai começar daqui ${secs} segundos.`);
          break;
        case '!hangman':
        case '!forca':
          logs.logs('Hangman', parsedMessage[0], context.username);
          inicia_forca(client, obs, mqtt, messages, commandQueue, ttsQueue, send);
          break;
        case '!fimforca':
          if(context.username !== 'kaduzius') return;
          client.say(target, `Jogo finalizado a força pelo @kaduzius`);
          messages.push('Jogo finalizado a forca');
          endGame(gameID);
          break;
        default:
            break;
      }
  });

  mqtt.on('message',async function (topic, message) {
    if((topic.toString() == 'homie/ledmatrix/message/state') && (message.toString() == "Idle")) {
      if(gameID > 0) {
        matrixFixMessage(mqtt,displayText, false);
      }
    }
  });

  client.on("raw_message", async (messageCloned, message) => {
    if(message.tags['custom-reward-id'] === CP_Forca) {
      inicia_forca(client, obs, mqtt, messages, commandQueue, ttsQueue, send);
    }
  });
};