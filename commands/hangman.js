// const { response } = require('express');
const sqlite3 = require('sqlite3').verbose();
const sqlite = require('sqlite');
const bent = require('bent');
const getJSON = bent('json');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const logs = require('./commons/log');
const sound = require("play-sound")(opts = {});
const dicionario = "https://www.palabrasaleatorias.com";
const dicionarioURI = "/?fs=1&fs2=0&Submit=Nova+palavra";
const dicPalavra = "https://api.dicionario-aberto.net/word/#/1";
const CP_Forca = '72cbe921-36bc-4134-9f50-c488a21587c0';
const CP_5Vidas = 'cdac53f8-937f-44c3-9d0c-43ef8e25506f'
const dotenv = require('dotenv');
let gameID = 0;
let hangword = "";
let displayText = "";
let hangmanTip = "";
let letrasErradas = [];
let isGameFinished = false;
let gameStartTime;
let sql;

const [TWITCH_CHANNEL_NAME] = process.env.CHANNEL_NAME.split(',');

function matrixFixMessage(mqtt, message, updateStete = true) {
  if (updateStete) {
    mqtt.publish("homie/ledmatrix/message/state", "Idle");
  }
  mqtt.publish("homie/ledmatrix/message/fixmessage/set", message);
}

async function mostraVidas(username, client) {
  const result = await db.get(`SELECT SUM(lives) as vidas FROM hangman_lives WHERE twitch_account  = '${username.toLowerCase()}'`, [], (err, row) => {
    if (err) {
      return console.log(err);
    }
  });

  let totalVidas;

  if (typeof result != 'undefined') {
    totalVidas = result.vidas;
  }

  client.say(TWITCH_CHANNEL_NAME, `@${username} você tem ${totalVidas} vidas no seu inventário`);
}


async function resgataVidas(userid, vidas, client) {
  let dbreturn = await db.run(`INSERT INTO hangman_lives (twitch_account, lives) values ('${userid.toLowerCase()}', ${vidas})`);
  mostraVidas(userid, client);
}



function map(x, in_min, in_max, out_min, out_max) {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function getMinutesBetweenDates(startDate, endDate) {
  var diff = endDate.getTime() - startDate.getTime();
  return (diff / 60000);
}

async function inicia_forca(client, obs, mqtt, messages, commandQueue, ttsQueue, send) {
  const checkOpenGame = await hasOpenedHangmanGame();
  if (!checkOpenGame) {
    isGameFinished = false;
    let dbreturn = await db.run("INSERT INTO hangman_games (finish_date) values ((DATETIME(CURRENT_TIMESTAMP, '+6 minutes')))");
    const result = await db.get("SELECT ID FROM hangman_games hg2 WHERE finish_date BETWEEN DATETIME(CURRENT_TIMESTAMP, '+3 MINUTES') AND DATETIME(CURRENT_TIMESTAMP, '+8 MINUTES') AND hg2.winner IS NULL", [], (err, row) => {
      if (err) {
        return console.log(err);
      }
    });

    if (typeof result != 'undefined') {
      // client.say(TWITCH_CHANNEL_NAME, "O jogo está iniciado, digita !participar para entrar no jogo! (Chat, vocês tem 1 minuto pra entrar)");

      client.say(TWITCH_CHANNEL_NAME, "Jogo iniciado, para jogar tente o comando: !letra a");
      logs.logs('Hangman', 'Jogo iniciado', '');
      letrasErradas = [];

      gameID = result.id;
      gameStartTime = new Date();
    }

    hangword = await getWord();
    displayText = '#'.repeat(hangword.length);

    significado = await getTip(hangword);
    if (significado.length > 0) {
      client.say(TWITCH_CHANNEL_NAME, `Dica: ${hangmanTip}`);
    }
    else {
      client.say(TWITCH_CHANNEL_NAME, `Dica: Essa palavra não tem dica KKKK kappa`);
      logs.logs('Hangman', `Palavra sem dica ${hangword}`, '');
    }
    matrixFixMessage(mqtt, displayText);
  }
  else {
    client.say(TWITCH_CHANNEL_NAME, "Existe um jogo aberto, só mandar uma letra com o comando: !letra a");
  }
  logs.logs('Hangman', 'inicia_forca()', '');
}

function randomInt(min, max) {
  return min + Math.floor((max - min) * Math.random());
}

var replaceAt = function (index, replacement, word) {
  return word.substr(0, index) + replacement + word.substr(index + replacement.length);
}

async function hasOpenedHangmanGame() {
  sql = "select * FROM hangman_games hg2 WHERE finish_date BETWEEN DATETIME(CURRENT_TIMESTAMP, '+3 MINUTES') AND DATETIME(CURRENT_TIMESTAMP, '+8 MINUTES') AND hg2.winner IS NULL";
  const result = await db.get(sql, [], (err, row) => {
    if (err) {
      return console.log(err);
    }
  });

  if (typeof result != 'undefined') {
    gameID = result.id;
    return true;
  } else {
    return false;
  }
}

async function endGame(gameID) {
  console.log(gameID);
  sql = "UPDATE hangman_games SET winner = 'OK' where id = ?";
  let retorno = await db.run(sql, [gameID]);
  console.log(retorno);
  logs.logs('Hangman', 'Fim de jogo', '');
}

async function createDB() {
  try {
    db = await sqlite.open({ filename: './databases/xordroid.db', driver: sqlite3.Database });
    await db.run(`CREATE TABLE IF NOT EXISTS hangman_games (id INTEGER PRIMARY KEY AUTOINCREMENT, start_date DATETIME DEFAULT CURRENT_TIMESTAMP, finish_date DATETIME, winner TEXT)`);
    await db.run(`CREATE TABLE IF NOT EXISTS hangman_players ( id INTEGER PRIMARY KEY AUTOINCREMENT, hangman_gameid INTEGER, twitch_account TEXT, lives DEFAULT 5)`);
    await db.run(`CREATE TABLE IF NOT EXISTS hangman_lives ( id INTEGER PRIMARY KEY AUTOINCREMENT, twitch_account TEXT, lives DEFAULT 0)`);
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

  if (value.length < 9) {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  } else {
    console.log(`Too long ${value}\n`);
    return await getWord();
  }
}

async function getTip(word) {
  const url = dicPalavra.replace("#", word);
  significado = await getJSON(url);
  if (significado.length > 0) {
    hangmanTip = significado[0].xml.replace(/(<([^>]+)>)/gi, "").replace(/(\r\n|\n|\r)/gm, " ");
    hangmanTip = hangmanTip.toLowerCase().trim();

    let replacer = new RegExp(word, 'g');
    hangmanTip = hangmanTip.replace(replacer, "#".repeat(word.length));

    replacer = new RegExp("\\(.+\\) *$", 'g');
    hangmanTip = hangmanTip.replace(replacer, '');

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
        if (hangmanTip.length > 0) {
          client.say(target, `Dica: ${hangmanTip}`);
        }
        else {
          client.say(target, `Dica: Essa palavra não tem dica KKKK kappa`);
        }
        logs.logs('Hangman', parsedMessage[0], context.username);
        break;
      case '!letra':
        logs.logs('Hangman', parsedMessage[0], context.username);
        if (isGameFinished) {
          client.say(target, `Poxa, a palavra já foi descoberta, começe um novo jogo com o comando !forca`);
          return;
        }

        sql = "select sum(lives) as totallives from hangman_lives where twitch_account = ?"
        const result0 = await db.get(sql, [context.username], (err, row) => {
          if (err) {
            return console.log(err);
          }
        });

        if (typeof result0 != 'undefined') {
          if ((result0.totallives) <= 0) {
            client.say(target, `Suas vidas acabaram ${context.username}, compre mais vidas com os pontos de recompensa do canal (Forca - 5 vidas) para continuar jogando!`);
            // endGame(gameID);
            return;
          }
        }

        wordToSearch = String(parsedMessage[1]).toLowerCase();
        if (hangword.indexOf(wordToSearch) == -1) {
          // tira ponto
          sql = "INSERT INTO hangman_lives (twitch_account, lives) values (? , -1)";
          await db.run(sql, [context.username]);
          if (result0.totallives - 1 <= 0) {
            client.say(target, `@${context.username}, você morreu!`);
            return;
          } else {
            if (!letrasErradas.includes(wordToSearch)) {
              letrasErradas.push(wordToSearch);
            }
            client.say(target, `@${context.username}, errou e agora só resta ${result0.totallives - 1} vidas`);
          }

        } else {
          client.say(target, `@${context.username}, bom palpite, e te restam ${result0.totallives - 1} vidas`);
          for (let index = 0; index < hangword.length; index++) {
            if (hangword.charAt(index) == wordToSearch) {
              displayText = replaceAt(index, wordToSearch, displayText);
            }
          }
          matrixFixMessage(mqtt, displayText);
          client.say(target, `Forca -> ${displayText}`);

          if (displayText == hangword) {
            isGameFinished = true;
            // sql = "UPDATE hangman_games SET winner = 'OK' where id = ?";
            // await db.run(sql,[gameID]);
            endGame(gameID);

            client.say(target, `Parabéns CHAT \\o/, a palavra era -> TwitchLit ${hangword} CurseLit`);
            setTimeout(() => {
              messages.push("\\o/ Parabens CHAT");
            }, 2000);
            gameID = 0;
            sound.play(`${__dirname}/audio/forca/vitoria0${randomInt(1, 7)}.mp3`, function (err) {
              if (err) throw err
            });
          }
        }
        break;
      case '!hangman':
      case '!forca':
        logs.logs('Hangman', parsedMessage[0], context.username);
        inicia_forca(client, obs, mqtt, messages, commandQueue, ttsQueue, send);
        break;
      case '!fimforca':
        if (context.username !== 'kaduzius') return;
        client.say(target, `Jogo finalizado a força pelo @kaduzius`);
        messages.push('Jogo finalizado a forca');
        endGame(gameID);
        break;
      case '!vida':
      case '!vidas':
        mostraVidas(context.username, client);
        break;
      case '!erro':
      case '!erros':
        let resultado = '';
        letrasErradas.forEach((val) => {
          resultado = `${resultado}${val} `;
        });
        client.say(TWITCH_CHANNEL_NAME, `Letras já erradas: ${resultado}`);
        break;
      default:
        break;
    }
  });

  mqtt.on('message', async function (topic, message) {
    if ((topic.toString() == 'homie/ledmatrix/message/state') && (message.toString() == "Idle")) {
      if (gameID > 0) {
        matrixFixMessage(mqtt, displayText, false);
      }
    }
  });

  client.on("raw_message", async (messageCloned, message) => {
    if (message.tags['custom-reward-id'] === CP_Forca) {
      inicia_forca(client, obs, mqtt, messages, commandQueue, ttsQueue, send);
    }
    switch (message.tags['custom-reward-id']) {
      case CP_Forca:
        inicia_forca(client, obs, mqtt, messages, commandQueue, ttsQueue, send);
        break;
      case CP_5Vidas:
        resgataVidas(message.tags['display-name'], 5, client);
        break;
      default:
        break;
    }
  });
};