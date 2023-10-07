const { SlashCommandBuilder } = require('discord.js');
const { playlist, player } = require('../global');

const { joinVoiceChannel, createAudioResource, VoiceConnectionStatus, AudioPlayerStatus } = require('@discordjs/voice');
const play = require('play-dl');

let isPlaying = false;

function parseYoutubeUrl(url) {
	if (url.includes('shorts')) {
		url.replace('shorts/', 'watch?v=');
	}
	const fragments = url.split('&');
	return fragments[0];
}

player.on('error', error => {
	console.error('Error:', error.message, 'with track', error.resource.metadata.title);
});

player.on(AudioPlayerStatus.Idle, async () => {
	playlist.shift();
	isPlaying = false;

	if (playlist.length > 0) {
		player.play(playlist[0].audioSource);
	}

});

player.on(AudioPlayerStatus.Playing, () => {
	console.log('audio playing');
	isPlaying = true;

});
player.on(AudioPlayerStatus.Paused, () => {
	console.log('audio paused');

});
player.on(AudioPlayerStatus.Buffering, () => {
	console.log('audio buffering');

});

player.on(AudioPlayerStatus.AutoPaused, () => {
	console.log('audio autopaused');

});


module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Plays some music on current channel you are on')
		.setDescriptionLocalizations({
			'es-ES': 'Pon música en tu canal actual!',
		})
		.addStringOption(query =>
			query.setName('youtube-song')
				.setDescription('The youtube-url you want to play or name of the song')
				.setDescriptionLocalizations({
					'es-ES': 'Añade el link o el nombre de la canción',
				})
				.setRequired(true)),

	async execute(interaction) {

		// Check if user is in a current voiceChannel
		if (!interaction.member.voice.channel.id) {
			return await interaction.reply({
				ephemeral: true,
				content: 'You must be joined to one channel to use this command.',
			});
		}


		// Connection and feedback to the user
		const connection = joinVoiceChannel({
			channelId: interaction.member.voice.channel.id,
			guildId: `${interaction.guildId}`,
			adapterCreator: interaction.guild.voiceAdapterCreator,
		});

		connection.on(VoiceConnectionStatus.Disconnected, () => {
			player.stop();
		});

		await interaction.reply('Searching for the song...');

		// Logic based on users request
		console.log({ url: interaction.options._hoistedOptions[0].value });
		const query = parseYoutubeUrl(interaction.options._hoistedOptions[0].value);
		console.log({ query });

		const yt_info = await play.search(query, {
			limit: 1,
		});

		if (yt_info.length > 0) {
			const stream = await play.stream(yt_info[0].url);
			playlist.push({ name: yt_info[0].title, audioSource: createAudioResource(stream.stream, {
				inputType: stream.type,
			}), requestedBy: interaction.member.nickname });
			isPlaying ? console.log(playlist, 'añadido a la queue') : player.play(playlist[0].audioSource);
			interaction.editReply(` **${yt_info[0].title}** (${yt_info[0].durationRaw}) -> Added to queue! There are **${playlist.length}** songs on queue`);

			connection.subscribe(player);
		}
		else {
			interaction.editReply(' **OOPS!** Youtube playlist and shorts are not supported yet, try again with just the song');
		}


	},
};