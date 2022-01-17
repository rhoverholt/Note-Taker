const   express = require('express');
const   notes   = require('express').Router();
const   {v4: uuidv4} = require("uuid");

const dbio = require("../db/dbio");

const app = express();

// GET route
notes.get('/notes', (req, res) => {
    dbio.selectAll().then(res.json)
})

// POST route
notes.post('/notes', (req, res) => {
    // validate input
    if (!req.body) 
        {res.error("Invalid empty body")}

    if (!req.body.title || !req.body.text) 
        {res.error("Invalid body: title and text are required")}

    const insertObj = {
        title: req.body.title,
        text: req.body.text,
        id: uuidv4()
    }

    dbio.insert(insertObj).then((response) => {
        if (!response) {// insert succeeded
            res.json(insertObj)
        }
        else {
            res.error("Error: database failed to insert new post")
        }
    })
})

// DELETE route
notes.delete('/notes/:id', (req, res) => {
    if (!id) {res.error("No ID sent")}

    dbio.deleteId(id)
        .then((err) => {
            if (err) {console.log(err)} 
            else {
                console.log("Delete successful");
                res.status(200)
            }}
        )
        .catch((err) => {
            console.log("Delete failed with '" + err + "'")
            res.error(500)
        })
})

module.exports = notes;