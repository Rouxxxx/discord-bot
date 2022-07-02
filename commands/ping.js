/**
 * @param {CommandInteraction<CacheType>} interaction command's entry point
 */

async function ping(interaction) {
    var date = Math.round((new Date().getTime() - interaction.createdAt.getTime()) / 10);
    await interaction.reply(`Pong! **${date}ms**`);
}

export { ping };