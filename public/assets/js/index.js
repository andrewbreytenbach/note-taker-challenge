let noteTitleInput;
let noteTextInput;
let saveNoteButton;
let newNoteButton;
let noteListContainer;

// Check if the current page is the "notes" page
if (window.location.pathname === "/notes") {
  noteTitleInput = document.querySelector(".note-title");
  noteTextInput = document.querySelector(".note-textarea");
  saveNoteButton = document.querySelector(".save-note");
  newNoteButton = document.querySelector(".new-note");
  noteListContainer = document.querySelectorAll(".list-container .list-group");
}

// Show an element
const showElement = (element) => {
  element.style.display = "inline";
};

// Hide an element
const hideElement = (element) => {
  element.style.display = "none";
};

let activeNote = {};

// Fetch notes from the server
const fetchNotes = () =>
  fetch("/api/notes", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

// Save a note on the server
const saveNote = (note) => {
  return fetch("/api/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  });
};

// Delete a note from the server
const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

// Render the active note on the page
const renderActiveNote = () => {
  hideElement(saveNoteButton);

  if (activeNote.note_id) {
    noteTitleInput.setAttribute("readonly", true);
    noteTextInput.setAttribute("readonly", true);
    noteTitleInput.value = activeNote.title;
    noteTextInput.value = activeNote.text;
  } else {
    noteTitleInput.removeAttribute("readonly");
    noteTextInput.removeAttribute("readonly");
    noteTitleInput.value = "";
    noteTextInput.value = "";
  }
};

// Handle the save note button click event
const handleNoteSave = () => {
  const newNote = {
    title: noteTitleInput.value,
    text: noteTextInput.value,
  };
  saveNote(newNote).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Handle the delete note button click event
const handleNoteDelete = (e) => {
  e.stopPropagation();

  const noteElement = e.target.parentElement;
  const noteId = JSON.parse(noteElement.getAttribute("data-note")).note_id;

  if (activeNote.note_id === noteId) {
    activeNote = {};
  }

  deleteNote(noteId).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Handle the note view event
const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute("data-note"));
  renderActiveNote();
};

// Handle the new note view event
const handleNewNoteView = (e) => {
  activeNote = {};
  renderActiveNote();
};

// Handle rendering the save button
const handleRenderSaveButton = () => {
  if (!noteTitleInput.value.trim() || !noteTextInput.value.trim()) {
    hideElement(saveNoteButton);
  } else {
    showElement(saveNoteButton);
  }
};

// Render the list of note titles
const renderNoteList = async (notes) => {
  let jsonNotes = await notes.json();
  if (window.location.pathname === "/notes") {
    noteListContainer.forEach((el) => (el.innerHTML = ""));
  }

  let noteListItems = [];

  // Create an HTML list item element with or without a delete button
  const createNoteListItem = (text, hasDeleteButton = true) => {
    const liElement = document.createElement("li");
    liElement.classList.add("list-group-item");

    const spanElement = document.createElement("span");
    spanElement.classList.add("list-item-title");
    spanElement.innerText = text;
    spanElement.addEventListener("click", handleNoteView);

    liElement.append(spanElement);

    if (hasDeleteButton) {
      const deleteButtonElement = document.createElement("i");
      deleteButtonElement.classList.add(
        "fas",
        "fa-trash-alt",
        "float-right",
        "text-danger",
        "delete-note"
      );
      deleteButtonElement.addEventListener("click", handleNoteDelete);

      liElement.append(deleteButtonElement);
    }

    return liElement;
  };

  if (jsonNotes.length === 0) {
    noteListItems.push(createNoteListItem("No saved Notes", false));
  }

  jsonNotes.forEach((note) => {
    const li = createNoteListItem(note.title);
    li.dataset.note = JSON.stringify(note);

    noteListItems.push(li);
  });

  if (window.location.pathname === "/notes") {
    noteListItems.forEach((note) => noteListContainer[0].append(note));
  }
};

// Fetch and render notes from the server
const getAndRenderNotes = () => fetchNotes().then(renderNoteList);

// Attach event listeners if the current page is the "notes" page
if (window.location.pathname === "/notes") {
  const deleteNoteButtons = document.querySelectorAll(".delete-note");
  deleteNoteButtons.forEach((button) => {
    button.addEventListener("click", handleNoteDelete);
  });

  saveNoteButton.addEventListener("click", handleNoteSave);
  newNoteButton.addEventListener("click", handleNewNoteView);
  noteTitleInput.addEventListener("keyup", handleRenderSaveButton);
  noteTextInput.addEventListener("keyup", handleRenderSaveButton);
}

// Fetch and render notes on page load
getAndRenderNotes();
