const fs = require('fs');
const path = require('path');
const url = require('url');
const qs = require('querystring');

const database = require('../config/dataBase');

getCreationForm = (req, res) => {
    let filePath = path.normalize(path.join(__dirname, '../views/addMovie.html'))

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/plain'})
            res.write('Resource not found!')
            res.end();
            return;
        }

        res.writeHead(200, {'content-type': 'text/html'})
        res.write(data);
        res.end();
    })
}

module.exports = (req, res) => {
    req.pathname = req.pathname || url
        .parse(req.url)
        .pathname

    if (req.pathname === '/addMovie' && req.method === "GET") {
        getCreationForm(req, res);

    } else if (req.pathname === '/addMovie' && req.method === "POST") {
        let body = [];

        req.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            body = Buffer
                .concat(body)
                .toString();
            // at this point, `body` has the entire request body stored in it as a string

            let movie = qs.parse(body);

            let validMovieForm = true;
            for (let prop in movie) {
                if (movie[prop] === "") {
                    validMovieForm = false;
                }
            }

            if (validMovieForm) {
                database.push(movie);
                fs.readFile('./views/addMovie.html', (err, data) => {
                    if (err) {
                        res.writeHead(400, {'content-type': 'text/html'})
                        res.write(data);
                        res.end();
                        return;
                    }

                    data = data
                        .toString()
                        .replace(`<div id="replaceMe">{{replaceMe}}</div>`, `<div id="succssesBox"><h2 id="succssesMsg">Movie Added</h2></div>`)

                    res.writeHead(200, {'content-type': 'text/html'})
                    res.write(data);
                    res.end();
                })
            } else {
                fs.readFile('./views/addMovie.html', (err, data) => {
                    if (err) {
                        return;
                    }
                    data = data
                        .toString()
                        .replace(`<div id="replaceMe">{{replaceMe}}</div>`, `<div id="errBox"><h2 id="errMsg">Please fill all fields</h2></div>`)
                    res.writeHead(400, {'content-type': 'text/html'})
                    res.write(data);
                    res.end();
                })
            }
        });

    } else if (req.pathname === '/viewAllMovies' && req.method === "GET"){

        let filePath = path.normalize(path.join(__dirname, '../views/viewAll.html'))
        
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    res.writeHead(404, {'Content-Type': 'text/plain'})
                    res.write('Resource not found!')
                    res.end();
                    return;
                }
        
                let allMovies = "";
                let idCounter = 1;
                for(let movie in database){
                    allMovies += `<div class="${idCounter}">
                    <img  height="362" width="362" class="moviePoster" src="${decodeURIComponent(database[movie].moviePoster)}"/>          
                  </div>`;

                  idCounter++;
                }
                data = data.toString().replace('<div id="replaceMe">{{replaceMe}}</div>', allMovies);

                res.writeHead(200, {'content-type': 'text/html'})
                res.write(data);
                res.end();
            })
    } else if(req.pathname.startsWith('/movies/details/') && req.method === "GET"){
      
        let filePath = path.normalize(path.join(__dirname, '../views/details.html'))
        
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    res.writeHead(404, {'Content-Type': 'text/plain'})
                    res.write('Resource not found!')
                    res.end();
                    return;
                }
                
                let movieID = Number(req.pathname.substring(req.pathname.lastIndexOf('/') + 1))
                let movieObj = database[movieID];

                data = data.toString().replace('<div id="replaceMe">{{replaceMe}}</div>',
                `<div class="content">
                <img height="362" width="362" src="${decodeURIComponent(movieObj.moviePoster)}" alt=""/>
                <h3>Title  ${decodeURIComponent(movieObj.movieTitle).replace(/\+/g,  ' ')}</h3>
                <h3>Year ${movieObj.movieYear}</h3>
                <p> ${decodeURIComponent(movieObj.movieDescription.replace(/\+/g, ' '))}</p>
            </div>`)

                res.writeHead(200, {'content-type': 'text/html'})
                res.write(data);
                res.end();
            })

    }else {
        return true;
    }
}