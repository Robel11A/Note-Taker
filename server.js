const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// HTML Route for notes page
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

// API Route to get notes
app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading notes data.');
      return;
    }
    res.json(JSON.parse(data));
  });
});

// API Route to add a new note
app.post('/api/notes', (req, res) => {
  const newNote = { ...req.body, id: uuidv4() };
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading notes data.');
      return;
    }
    const notes = JSON.parse(data);
    notes.push(newNote);
    fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
      if (err) {
        res.status(500).send('Error saving the note.');
        return;
      }
      res.json(newNote);
    });
  });
});

// API Route to delete a note
app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading notes data.');
      return;
    }
    let notes = JSON.parse(data);
    notes = notes.filter(note => note.id !== noteId);
    fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
      if (err) {
        res.status(500).send('Error deleting the note.');
        return;
      }
      res.sendStatus(204); // No Content
    });
  });
});

// HTML Route for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
}); 