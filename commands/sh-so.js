exports.default = (client, obs, mqtt, messages) => {
  let showed = [];

  client.on('join', (channel, username, self) => {
    let streamers = [
    'daniel_dev',
    'kaduzius',
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
    'stormgirlbr'

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

