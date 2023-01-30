const { SlashCommandBuilder } = require('discord.js');

const { joinVoiceChannel, createAudioPlayer, createAudioResource, StreamType, VoiceConnectionStatus, AudioPlayerStatus } = require('@discordjs/voice');
const youtubedl = require('youtube-dl-exec');
const play = require('play-dl');
const player = createAudioPlayer();
const playlist = [];
let isPlaying = false;


module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Plays some music on current channel you are on')
		.setDescriptionLocalizations({
			'es-ES': 'Ponga una rolita!',
		})
		.addStringOption(query =>
			query.setName('youtube-song')
				.setDescription('The youtube-url you want to play or name of the song')
				.setDescriptionLocalizations({
					'es-ES': 'Añade el link o el nombre de la canción',
				})
				.setRequired(true)),
	async execute(interaction) {
		const voiceChannel = '615207602493718613';
		console.log(interaction, 'INTERACTION');
		const connection = joinVoiceChannel({
			channelId: voiceChannel,
			guildId: `${interaction.guildId}`,
			adapterCreator: interaction.guild.voiceAdapterCreator,
		});
		const subscription = connection.subscribe(player);
		await interaction.reply('Searching for the song...');

		connection.on('stateChange', (oldState, newState) => {
			console.log(`Connection transitioned from ${oldState.status} to ${newState.status}`);
		});
		connection.on(VoiceConnectionStatus.Disconnected, () => {
			console.log('The connection has entered the Diconected state!');
			player.stop();
			connection.disconnect();
		});

		connection.on(VoiceConnectionStatus.Destroyed, () => {
			console.log('The connection has entered the Destroyed state!');
			player.stop();
			connection.disconnect();
		});

		connection.on(VoiceConnectionStatus.Ready, () => {
			console.log('entra aqui', playlist);
		});

		player.on('error', error => {
			console.error('Error:', error.message, 'with track', error.resource.metadata.title);
		});

		player.on(AudioPlayerStatus.Idle, () => {
			console.log('audio mas ready que la mojama');
			console.log(playlist, 'en el idle??');
			// playlist.shift();
			isPlaying = false;

			console.log('aqui ponemos el siguiente', playlist);
			// player.play(playlist[1]);
		});

		player.on(AudioPlayerStatus.Playing, () => {
			console.log('audio playing');
			isPlaying = true;

		});
		player.on(AudioPlayerStatus.Paused, () => {
			console.log('audio pausaoo');

		});
		player.on(AudioPlayerStatus.Buffering, () => {
			console.log('audio buffering');

		});

		player.on(AudioPlayerStatus.AutoPaused, () => {
			console.log('audio autopaused');

		});
		// console.log('----->', interaction.options._hoistedOptions[0].value);

		console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<', interaction.options._hoistedOptions[0].value);
		// if (interaction.options._hoistedOptions[0].value.includes('http')) {
		// 	// NEW METHOD WORKING PROPERLY
		// 	const stream = await play.stream(interaction.options._hoistedOptions[0].value);
		// 	const resource = createAudioResource(stream.stream, {
		// 		inputType: stream.type,
		// 	});
		// 	player.play(resource);
		// }
		// else {
		const yt_info = await play.search(interaction.options._hoistedOptions[0].value, {
			limit: 1,
		});
		console.log('>>>>>>>>>>>>>>>>>>>>>>>>>', yt_info);
		const stream = await play.stream(yt_info[0].url);
		const resource = createAudioResource(stream.stream, {
			inputType: stream.type,
		});
		// playlist.push(resource);
		// isPlaying ? console.log(playlist, 'añadido a la queue') : player.play(playlist[0]);
		// }
		player.play(resource);
		interaction.editReply(` ${yt_info[0].title} (${yt_info[0].durationRaw}) -> **Added to queue! There are ${playlist.length} songs on queue NOT WORKING**`);

		// interaction.editReply(`${output.fulltitle} (${output.duration}) -> **Added to queue! There are ${playlist.length} songs on queue**`);

		// 	// console.log(output.requested_formats[1].url);
		// 	// TRYING PLAYLIST METHOD
		// 	// playlist.push(createAudioResource(stream.stream, {
		// 	// 	inputType: stream.type,
		// 	// }));
		// 	// isPlaying ? console.log(playlist, 'añadido a la queue') : player.play(playlist[0]);


	},
};