const sqlite3 = require('sqlite3').verbose();
const sqlite = require('sqlite');
const logs = require('./commons/log');
const puppeteer = require("puppeteer");
var db = null;

async function createDB() {
  try {
    db = await sqlite.open({ filename: './databases/xordroid.db', driver: sqlite3.Database });
    await db.run(`CREATE TABLE IF NOT EXISTS piadas ( id INTEGER PRIMARY KEY AUTOINCREMENT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, username TEXT, piada TEXT, ativa INTEGER DEFAULT 0 )`);
  } catch (error) {
    console.error(error);
  }
};

createDB();

exports.default = (client, obs, mqtt, messages, commandQueue, ttsQueue, send, cDiscord) => {

  const pegaPiadas = async (url) => {
    console.log('iniciando navegador');
    const browser = await puppeteer.launch();
    console.log('nova pagina');
    let page = await browser.newPage();
    console.log('vai pra pagina');
    await page.goto(url);
    console.log('terminou de carregar a pagina');

    let html_content = '';
    //.querySelectorAll('.riddle')
    // html_content = await page.evaluate(el => el.innerText, await page.$('.riddle'));

    ///

    ///

    // document.querySelector("#wrapper > p:nth-child(10) > strong")
    // document.querySelector("#hidden-content-0 > div > p");

    // document.querySelector("#wrapper > p:nth-child(12) > strong")
    // document.querySelector("#hidden-content-1 > div > p")

    pergunta = await page.evaluate((el) => {
      console.log('elemento pergunta', el);
    }, await page.$(`#wrapper > p:nth-child(10) > strong`));

    let contador = 0;
    // for (let index = 10; index <= 318; index+=2) {
    //   console.log('dentro do for');
    //   console.log(index);

    //   console.log(`#wrapper > p:nth-child(${index}) > strong`);
    //   pergunta = await page.evaluate((el) => {
    //     console.log('elemento pergunta', el);
    //   }, await page.$(`#wrapper > p:nth-child(${index}) > strong`));

    //   resposta = await page.evaluate((el) => {
    //     console.log('elemento resposta', el);
    //   }, await page.$(`#hidden-content-${contador} > div > p`));
    //   contador++;
    // }


    // html_content = await page.evaluate(() => Array.from(document.querySelectorAll(''), element => [element.textContent]));
    /*
    try {
      let texto = html_content[0][0].trim().replaceAll("  ", "").replace(/(\r\n|\n|\r)/gm, " ");
      // console.log('piadas encontradas =>', texto);
      // await db.run("INSERT INTO piadas (username, piada, ativa)  VALUES(?,?,?)", ['kaduzius', element[0], "kaduzius"]);

      let prometeus = [];
      html_content.forEach(element => {
        let textoEl = element[0].trim().replaceAll("  ", "").replace(/(\r\n|\n|\r)/gm, " ");
        prometeus.push(db.run("INSERT INTO piadas (username, piada, ativa)  VALUES(?,?,?)", ['kaduzius', textoEl, "kaduzius"]));
      });
    } catch (error) {
      console.log(`Deu ruim na pagina => ${url} \n Error => ${error}`);
    }

    console.log('Tudo mandando pro banco');
    */
    return 'OK';
  }

  const numPiadas = async () => {
    let retorno = -1;
    const sql =
    'select COUNT(distinct piada) as piadasAtivas, 0 as piadasModeracao, \'ativa\' as tipo from piadas where ativa = 1'
    ' UNION '
    ' select 0 as piadasAtivas, COUNT(distinct piada) as piadasModeracao, \'moderado\' as tipo from piadas where ativa = 0 ';

    const params = [];
    const result = await db.all(sql, params, (err, row) => {
      if (err) {
        throw err;
      }
    });

    let ativos    = 0;
    let moderados = 0;

    if(typeof result != 'undefined') {
      result.forEach(element => {
        switch (element.tipo) {
          case 'moderado':
            break;
            moderados = element.piadasModeracao;
          case 'ativa':
            ativos = element.piadasAtivas;
            break;
        }
      });
      let retorno = [{
        ativos: ativos,
        moderados: moderados
      }];
      console.log (retorno);
      return retorno;
    }

    return retorno;
  }


    client.on('message', async (target, context, message, isBot) => {
        if (isBot) return;

        const parsedMessage = message.split(" ");

        if(parsedMessage[0] === '!gravapiada') {
          const fullMessage = message.replace("!gravapiada ",""); //.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
          client.say(target, `@${context.username}, será que é boa essa piada ? valeu do help!`);
          await db.run("INSERT INTO piadas (username, piada, ativa)  VALUES(?,?,?)", [context.username, fullMessage, context.username === "kaduzius" ? 1 : 0 ]);
          logs.logs('Nova piada adicionada', fullMessage, context.username);
        }

        if(parsedMessage[0] === '!statuspiada') {
          const piadas = await numPiadas();
          client.say(target, `Hoje temos ${piadas[0].ativos} piadas no banco e algumas (${piadas[0].moderados}) para moderação!`);
        }

        if(parsedMessage[0] === '!pegapiadas') {
          if(context.username === 'kaduzius') {

            pegaPiadas('https://www.todamateria.com.br/adivinhas/');




            //for (let index = 4; index < 34; index++) {


            // let acc = []
            // let inicio = 30;
            // const passo = 4;
            // console.log(`Próximo => ${inicio+passo}`);
            // // acc.push(pegaPiadas(`https://web.archive.org/web/20200812173626/https://www.osvigaristas.com.br/charadas/`));
            // for (let index = inicio; index < 32; index++) {
            //   console.log(`https://web.archive.org/web/20200812173626/https://www.osvigaristas.com.br/charadas/pagina${index}.html`)
            //   acc.push(pegaPiadas(`https://web.archive.org/web/20200812173626/https://www.osvigaristas.com.br/charadas/pagina${index}.html`));
            // }
            // Promise.all(acc).then(result => {
            //   console.log('fim do promisse all', result);
            //   console.log(`Próximo => ${inicio+passo}`);
            // })
            console.log('fim pega piadas');
          }
        }
    });
}

process.on('SIGINT', function() {
  console.log("Caught interrupt signal");
  db.close();
  process.exit();
});