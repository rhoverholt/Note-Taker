const express = require('express');
const path = require('path');

const dbio = require("./db/dbio");
const   {v4: uuidv4} = require("uuid");

const { clog } = require('./middleware/clog');
const api = require('./routes/index.js');

const PORT = 3001;

const app = express();

function errorSend (errCd, msg, res) {
  res.status(errCd).send(msg);
  console.log(msg);
}

// Middleware for logging all requests
app.use(clog);

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for directly access static html pages
app.use(express.static('public'));

// app.use('/api', api)

// API GET route
app.get('/api/notes', (req, res) => {
  console.log("GETting api/notes")
  dbio.selectAll()
    .then((data) => res.json(data))
    .catch((err) => console.log("select failed: " + err))
})

// API POST route
app.post('/api/notes', (req, res) => {

  // validate input
  if (!req.body.title || !req.body.text) {
    errorSend(400, "Invalid body: title and text are required", res);
    return;
  }

// create the object to be inserted
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
          errorSend(500,"Error: database failed to insert new post",res);
          return;
      }
  })
})

// DELETE route
app.delete('/api/notes/:id', (req, res) => {
  if (!req.params.id) {errorSend(400, "No ID sent", res); return}

  dbio.deleteId(req.params.id)
      .then((err) => {
          if (err) {errorSend(500, "Delete Error: " + err, res)} 
          else {
              console.log("Delete successful");
              res.status(200).send("Record Deleted");
          }}
      )
      .catch((err) => {
          errorSend(500, "Delete failed with '" + err + "'", res);
          return;
      })
})

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
