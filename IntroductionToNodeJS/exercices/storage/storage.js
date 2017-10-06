const fs = require('fs');

let db = {}

let put = (key, value) => {
    if (typeof key !== "string") {
        console.log("Error! Key should be string")
        return
    } else if (key in db) {
        console.log("Error! Duplicate key!")
        return
    }
    db[key] = value;
    return
}

let get = (key) => {
    if (!db.hasOwnProperty(key)) {
        console.log("Error! Such key does not exist!")
        return
    }
    return db[key];
}

let getAll = () => {
    if (Object.keys(db).length === 0) {
        console.log('No records available')
        return
    }

    for (record in db) {
        console.log(record + ":" + db[record])
    }
}

let update = (key, newValue) => {
    if (!db.hasOwnProperty(key)) {
        console.log("Error! Such key does not exist!")
        return
    }
    db[key] = newValue;
}

let deleteItem = (key) => {
    if (!db.hasOwnProperty(key)) {
        console.log("Error! Such key does not exist!")
        return
    }
    delete db[key];
}

let clear = () => {
    db = {}; //leave some work for garbage coll
}

let save = () => {
    fs.writeFileSync('../exercices/storage/storage.json', JSON.stringify(db), 'utf8')
}

let load = (callback) => {

    fs.readFile('../exercices/storage/storage.json', 'utf8', ((err, data) => {
        if (err) {
            return;
        }
        db = JSON.parse(data)

        callback();
    }))
}

module.exports = {
    put: put,
    get: get,
    getAll: getAll,
    update: update,
    delete: deleteItem,
    clear: clear,
    save: save,
    load: load
}
