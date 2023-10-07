const { SlashCommandBuilder } = require('discord.js');
const { playlist, player } = require('../global');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('next')
		.setDescription('Skips to the next song!'),
	async execute(interaction) {
		playlist.shift();

		if (playlist.length > 0) {
			player.play(playlist[0].audioSource);
			await interaction.reply('Playing next song!');
		}
		else {
			player.stop();
			await interaction.reply('The are no songs left! 🤷‍♂️');
		}

	},
};