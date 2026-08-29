const todoList = document.querySelector(".todo-list");
const modalOverlay = document.querySelector("#modal-overlay");
const addNoteButton = document.querySelector(".todo-form__submit");
const newNoteInput = document.querySelector(".todo-form__input");
const noteEditorModal = document.querySelector("#note-editor-modal");
const noteTitleModal = document.querySelector("#note-title-modal");
const noteEditorInput = document.querySelector("#note-editor-input");
const noteTitleInput = document.querySelector("#note-title-input");
const saveNoteEditButton = document.querySelector("#save-note-edit");
const cancelNoteEditButton = document.querySelector("#cancel-note-edit");
const saveNoteTitleButton = document.querySelector("#save-note-title");
const cancelNoteTitleButton = document.querySelector("#cancel-note-title");
const loginButton = document.querySelector(".login-button");

let selectedNote = null;
const notes = [];

function addNote(event) {
  event.preventDefault();

  const text = newNoteInput.value.trim();

  if (!text) {
    return;
  }

  const note = { text, title: "" };
  notes.push(note);
  selectedNote = note;
  newNoteInput.value = "";

  modalOverlay.classList.remove("is-hidden");
  noteTitleModal.classList.remove("is-hidden");
}

function saveNoteTitle() {
  const title = noteTitleInput.value.trim();

  if (!title || !selectedNote) {
    return;
  }

  selectedNote.title = title;
  createNote(selectedNote);
  noteTitleInput.value = "";
  hideNoteTitleModal();
  

  fetch("/tareas", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        title: selectedNote.title,
        description: selectedNote.text
    })
});
}

function createNote(note) {
  const noteElement = document.createElement("div");
  noteElement.classList.add("todo-item");

  const noteTitle = document.createElement("h3");
  noteTitle.classList.add("todo-item__title");
  noteTitle.textContent = note.title;

  const noteContent = document.createElement("textarea");
  noteContent.classList.add("todo-item__content");
  noteContent.value = note.text;
  noteContent.addEventListener("click", () => showNoteEditor(note));

  const completeButton = document.createElement("button");
  completeButton.type = "button";
  completeButton.classList.add("todo-item__complete-button");
  completeButton.innerHTML = '<span class="material-symbols-outlined">check_box</span>';

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.classList.add("todo-item__delete-button");
  deleteButton.innerHTML = '<span class="material-symbols-outlined">delete</span>';
  deleteButton.addEventListener("click", () => deleteNote(note, noteElement));

  noteElement.append(noteTitle, completeButton, noteContent, deleteButton);
  todoList.appendChild(noteElement);

  note.contentElement = noteContent;
}

function showNoteEditor(note) {
  selectedNote = note;
  noteEditorInput.value = note.text;
  modalOverlay.classList.remove("is-hidden");
  noteEditorModal.classList.remove("is-hidden");
}

function saveNoteEdit() {
  if (!selectedNote) {
    return;
  }

  selectedNote.text = noteEditorInput.value;
  selectedNote.contentElement.value = noteEditorInput.value;
  hideNoteEditor();
}

function deleteNote(note, noteElement) {
  const noteIndex = notes.indexOf(note);

  if (noteIndex !== -1) {
    notes.splice(noteIndex, 1);
  }

  noteElement.remove();
}

function hideNoteEditor() {
  modalOverlay.classList.add("is-hidden");
  noteEditorModal.classList.add("is-hidden");
  selectedNote = null;
}

function hideNoteTitleModal() {
  modalOverlay.classList.add("is-hidden");
  noteTitleModal.classList.add("is-hidden");
  selectedNote = null;
}

function goToLogin(event) {
  event.preventDefault();
  window.location.assign("/login");
}

addNoteButton.addEventListener("click", addNote);
saveNoteTitleButton.addEventListener("click", saveNoteTitle);
saveNoteEditButton.addEventListener("click", saveNoteEdit);
cancelNoteEditButton.addEventListener("click", hideNoteEditor);
cancelNoteTitleButton.addEventListener("click", hideNoteTitleModal);
loginButton.addEventListener("click", goToLogin);
