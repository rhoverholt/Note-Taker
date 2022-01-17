const db = require("./db/dbio")

db.selectAll()
    .then(console.log)
    .catch((err) => console.log("select failed: " + err))

// db.insert({title: "rich", text: "txt"})
//     .then(() => console.log("insert succeeded"))
//     .catch((err) => console.log("insert failed: " + err))

db.deleteId("03e4fdae-5e05-415b-8935-f32665c7252b")
    .then((err) => {if (err) {console.log(err)} else {console.log("Delete successful")}})
    .catch((err) => console.log("Delete failed with '" + err + "'"))
// console.log("hi")