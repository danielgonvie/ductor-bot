const { SlashCommandBuilder } = require('discord.js');
const { playlist, player } = require('../global');

const { joinVoiceChannel, createAudioResource, VoiceConnectionStatus, AudioPlayerStatus, voice } = require('@discordjs/voice');
const play = require('play-dl');

let isPlaying = false;
let myTimer;


// Function to delete the timer
function deleteTimer() {
	if (myTimer) {
		clearTimeout(myTimer); // Cancel the timer
		console.log('Timer deleted.');
	}
	else {
		console.log('No timer to delete.');
	}
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
	deleteTimer();
});
player.on(AudioPlayerStatus.Buffering, () => {
	console.log('audio buffering');
	deleteTimer();
});

player.on(AudioPlayerStatus.AutoPaused, () => {
	console.log('audio autopaused');
	deleteTimer();
});


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

		if (!interaction.member.voice.channel.id) {
			return await interaction.reply({
				ephemeral: true,
				content: 'Tienes que estar unido a un canal de voz para poder usar ese comando.',
			});
		}

		const connection = joinVoiceChannel({
			channelId: interaction.member.voice.channel.id,
			guildId: `${interaction.guildId}`,
			adapterCreator: interaction.guild.voiceAdapterCreator,
		});


		connection.on(VoiceConnectionStatus.Disconnected, () => {
			player.stop();
		});

		await interaction.reply('Searching for the song...');

		const yt_info = await play.search(interaction.options._hoistedOptions[0].value, {
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
			deleteTimer();
			myTimer = setTimeout(() => {
				connection.disconnect();
			}, (yt_info[0].durationInSec * 1000) + 60000);
		}
		else {
			interaction.editReply(' **OOPS!** Youtube playlist and shorts are not supported yet, try again with just the song');
		}


	},
};