let fs = require('fs');
let path = require('path')
const dbPath = path.join(__dirname, '/db.json')

let memes = [];

module.exports.memes = {}

module.exports.memes.getAll = getMemes

module.exports.memes.FindById = getMemeById

module.exports.memes.addMeme = addMeme

function getMemes() {
    if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, '[]');
        return [];
    }

    let json = fs
        .readFileSync(dbPath)
        .toString() || '[]';
    let memes = JSON.parse(json);

    return memes;
}

function getMemeById(id) {
    memes = getMemes();

    for (let meme of memes) {
        if (meme['id'] === id) {
            return meme;
        }
    }

    return {};
}

function addMeme (memeObj)  {
    memes = getMemes();
    memes.push(memeObj);

    saveMemes(memes);
}

let saveMemes = (memes) => {
    memes = JSON.stringify(memes);
    fs.writeFileSync(dbPath, memes);
}
