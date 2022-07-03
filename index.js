import { Client, Intents } from 'discord.js';
import * as fs from 'fs';
import json from './config.json' assert { type: 'json' }

import { ping } from './commands/ping.js';
import { shutdown } from './commands/shutdown.js';
import { registerLoLAcc } from './commands/registerLoLAcc.js';
import { getGame } from './commands/getGame.js';
import LeagueJS from 'LeagueJS'

fs.mkdir('data', () => { });
fs.mkdir('data/files', () => { });

process.env.RIOT_LOL_API_KEY = json.riotKey;
process.env.LEAGUE_API_PLATFORM_ID = 'euw1'

// Create League API instance
const leagueJs = new LeagueJS(process.env.RIOT_LOL_API_KEY, {
    STATIC_DATA_ROOT: "data/files",
    PLATFORM_ID: process.env.LEAGUE_API_PLATFORM_ID
});

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
    else if (commandName === "getgame") await getGame(interaction, interaction.member.id, leagueJs);
});


//Bot start using token
client.login(json.token);
