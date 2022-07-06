
import * as fs from 'fs';
import * as path from 'path';
import fetch from 'node-fetch';


async function loadLoL(leagueJs) {
    await leagueJs.StaticData.gettingChampions();
    process.env.LEAGUE_JSON_PATH = getJsonPath(process.env.LEAGUE_FILE_STORED_PATH);


    if (!fs.existsSync(process.env.LEAGUE_FILE_STORED_PATH + "/champions_id.json")) {
        console.log("generating images...")
        await generate_artworks()
    }
    console.log("Done with LoL loading!")
}

async function generate_artworks() {
    let path = process.env.LEAGUE_JSON_PATH + "/champion.json"
    let json = JSON.parse(fs.readFileSync(path))
    let data = json.data

    let championsId = {}
    let tmp_list = []
    fs.mkdir(process.env.LEAGUE_FILE_STORED_PATH + '/images', () => { });

    for (let champion of Object.values(data)) {
        let championName = champion.image.full
        championName = championName.slice(0, championName.indexOf('.'))
        championsId[parseInt(champion.id)] = { file: championName, name: champion.name }

        await fetch("http://ddragon.leagueoflegends.com/cdn/img/champion/loading/" + championName + "_0.jpg")
            .then(res => res.body.pipe(fs.createWriteStream(process.env.LEAGUE_FILE_STORED_PATH + "/images/" + championName + ".jpg")));

        console.log("loaded", championName)
    }

    fs.writeFileSync(process.env.LEAGUE_FILE_STORED_PATH + "/champions_id.json", JSON.stringify(championsId, null, 4), function (err) { });
}



function getJsonPath(srcpath) {

    let dirs = getDirectories(srcpath)
    for (let dir of dirs) {
        let currpath = srcpath + "/" + dir
        if (containsJSON(currpath))
            return currpath

        let recursion = getJsonPath(currpath)
        if (recursion != undefined)
            return recursion
    }
    return undefined
}

function getDirectories(srcpath) {
    return fs.readdirSync(srcpath)
        .filter(file => fs.statSync(path.join(srcpath, file)).isDirectory());
}

function containsJSON(srcpath) {
    let files = fs.readdirSync(srcpath)
        .filter(file => fs.statSync(path.join(srcpath, file)).isFile() && file.match(/.*[.]json$/gm));

    return files.length !== 0
}


export { loadLoL }