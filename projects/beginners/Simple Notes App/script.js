const noteInput = document.getElementById("note-input");
const addBtn = document.getElementById("add-btn");
const clearBtn = document.getElementById("clear-btn");
const notesList = document.getElementById("notes-list");

// Load notes from localStorage
let notes = JSON.parse(localStorage.getItem("notes")) || [];
displayNotes();

// Add Note
addBtn.addEventListener("click", () => {
  const note = noteInput.value.trim();
  if (note === "") return alert("Please write a note!");
  
  notes.push(note);
  localStorage.setItem("notes", JSON.stringify(notes));
  noteInput.value = "";
  displayNotes();
});

// Clear All Notes
clearBtn.addEventListener("click", () => {
  if (!confirm("Are you sure you want to delete all notes?")) return;
  notes = [];
  localStorage.setItem("notes", JSON.stringify(notes));
  displayNotes();
});

// Display Notes
function displayNotes() {
  notesList.innerHTML = "";
  notes.forEach((note, index) => {
    const div = document.createElement("div");
    div.className = "note-item";
    div.innerHTML = `
      ${note}
      <button onclick="deleteNote(${index})">Delete</button>
    `;
    notesList.appendChild(div);
  });
}

// Delete a note
function deleteNote(index) {
  notes.splice(index, 1);
  localStorage.setItem("notes", JSON.stringify(notes));
  displayNotes();
}
