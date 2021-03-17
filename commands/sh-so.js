exports.default = (client, obs, mqtt, messages) => {
  let showed = [];

  client.on('join', (channel, username, self) => {
    return;
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
    'princess_league',
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
    'carol_de_abreu',
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
    'devnelson_',
    'guina_o_artesao',
    'tairritadotio',
    'indice_do_conhecimento',
    'vitorbgs',
    '8bitstore',
    'vitthin',
    'cabracast',
    'johnsjohnshell',
    'filipesvieira',
    'dmaneiro88',
    'player_dbr',
    'purplepizza92',
    'punkdodevops',
    'canaldodrogs',
    'bug_elseif',
    'jeylab_robotica',
    'thiagohofmeister',
    'mercuriogurgel',
    'sampaioleal',
    'aquelenoia',
    'grandedev',
    'wesleycsj',
    'mr_eng_tails',
    'jnthas',
    'rattones',
    'adielseffrin',
    'grumpy_lele',
    'boirods',
    'guiolopes',
    'vcwild',
    'dunossauro'
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

