import * as fs from 'fs';

/**
 * @param {CommandInteraction<CacheType>} interaction command's entry point
 * @param {Number} userId discord id of member sending command
 * @param {LeagueJS} leagueJs api to fetch LoL's data
 */
async function getGame(interaction, userId, leagueJs) {

    let json = JSON.parse(fs.readFileSync('./data/lol-accs.json'))
    var userString = userId.toString();

    let account = json[userString];
    let infos = await leagueJs
        .Summoner
        .gettingByName(account);
    console.log(infos)
    let detailed = await leagueJs
        .League
        .gettingLeagueEntriesForSummonerId(infos.id).then(data => data[0]);

    let tier = detailed.tier.toLowerCase();
    tier = tier.charAt(0).toUpperCase() + tier.slice(1);

    let gameInfos = undefined
    await leagueJs
        .Spectator
        .gettingActiveGame(infos.id)
        .then(data => gameInfos = data)
        .catch(err => { });

    if (gameInfos == undefined) {
        await interaction.reply("User is not currently in game")
        return;
    }

    await interaction.reply("Your rank: " + tier + " " + detailed.rank)
}

export { getGame }