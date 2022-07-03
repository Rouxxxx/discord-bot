import * as fs from 'fs';

/**
 * @param {CommandInteraction<CacheType>} interaction command's entry point
 * @param {CommandInteractionOptionResolver<CacheType>} options command's options
 */

async function registerLoLAcc(interaction, options) {
    let path = './data/lol-accs.json'
    let userId = interaction.member.id
    let userString = userId.toString();
    let json = {}


    if (options == undefined || options.data.length !== 1) {
        await interaction.reply('Error with number of arguments given. Aborting.');
        return;
    }
    var name = options.data[0].value;
    if (name == undefined) {
        await interaction.reply('Error with name specified. Return');
        return;
    }

    if (fs.existsSync(path)) {
        json = JSON.parse(fs.readFileSync(path));
        fs.unlinkSync(path, () => { });
    }

    let responseString = (userString in json) ? "Username updated!" : "Username created!";

    json[userString] = name;
    fs.writeFileSync(path, JSON.stringify(json, null, 4), function (err) { });

    await interaction.reply(responseString);
}

export { registerLoLAcc }