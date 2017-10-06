let database = require('./storage/storage');

database.put("first key","First valuee");
database.put("second key","second valuee");


database.save();

database.clear();

database.load(() => {
    database.getAll();
})
