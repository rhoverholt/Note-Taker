const express = require('express');
const path = require('path');

const { clog } = require('./middleware/clog');
const api = require('./routes/index.js');

const PORT = process.env.PORT || 3001;

const app = express();

// Middleware for logging all requests
app.use(clog);

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for directly access static html pages
app.use(express.static('public'));

// Middleware to detect and respond to API calls
app.use('/api', api)

// Routes to manually retrieve the static html pages
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

// As all is set, now listen for requests
app.listen(PORT, () =>
  console.log(`Note Taker App is listening at http://localhost:${PORT}`)
);
