const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3001;
const fs = require("fs");
const { v4: uuidv4 } = require('uuid'); // Added import for UUID generation
const notesData = require("./db/db.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// Default route that serves the homepage
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "public/index.html"))
);

// Route for serving the notes page
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

// Route for retrieving all notes from the database
app.get("/api/notes", (req, res) => res.json(notesData));

// Route for saving a new note to the database
app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;

  const newNote = {
    id: uuidv4(), // Generate a new UUID for the note
    title,
    text,
  };

  notesData.push(newNote);

  fs.writeFile(path.join(__dirname, "db/db.json"), JSON.stringify(notesData, null, 4), (writeErr) =>
    writeErr
      ? console.error(writeErr)
      : console.info("The note has been saved")
  );

  const response = {
    status: "success",
    body: newNote,
  };

  res.status(201).json(response);
});

// Route for deleting a note from the database
app.delete("/api/notes/:id", (req, res) => {
  const noteId = req.params.id;
  const deletedNote = notesData.find((note) => note.id === noteId);

  if (!deletedNote) {
    res.status(404).json({ error: "Note not found" });
    return;
  }

  notesData.splice(notesData.indexOf(deletedNote), 1);

  fs.writeFile(path.join(__dirname, "db/db.json"), JSON.stringify(notesData, null, 4), (writeErr) =>
    writeErr
      ? console.error(writeErr)
      : console.info("The note has been deleted")
  );

  const response = {
    status: "success",
    message: "Note deleted",
  };

  res.status(200).json(response);
});

app.listen(PORT, () =>
  console.log(`App is running and listening on http://localhost:${PORT}`)
);
