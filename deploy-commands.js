import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

import json from './config.json' assert { type: 'json' };

const commands = [
    new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
    //new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
    //new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
    new SlashCommandBuilder().setName('shutdown').setDescription('Stops me!'),
    new SlashCommandBuilder()
        .setName('registerlol')
        .setDescription('Registers your LoL account')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('Your username')
                .setRequired(true)),
    new SlashCommandBuilder().setName('getgame').setDescription("Infos about your current LoL game"),

]
    .map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(json.token);

rest.put(Routes.applicationGuildCommands(json.clientId, json.guildId), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);