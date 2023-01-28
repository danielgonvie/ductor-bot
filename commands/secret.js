const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('secret')
		.setDescription('Only you can see the answer!'),
	async execute(interaction) {
		await interaction.reply({ content: 'uwu', ephemeral: true });
	},
};