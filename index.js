const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName, options } = interaction;
    

	if (commandName === 'ping') {
        var date = Math.round((new Date().getTime() - interaction.createdAt.getTime()) / 10);
		await interaction.reply(`Pong! **${date}ms**`);
	} else if (commandName === 'server') {
		await interaction.reply('Server info.');
	} else if (commandName === 'user') {
		await interaction.reply('User info.');
	}
    else if (commandName === 'shutdown') {
        await interaction.reply('Shutting down...');
        client.destroy();
	}
});


//Bot login
client.login(token);
