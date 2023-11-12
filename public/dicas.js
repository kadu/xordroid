const tempoMostrando = 30; // segundos

let files = [
  'imagens/overcomandos/comando_3d.png',
  'imagens/overcomandos/comando_baba.png',
  'imagens/overcomandos/comando_campainha.png',
  'imagens/overcomandos/comando_chuck.png',
  'imagens/overcomandos/comando_comandos.png',
  'imagens/overcomandos/comando_discord.png',
  'imagens/overcomandos/comando_forca.png',
  'imagens/overcomandos/comando_frase.png',
  'imagens/overcomandos/comando_joke.png',
  'imagens/overcomandos/comando_led.png',
  'imagens/overcomandos/comando_led2.png',
  'imagens/overcomandos/comando_led_cinza_distante.png',
  'imagens/overcomandos/comando_led_cor.png',
  'imagens/overcomandos/comando_led_cor2.png',
  'imagens/overcomandos/comando_led_cor_chocolatevelho.png',
  'imagens/overcomandos/comando_lojinha.png',
  'imagens/overcomandos/comando_piada.png',
  'imagens/overcomandos/comando_pix.png',
  'imagens/overcomandos/comando_porteiro.png',
  'imagens/overcomandos/comando_projetos.png',
  'imagens/overcomandos/comando_proto.png',
  'imagens/overcomandos/comando_quemsoueu.png',
  'imagens/overcomandos/comando_solda.png',
  'imagens/overcomandos/comando_streamdeck.png',
  'imagens/overcomandos/comando_streamdeck2.png',
  'imagens/overcomandos/comando_superdica.png',
  'imagens/overcomandos/comando_tela.png',
  'imagens/overcomandos/comando_timelapse.png',
  'imagens/overcomandos/comando_tiozao.png',
  'imagens/overcomandos/comando_tts.png',
  'imagens/overcomandos/comando_tts_ru.png',
  'imagens/overcomandos/comando_webcam.png',
  'imagens/overcomandos/comando_xordroid.png',
  'imagens/overcomandos/comando_youtube.png',
  'imagens/overcomandos/dica01.png',
  'imagens/overcomandos/dica_prime.png',
  'imagens/overcomandos/use_bytes.png',
];

let mudaoverlay = () => {
  let atual = files[Math.floor(Math.random() * files.length)];
  console.log(atual);

  const list = document.getElementById('dica');
  while (list.hasChildNodes()) {
    list.removeChild(list.firstChild);
  }

  var elem = document.createElement('img');
  elem.setAttribute('src', atual);
  elem.classList.add('fade-in-bottom');
  document.getElementById('dica').appendChild(elem);

  setTimeout(() => {
    console.log('remove');
    elem.classList.remove('fade-in-bottom');
    elem.classList.add('scale-out-ver-top');
  }, tempoMostrando * 1000);

  setTimeout(() => {
    console.log('remove tudo');
    const list = document.getElementById('dica');
    while (list.hasChildNodes()) {
      list.removeChild(list.firstChild);
    }
  }, tempoMostrando + 1000 * 1000);
}


mudaoverlay();

setInterval(() => {
  mudaoverlay();
}, 180000);