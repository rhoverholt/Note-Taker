const   notes           = require('express').Router();
const   {v4: uuidv4}    = require("uuid");
const   dbio            = require("../db/dbio");

function errorSend (errCd, msg, res) 
    {res.status(errCd).send(msg); console.log(msg);}

// GET route
notes.get('/notes', (req, res) => {
    dbio.selectAll()
        .then((data) => res.json(data))
        .catch((err) => errorSend(500, "select failed: " + err, res))
})

// POST route
notes.post('/notes', (req, res) => {
    // validate input
    if (!req.body.title || !req.body.text) {
        errorSend(400, "Invalid body: title and text are required", res);
        return;
    }

    const insertObj = {
        title:  req.body.title,
        text:   req.body.text,
        id:     uuidv4()
    }

    dbio.insert(insertObj).then((response) => {
        if (!response) {// insert succeeded
            res.json(insertObj)
        }
        else {
            errorSend(500,"Error: database failed to insert new post: " + response, res);
            return;
        }
    })
})

// DELETE route
notes.delete('/notes/:id', (req, res) => {
    if (!req.params.id) 
        {errorSend(400, "No ID sent", res); return}

    dbio.deleteId(req.params.id)
        .then((err) => {
            if (err) {errorSend(500, "Delete Error: " + err, res)} 
            else {
                console.log("Delete successful");
                res.status(200).send("Record deleted");
            }}
        )
        .catch((err) => {
            errorSend(500, "Delete failed with '" + err + "'", res);
            return;
        })
})

module.exports = notes;