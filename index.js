import { Client, Intents } from 'discord.js';
import json from './config.json' assert { type: 'json' }

import { ping } from './commands/ping.js';
import { shutdown } from './commands/shutdown.js';
import { registerLoLAcc } from './commands/registerLoLAcc.js';

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
    console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    if (commandName === 'ping') await ping(interaction)
    /*else if (commandName === 'server') { await interaction.reply('Server info.');}
    else if (commandName === 'user') {await interaction.reply('User info.');}*/
    else if (commandName === 'shutdown') await shutdown(client, interaction)
    else if (commandName === 'registerlol') await registerLoLAcc(interaction, options)
});

//Bot start using token
client.login(json.token);
