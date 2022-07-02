/**
 * @param {Client<boolean>} client bot's instance
 * @param {CommandInteraction<CacheType>} interaction command's entry point
 */

async function shutdown(client, interaction) {
    await interaction.reply('Shutting down...');
    client.destroy();
}

export { shutdown };