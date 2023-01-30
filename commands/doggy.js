const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('doge')
		.setDescription('O doguinho!'),
	async execute(interaction) {

		fetch('https://api.alexflipnote.dev/dogs')
			.then(res => res.json())
			.then(async res => {
				console.log(res);
				await interaction.reply({ embeds:[new EmbedBuilder().setColor('Aqua').setImage(res.file)] });
			});

	},
};