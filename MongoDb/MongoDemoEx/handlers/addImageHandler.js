const url = require('url');
const fs = require('fs');
const qs = require('querystring');

const Tag = require('../models/TagSchema');
const Image = require('../models/ImageSchema')

module.exports = (req, res) => {
  if (req.pathname === '/addImage' && req.method === 'POST') {
    addImage(req, res)
  } else if (req.pathname === '/delete' && req.method === 'GET') {
    deleteImg(req, res)
  } else {
    return true
  }
}

let addImage = () => {
  let form = new multiparty.Form();
  let image = {};

  form.on('part', (part) => {

    part.setEncoding('utf-8')
    let field = '';

    part.on('data', (data) => {
      field += data;
    })

    part.on('end', () => {
      image[part.name] = field;
    })
  })

  form.on('close', () => {
    Image.create(image).then((insertedImage) => {
      
    })
  })
}
