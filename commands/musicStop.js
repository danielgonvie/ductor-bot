const { SlashCommandBuilder } = require('discord.js');
const { playlist, player } = require('../global');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stops the music and clear the playlist!'),
	async execute(interaction) {
		player.stop();
		playlist.splice(0, playlist.length);
		await interaction.reply('You have stopped the music and cleared the playlist!');
	},
};