// const chalk  = require('chalk');
const logs = require('./commons/log');
let jogadas = [];
let numerosJogados = [];
let tabuleiro = [1,2,3,4,5,6,7,8,9];
let simboloJogado = true; // true == X | false == O

function debugs() {
  console.log('jogadas', jogadas);
  console.log('numerosJogados', numerosJogados);
  console.log('tabuleiro', tabuleiro);
}

function resetaVelha(mqtt) {
  //resetar variaveis
  jogadas = [];
  numerosJogados = [];
  tabuleiro = [1,2,3,4,5,6,7,8,9];
  simboloJogado = true;

  setTimeout(() => {
    mqtt.publish("velha/comandos", "1"); // limpar display
  }, 1000);

  setTimeout(() => {
    mqtt.publish("velha/tabuleiro", "123456789");
  }, 2000);
  debugs();
}

exports.default = (client, obs, mqtt, messages, commandQueue, ttsQueue, send) => {
    client.on('message', (target, context, message, isBot) => {
        if (isBot) return;
        const parsedMessage = message.split(" ");
        if(parsedMessage[0] == '!limpavelha') {
          resetaVelha(mqtt);
        }
        if(parsedMessage[0] !== '!velha') return;


        // Verifica se o numero está entre 1 e 9
        const numero = parseInt(parsedMessage[1]);
        if(isNaN(numero) || (numero < 1 || numero > 9)) {
          client.say(
            target,
            `Ei ${context.username}, você deve mandar um !velha X, onde X é um número de 1 a 9`,
          );

          return;
        }

        // verifica se o ultimo jogador está tentando jogar novamente
        const lastPlayer = jogadas[jogadas.length-1];
        if(lastPlayer === context.username) {
          client.say(
            target,
            `Mano ${context.username}, você não pode jogar "sozinho"!`
          );
          return;
        }

        // Verifica se o numero já foi jogado
        if(numerosJogados.includes(numero)) {
          client.say(
            target,
            `Jovem ${context.username}, esse numero já foi!`
          );
          return;
        }

        // Apartir desse ponto, a jogada é valida
        let payload = `${numero.toString()};${simboloJogado? 'X' : 'O'}`;
        tabuleiro[numero-1] = simboloJogado? 'X' : 'O';
        mqtt.publish("velha/numero", payload);
        var sTabulerio = "";
        tabuleiro.forEach((elemento, i) => {
          sTabulerio += elemento;
        });
        console.log('STABULEIRO => ', sTabulerio);
        mqtt.publish("velha/tabuleiro", sTabulerio);
        // console.log('Payload enviado',payload);
        simboloJogado = !simboloJogado;
        jogadas.push(context.username);
        numerosJogados.push(numero);

        debugs();

        // verifica se deu VELHA!
        alguemGanhou = ((tabuleiro[0] === tabuleiro[1] && tabuleiro[1] == tabuleiro[2]) ||
          (tabuleiro[3] === tabuleiro[4] && tabuleiro[4] == tabuleiro[5]) ||
          (tabuleiro[6] === tabuleiro[7] && tabuleiro[7] == tabuleiro[8]) ||
          (tabuleiro[0] === tabuleiro[3] && tabuleiro[3] == tabuleiro[6]) ||
          (tabuleiro[1] === tabuleiro[4] && tabuleiro[4] == tabuleiro[7]) ||
          (tabuleiro[2] === tabuleiro[5] && tabuleiro[5] == tabuleiro[8]) ||
          (tabuleiro[0] === tabuleiro[4] && tabuleiro[4] == tabuleiro[8]) ||
          (tabuleiro[2] === tabuleiro[4] && tabuleiro[4] == tabuleiro[6]))

        if(alguemGanhou) {
          client.say (
            target,
            `Parabéns galera do ${simboloJogado? 'O' : 'X'}, vocês ganharam`
          );
          setTimeout(() => {
            resetaVelha(mqtt); //resetar variaveis
          }, 4000);
        } else if (numerosJogados.length === 9) { // Verifica empate
          client.say (
            target,
            `Não acho que quem ganhar ou quem perder, nem quem ganhar nem perder, vai ganhar ou perder. Vai todo mundo perder. :D`
          );
          setTimeout(() => {
            resetaVelha(mqtt); //resetar variaveis
          }, 4000);
        }
    });
};

