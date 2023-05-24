const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware for parsing JSON data
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for serving the notes.html file
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

// Route for serving the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API router for handling notes-related routes
const apiRouter = express.Router();

// Route for getting all notes from db.json
apiRouter.get('/notes', (req, res) => {
  // Read the contents of db.json
  const data = fs.readFileSync(path.join(__dirname, 'db.json'));
  // Parse the data as JSON
  const notes = JSON.parse(data);
  // Send the notes as a JSON response
  res.json(notes);
});

// Route for adding a new note to db.json
apiRouter.post('/notes', (req, res) => {
  // Read the contents of db.json
  const data = fs.readFileSync(path.join(__dirname, 'db.json'));
  // Parse the data as JSON
  const notes = JSON.parse(data);
  // Generate a unique ID for the new note
  const newNote = {
    id: uuidv4(),
    title: req.body.title,
    text: req.body.text,
  };
  // Add the new note to the notes array
  notes.push(newNote);
  // Write the updated notes array back to db.json
  fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(notes));
  // Send the new note as a JSON response
  res.json(newNote);
});

// Route for getting a single note from db.json
apiRouter.get('/notes/:id', (req, res) => {
  // Read the contents of db.json
  const data = fs.readFileSync(path.join(__dirname, 'db.json'));
  // Parse the data as JSON
  const notes = JSON.parse(data);
  // Find the note with the matching ID
  const note = notes.find((note) => note.id === req.params.id);
  // Send the note as a JSON response
  res.json(note);
});

// Route for updating an existing note in db.json
apiRouter.put('/notes/:id', (req, res) => {
  // Read the contents of db.json
  const data = fs.readFileSync(path.join(__dirname, 'db.json'));
  // Parse the data as JSON
  const notes = JSON.parse(data);
  // Find the note with the matching ID
  const noteIndex = notes.findIndex((note) => note.id === req.params.id);
  // Update the note with the new title and text
  notes[noteIndex].title = req.body.title;
  notes[noteIndex].text = req.body.text;
  // Write the updated notes array back to db.json
  fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(notes));
  // Send the updated note as a JSON response
  res.json(notes[noteIndex]);
});

// Route for deleting a note from db.json
apiRouter.delete('/notes/:id', (req, res) => {
  // Read the contents of db.json
  const data = fs.readFileSync(path.join(__dirname, 'db.json'));
  // Parse the data as JSON
  const notes = JSON.parse(data);
  // Remove the note with the matching ID
  const newNotes = notes.filter((note) => note.id !== req.params.id);
  // Write the updated notes array back to db.json
  fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(newNotes));
  // Send the ID of the deleted note as a JSON response
  res.json({ id: req.params.id });
});

// Mount the API router at /api
app.use('/api', apiRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
