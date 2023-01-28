const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

const { joinVoiceChannel, getVoiceConnections } = require('@discordjs/voice');
const youtubedl = require('youtube-dl-exec');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Plays some music on current channel you are on')
		.setDescriptionLocalizations({
			'es-ES': 'Ponga una rolita!',
		})
		.addStringOption(query =>
			query.setName('youtube-url')
				.setDescription('The youtube-url you want to play')
				.setDescriptionLocalizations({
					'es-ES': 'El link de youtube majete :D',
				})
				.setRequired(true)),
	async execute(interaction) {
		await interaction.reply('Searching for the song...');
		console.log('----->', interaction.options._hoistedOptions[0].value);
		youtubedl(interaction.options._hoistedOptions[0].value, {
			dumpSingleJson: true,
			noCheckCertificates: true,
			noWarnings: true,
			preferFreeFormats: true,
			addHeader: [
				'referer:youtube.com',
				'user-agent:googlebot',
			],
		}).then(output => {
			return interaction.editReply(`${output.fulltitle} -> **Added to queue!**`);
		});

	},
};