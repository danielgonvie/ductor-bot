const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
module.exports = {
	data: new SlashCommandBuilder()
		.setName('meme')
		.setDescription('Random meme generator from the "wholesomememes" subreddit'),
	async execute(interaction) {
		fetch('https://meme-api.com/gimme/wholesomememes')
			.then(res => res.json())
			.then(async res => {
				await interaction.reply({ embeds:[new EmbedBuilder().setColor('NotQuiteBlack').setImage(res.url)] });
			});
	},
};