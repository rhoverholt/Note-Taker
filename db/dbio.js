const   fs = require("fs/promises"), // note: all fs functions are promises
        dbFile = "./db/db.json";

const selectAll = () => fs.readFile(dbFile, "utf8").then(JSON.parse)

const insert = function({title, text, id}) {
    return fs.readFile(dbFile, 'utf8')
        .then(function (data) {
            const parsedData = JSON.parse(data);
            const newRecord = {
                title,
                text,
                id
            }
            parsedData.push(newRecord);
            return fs.writeFile(dbFile, JSON.stringify(parsedData, null, 4))
        })
        .catch(function (err) {
                console.error(err);
                return err;
        })
}

const deleteId = function(id) {
    return fs.readFile(dbFile, 'utf8')
        .catch(function(err) {console.error("File read failed with error: " + err); return err;})
        .then(function(data) {
            const parsedData = JSON.parse(data);
            const result = parsedData.filter((data) => data.id !== id)
            if (result.length === parsedData.length) {
                return Promise.reject(new Error('ID not found'));
            } else {
                return fs.writeFile(dbFile, JSON.stringify(result, null, 4))
            }
        })
}

module.exports = {
    selectAll,
    insert,
    deleteId
}