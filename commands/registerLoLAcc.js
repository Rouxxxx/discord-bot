
import * as fs from 'fs';
import editJsonFile from 'edit-json-file';

/**
 * @param {CommandInteraction<CacheType>} interaction command's entry point
 * @param {CommandInteractionOptionResolver<CacheType>} options command's options
 */

async function registerLoLAcc(interaction, options) {
    if (options == undefined || options.data.length !== 1) {
        await interaction.reply('Error with number of arguments given. Aborting.');
        return;
    }
    var name = options.data[0].value;
    if (name == undefined) {
        await interaction.reply('Error with name specified. Return');
        return;
    }
    register(interaction.member.id, name)

    await interaction.reply("Username updated!");
}


/**
 * @param {Number} userId user running command
 * @param {String} name user's LoL account
 */
function register(userId, name) {
    fs.mkdir('data', (err) => { });
    let file = editJsonFile(`./data/lol-accs.json`, {
        autosave: true
    });

    file.set(userId.toString(), name);
}

export { registerLoLAcc }