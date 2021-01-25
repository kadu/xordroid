exports.default = (client, obs, mqtt, messages) => {
  let showed = [];

  client.on('join', (channel, username, self) => {
    let streamers = [
    'daniel_dev',
    'webmat1',
    'pokemaobr',
    'tearing5',
    'xtecna',
    'dornellestv',
    'henriquevilelamusic',
    'project_juan',
    'pachicodes',
    'mechanicallydev',
    'corujaodev',
    'julialabs',
    'chicocodes',
    'davibusanello',
    'cafecodes',
    'Princess_League',
    'pixlrose',
    'maikemota',
    'jpbrab0',
    'levxyca',
    'chicaocodes',
    'rostyxz',
    'edersondeveloper',
    'zerotoherodev',
    'cabracast',
    'baldengineer',
    'griloviscky',
    'bittoin',
    'canturil',
    'railanepassos',
    'programadorbinario',
    'kastr0walker',
    'stormgirlbr',
    'bgfow',
    'victorzonta',
    'carpa_flamejante',
    'racerxdl',
    'bedabliu',
    'Carol_de_Abreu',
    'arig4m3r',
    'devgiordane',
    'alecams',
    'leitche',
    'paulobeckman',
    'tonhocodes',
    'morgiovanelli',
    'escslabtech',
    'altthabs',
    'wesleylab',
    'torrevorpal',
    'fer2easy',
    'guridarth',
    'rafabandoni',
    'casadodev',
    'xdidadev',
    'profbrunolopes',
    'devNelson_',
    'guina_o_artesao',
    'tairritadotio',
    'indice_do_conhecimento'
  ];

    if(streamers.includes(username)) {
      if(!showed.includes(username)) {
        if(messages.length <= 2) {
          messages.push(`Ola ${username}!`);
          client.say(client.channels[0], `!sh-so @${username}`);
          showed.push(username);
        }
      }
    }
  });
};

