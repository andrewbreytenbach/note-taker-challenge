const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());

// Define a router for handling API requests
const apiRouter = express.Router();

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for serving the notes.html file
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// Route for serving the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Route for getting all notes from db.json
apiRouter.get('/notes', (req, res) => {
    // Read db.json file
    const data = fs.readFileSync(path.join(__dirname, 'db.json'));
    // Parse data as JSON
    const notes = JSON.parse(data);
    // Return all notes as JSON
    res.json(notes);
  });
  
  // Route for adding a new note to db.json
  apiRouter.post('/notes', (req, res) => {
    // Read db.json file
    const data = fs.readFileSync(path.join(__dirname, 'db.json'));
    // Parse data as JSON
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
    // Return the new note to the client
    res.json(newNote);
  });
  
  // Mount the API router at /api
  app.use('/api', apiRouter);

  // Route for getting a single note from db.json
apiRouter.get('/notes/:id', (req, res) => {
  // Read db.json file
  const data = fs.readFileSync(path.join(__dirname, 'db.json'));
  // Parse data as JSON
  const notes = JSON.parse(data);
  // Find the note with the matching ID
  const note = notes.find(note => note.id === req.params.id);
  // Return the note as JSON
  res.json(note);
});

// Route for updating an existing note in db.json
apiRouter.put('/notes/:id', (req, res) => {
  // Read db.json file
  const data = fs.readFileSync(path.join(__dirname, 'db.json'));
  // Parse data as JSON
  const notes = JSON.parse(data);
  // Find the note with the matching ID
  const noteIndex = notes.findIndex(note => note.id === req.params.id);
  // Update the note with the new title and text
  notes[noteIndex].title = req.body.title;
  notes[noteIndex].text = req.body.text;
  // Write the updated notes array back to db.json
  fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(notes));
  // Return the updated note to the client
  res.json(notes[noteIndex]);
});

// Route for deleting a note from db.json
apiRouter.delete('/notes/:id', (req, res) => {
  // Read db.json file
  const data = fs.readFileSync(path.join(__dirname, 'db.json'));
  // Parse data as JSON
  const notes = JSON.parse(data);
  // Remove the note with the matching ID
  const newNotes = notes.filter(note => note.id !== req.params.id);
  // Write the updated notes array back to db.json
  fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(newNotes));
  // Return the ID of the deleted note to the client
  res.json({ id: req.params.id });
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
