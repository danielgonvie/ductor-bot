const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('yo')
		.setDescription('Yo le pregunte!'),
	async execute(interaction) {

		await interaction.reply('https://www.youtube.com/watch?v=ipBzR5URrBE');
	},
};