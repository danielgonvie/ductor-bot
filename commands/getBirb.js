const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('birb')
		.setDescription('Birb!'),
	async execute(interaction) {

		fetch('https://api.alexflipnote.dev/birb')
			.then(res => res.json())
			.then(async res => {
				await interaction.reply({ embeds:[new EmbedBuilder().setColor('DarkGold').setImage(res.file)] });
			});

	},
};