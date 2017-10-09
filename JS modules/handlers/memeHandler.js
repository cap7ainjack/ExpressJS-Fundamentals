const fs = require('fs');
const path = require('path');
const db = require('../db/database');
const qs = require('querystring');
const url = require('url');
const http = require('http')

const formidable = require('formidable'); //for file upload
const shortId = require('shortid') //fileNames generator

const viewAddMemePath = './views/addMeme.html'

module.exports = (req, res) => {
  if (req.pathname === '/viewAllMemes' && req.method === 'GET') {
    viewAll(req, res)
  } else if (req.pathname === '/addMeme' && req.method === 'GET') {
    viewAddMeme(req, res)
  } else if (req.pathname === '/addMeme' && req.method === 'POST') {
    addMeme(req, res)
  } else if (req.pathname.startsWith('/getDetails') && req.method === 'GET') {
    getDetails(req, res)
  } else if (req.pathname.startsWith('/download') && req.method === 'GET') {
    downloadMemeImage(req,res)
  } else {
    return true
  }
}

//Utils
let defaultSuccessReposne = (res, data) => {
  res.writeHead(200, { 'content-type': 'text/html' })
  res.end(data);
}

let memeGenerator = (id, status, path, memeTitle, memeDescription) => {
  return {
    id: id,
    title: memeTitle,
    memeSrc: path,
    description: memeDescription,
    privacy: status,
    dateStamp: Date.now()
  }
}

//TODO:
let downloadMemeImage = (req, res) =>{
  let fileUrl = req.pathname.substring(10);
  let writeStream = fs.createWriteStream(`${fileUrl}`)
  
  console.log(fileUrl)
    // This pipes the POST data to the file
    req.pipe(writeStream);
  
    // After all the data is saved, respond with a simple html form so they can post more data
    req.on('end', function () {
      res.writeHead(200, {"content-type":"text/html"});
      res.end('<form method="POST"><input name="test" /><input type="submit"></form>');
    });
  
    // This is here incase any errors occur
    writeStream.on('error', function (err) {
      console.log(err);
    });
}

let addMeme = (req, res) => {
  let form = new formidable.IncomingForm();
  let dbLength = Math.ceil(db.memes.getAll().length / 10);

  let fileName = shortId.generate();
  let memePath = `./public/memeStorage/${dbLength}/${fileName}.jpg`

  form.on('error', (err) => {
    console.log(err);
    return
  }).on('fileBegin', (name, file) => {

    fs.access(`./public/memeStorage/${dbLength}`, (err) => {
      if (err) {
        console.log(err);
        fs.mkdirSync(`./public/memeStorage/${dbLength}`)
      }
    })

    file.path = memePath;
  })



  form.parse(req, (err, fields, files) => {
    if (err) {
      console.log(err);
      return;
    }

    let id = shortId.generate();
    let memeObj = memeGenerator(id, fields.status, memePath, fields.memeTitle, fields.memeDescription);

    db
      .memes
      .addMeme(memeObj);

    res.writeHead(200, { 'content-type': 'text/html' });
    res.write(`recieved upload:\n\n
    <a href="/">start page!</a>`)
    res.end();
  });
}

let viewAddMeme = (req, res) => {
  fs.readFile(viewAddMemePath, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }

    defaultSuccessReposne(res, data);
  })
}

function getDetails(req, res) {
  let filePath = path.normalize(path.join(__dirname, '../views/details.html'))

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.write('Resource not found!')
      res.end();
      return;
    }

    let query = qs.parse(url.parse(req.url).query);
    let memeId = query["id"];

    let targetedMeme = db
      .memes
      .FindById(memeId);

    data = data
      .toString()
      .replace('<div id="replaceMe">{{replaceMe}}</div>', `
        <div class="content">
          <img src="${targetedMeme.memeSrc}" alt=""/>
          <h3>Title  ${targetedMeme.title}</h3>
          <p> ${targetedMeme.description}</p>
          <button><a href="/download/${targetedMeme.memeSrc}">Download Meme</a></button>
        </div>`)

    defaultSuccessReposne(res, data);
  })
}

function viewAll(req, res) {
  let filePath = path.normalize(path.join(__dirname, '../views/viewAll.html'))

  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.log(err)
      res.writeHead(404, { 'Content-Type': 'text/plain' })

      res.write('404 not found!')
      res.end();
      return
    }

    let memes = db
      .memes
      .getAll();

    memes = memes.sort((a, b) => {
      return b.dateStamp - a.dateStamp;
    }).filter((currentMeme) => {
      return currentMeme.privacy === "on";
    });

    let allMemesString = "";

    for (let meme of memes) {
      allMemesString += `
      <div class="meme">
        <a href="/getDetails?id=${meme.id}">
        <img class="memePoster" src="${meme.memeSrc}"/>          
      </div>`
    }

    data = data
      .toString()
      .replace('<div id="replaceMe">{{replaceMe}}</div>', allMemesString);

    defaultSuccessReposne(res, data);
  })

}