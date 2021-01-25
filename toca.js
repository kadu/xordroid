var player = require('play-sound')(opts = {})


player.play('sample1.mp3', function(err){
  if (err) throw err
});