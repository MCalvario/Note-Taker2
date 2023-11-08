//set up variables and requires
const fs = require ("fs");

const PORT = process.env.PORT || 3001;

const express = require('express');


const { v4: uuidv4 } = require('uuid');

const app = express();

const path = require('path');
const allNotes = [];

//set up middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.get ("/api/notes", (req,res) => {
    fs.readFile("db/db.json", "utf8", (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        res.json(JSON.parse(data));
    });
});

function addNote(body, notesArray) {
  const newNote = {
    ...body, 
    id: uuidv4(), 
  };
  notesArray.push(newNote);
  fs.writeFileSync(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify(notesArray, null, 2)
  );
  return newNote;
}

app.post("/api/notes", (req, res) => {
  const newNote = addNote(req.body, allNotes);
  res.json(newNote);
});

//set up html routes
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

//GET /notes should return the notes.html file.
//GET * should return the index.html file.
//set up api routes
//set up api route to read db.json file
//POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client. You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you).
app.listen(PORT, () =>
  console.log(`Now listening on http://localhost:${PORT}!`)
);