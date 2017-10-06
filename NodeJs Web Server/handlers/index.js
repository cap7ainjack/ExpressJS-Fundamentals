const homeHandler = require('./homeHandler')
const staticHandler = require('./static-file')
const movieHandler = require('./movieHandler')

module.exports = [homeHandler, movieHandler, staticHandler]