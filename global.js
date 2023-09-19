const { createAudioPlayer, NoSubscriberBehavior } = require('@discordjs/voice');
module.exports = {
	playlist: [],
	player: createAudioPlayer({
		behaviors: {
			noSubscriber: NoSubscriberBehavior.Play,
		},
	}),
};