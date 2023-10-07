const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { playlist } = require('../global');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('list')
		.setDescription('Check the current playlist'),
	async execute(interaction) {
		const exampleEmbed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setDescription('This is the current playlist:');
		if (playlist.length == 0) {
			await interaction.reply('The playlist is empty. Write **/play** to add songs!');
		}
		else {
			playlist.forEach((song, idx) => exampleEmbed.addFields({ name: `#${(idx + 1).toString()} -> ${song.name}`, value: `Requested by ${song.requestedBy}` }));
			await interaction.reply({ embeds: [exampleEmbed] });

		}
		// playlist.lenght <= 0 ? interaction.reply('The playlist is empty. Write /play to add songs!') : playlist.map(song => interaction.reply(`${song}`));
	},
};