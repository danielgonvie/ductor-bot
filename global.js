const { createAudioPlayer } = require('@discordjs/voice');

module.exports = {
  playlist: [],
  player: createAudioPlayer(),
};