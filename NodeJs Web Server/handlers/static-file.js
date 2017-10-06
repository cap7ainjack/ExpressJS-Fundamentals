const fs = require('fs');
const path = require('path');
const url = require('url');

const allowedResponseTypes = ['.js', '.jpg', '.png', '.html', '.css']

function getContentType(url) {
    let contentTypes = {
        '.css': 'text/css',
        '.html': 'text/html',
        '.ico': 'image/x-icon',
        '.jpg': 'image/jpeg',
        '.png': 'image/png',
        '.js': 'application/javascript'
    }
    let requestedContet = url.substr(url.indexOf('.'))
    if (contentTypes[requestedContet]) {
        return contentTypes[requestedContet];
    }
}

module.exports = (req, res) => {
    req.pathname = req.pathname || url
        .parse(req.url)
        .pathname

    if (req.pathname.startsWith('/public/') && req.method === "GET") {
        let filePath = path.normalize(path.join(__dirname, `..${req.pathname}`))

        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/plain'})
                res.write('Resource not found!')
                res.end();
                return;
            } //else if (!allowedResponseTypes.find(req.pathname.substr(req.pathname.indexOf('.')))) {
             //   res.writeHead(403, {'Content-Type': 'text/plain'})
             //   res.write('Resource not allowed!')
             //   res.end();
             //   return;
          //  }

            res.writeHead(200, {
                'Content-Type': getContentType(req.pathname)
            })

            res.write(data)
            res.end();
        })
    } else {
        res.end(); //ADD 404 html
    }
}