import { Client, Intents } from 'discord.js';
import * as fs from 'fs';
import json from './config.json' assert { type: 'json' }

import { loadLoL } from './commands/basicsLoL.js';
import { ping } from './commands/ping.js';
import { shutdown } from './commands/shutdown.js';
import { registerLoLAcc } from './commands/registerLoLAcc.js';
import { getGame } from './commands/getGame.js';
import LeagueJS from 'LeagueJS'

console.log("Init...")

fs.mkdir('data', () => { });
fs.mkdir('data/files', () => { });

process.env.RIOT_LOL_API_KEY = json.riotKey;
process.env.LEAGUE_API_PLATFORM_ID = 'euw1'
process.env.LEAGUE_FILE_STORED_PATH = "data/files"

// Create League API instance
const leagueJs = new LeagueJS(process.env.RIOT_LOL_API_KEY, {
    STATIC_DATA_ROOT: process.env.LEAGUE_FILE_STORED_PATH,
    PLATFORM_ID: process.env.LEAGUE_API_PLATFORM_ID
});


// create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
// check when bot is up
client.once('ready', () => { console.log('Bot running!'); });
// endpoints
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



// Load LoL data if necessary
await loadLoL(leagueJs)

// start bot using token
console.log("Bot loading...")
client.login(json.token);
