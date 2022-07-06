import * as fs from 'fs';

import * as Canvas from '@napi-rs/canvas'
import { MessageAttachment } from 'discord.js';

/**
 * @param {CommandInteraction<CacheType>} interaction command's entry point
 * @param {Number} userId discord id of member sending command
 * @param {LeagueJS} leagueJs api to fetch LoL's data
 */
async function getGame(interaction, userId, leagueJs) {

    await interaction.deferReply();

    let json = JSON.parse(fs.readFileSync('./data/lol-accs.json'))
    var userString = userId.toString();

    let account = json[userString];
    let infos = await leagueJs
        .Summoner
        .gettingByName(account);

    let detailed = await leagueJs
        .League
        .gettingLeagueEntriesForSummonerId(infos.id).then(data => data[0]);

    detailed.id = infos.id

    let tier = detailed.tier.toLowerCase();
    tier = tier.charAt(0).toUpperCase() + tier.slice(1);

    let gameInfos = undefined
    await leagueJs
        .Spectator
        .gettingActiveGame(infos.id)
        .then(data => gameInfos = data)
        .catch(err => { });

    if (gameInfos == undefined) {
        await interaction.editReply("User is not currently in game")
        return;
    }

    let players = await generate_players(leagueJs, detailed, gameInfos)

    await interaction.editReply({ files: [await generate_canvas(players)] });
}

async function generate_canvas(players) {

    const canvas = Canvas.createCanvas(700, 400);
    const context = canvas.getContext('2d');

    const backgroundFile = await fs.promises.readFile('./data/files/loading-screen.jpg');
    const background = new Canvas.Image();
    background.src = backgroundFile;

    context.drawImage(background, 0, 0, canvas.width, canvas.height);


    context.fillStyle = '#ffffff';
    context.font = 'bold 10px sans-serif';


    let heightsNames = [canvas.height / 2 - 47, canvas.height - 47]
    let heightImages = [30, canvas.height / 2 + 30]
    let widthsNames = [75, (canvas.width / 2) - 140, (canvas.width / 2), canvas.width - 210, canvas.width - 80]
    let widthsImages = [55, (canvas.width / 2) - 160, (canvas.width / 2) - 17, (canvas.width / 2) + 120, canvas.width - 100]

    let json = JSON.parse(fs.readFileSync(process.env.LEAGUE_FILE_STORED_PATH + "/champions_id.json"))


    for (let i = 0; i < players.length; i++) {
        const splashImg = await fs.promises.readFile('./data/files/images/' + json[players[i].championId].file + '.jpg');
        const splash = new Canvas.Image();
        splash.src = splashImg;
        context.drawImage(splash, widthsImages[i % 5] - 30, heightImages[(i < 5) ? 0 : 1], 100, 150)
    }

    context.globalAlpha = 0.8
    const splashImg = await fs.promises.readFile('./data/files/black.png');
    for (let i = 0; i < players.length; i++) {
        const splash = new Canvas.Image();
        splash.src = splashImg;
        context.drawImage(splash, widthsImages[i % 5] - 30, heightImages[(i < 5) ? 0 : 1] + 110, 100, 40)
    }

    context.globalAlpha = 1

    context.fillStyle = '#3c68a4'
    for (let i = 0; i < 5; i++) {
        let championName = json[players[i].championId].name
        let width = widthsNames[i % 5] - championName.length * 2.6
        context.fillText(championName, width, heightsNames[0] - 3);
    }

    context.fillStyle = '#971613'
    for (let i = 5; i < players.length; i++) {
        let championName = json[players[i].championId].name
        let width = widthsNames[i % 5] - championName.length * 2.6
        context.fillText(championName, width, heightsNames[1] - 3);
    }

    context.fillStyle = '#ffffff';
    for (let i = 0; i < players.length; i++) {
        let name = players[i].name

        if (name.length > 15)
            name = name.substring(0, 15) + "..."

        let width = widthsNames[i % 5] - name.length * 2.5
        context.fillText(name, width, heightsNames[(i < 5) ? 0 : 1] + 10);
    }

    context.fillStyle = '#e3ce1f'
    for (let i = 0; i < players.length; i++) {
        let width = widthsNames[i % 5] - players[i].rank.length * 2.5
        context.fillText(players[i].rank, width, heightsNames[(i < 5) ? 0 : 1] + 20);
    }


    return new MessageAttachment(canvas.toBuffer('image/png'), 'render.png');
}

/**
 * @param {PlayerInfos} infos obj already fetched corresponding to current player's infos
 * @param {GameInfos} gameInfos everything about the current game
 * @param {LeagueJS} leagueJs api to fetch LoL's data
 */
async function generate_players(leagueJs, infos, gameInfos) {
    let players = []
    let playerobj = {}

    for (let player of gameInfos.participants) {
        if (player.summonerId != infos.id) {
            players.push(new Promise(async function (resolve, reject) {
                let current = await leagueJs.League.gettingLeagueEntriesForSummonerId(player.summonerId).then(data => data[0]);
                let currenttier = current.tier.toLowerCase();
                currenttier = currenttier.charAt(0).toUpperCase() + currenttier.slice(1);

                let obj = {}
                obj.name = current.summonerName
                obj.rank = currenttier + " " + current.rank
                obj.team = player.teamId
                obj.championId = player.championId

                resolve(obj)
            }))
        }
        else {
            //console.log(player)
            let tier = infos.tier.toLowerCase();
            tier = tier.charAt(0).toUpperCase() + tier.slice(1);
            let rank = tier + " " + infos.rank
            playerobj = { name: player.summonerName, rank: rank, team: player.teamId, championId: player.championId }
        }
    }

    let res = []
    await Promise.allSettled(players).then(values => {
        for (let val of values)
            res.push(val.value)
    });
    players = res
    players.push(playerobj)

    return players
        .sort(function (a, b) {
            if (b.team != a.team)
                return a.team - b.team
            return a.name.localeCompare(b.name)
        })
        .map(elm => { elm.team = elm.team / 100; return elm })
}

export { getGame }