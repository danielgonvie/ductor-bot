const { SlashCommandBuilder } = require('discord.js');
const dataVids = [
	'https://www.youtube.com/watch?v=Y-lUs5hRfpg', // badbu
	'https://www.youtube.com/watch?v=QYIw4VWTvhQ', // dross
	'https://www.youtube.com/watch?v=v_OuBz_L4sI', // daft punk
	'https://www.youtube.com/watch?v=Z73dCCr7G8E', // LP
	'https://www.youtube.com/watch?v=zhXQdZQ2Fhg', // chill data
	'https://www.youtube.com/watch?v=gEwvu3KYHY0', // travis scott
	'https://www.youtube.com/watch?v=KVHnsBscpX0', // la doña
	'https://www.youtube.com/watch?v=2UBk56by2c8', // rata blanca
	'https://www.youtube.com/watch?v=q-PfVZYt-jA', // peso pluma
	'https://www.youtube.com/watch?v=Elu19EsSRO4', // quevedo
];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dato')
		.setDescription('Tremenda data bro!'),
	async execute(interaction) {
		const indiceAleatorio = Math.floor(Math.random() * dataVids.length);

		await interaction.reply(dataVids[indiceAleatorio]);
	},
};