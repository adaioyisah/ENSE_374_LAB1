const colors = ['#ff7eb9', '#ff65a3', '#7afcff', '#feff9c', '#fff740'];
let currentColorIndex = 0;
const notesContainer = document.getElementById('notes-container');

// Add event listener to the Post button
document.getElementById('post-note').addEventListener('click', function() {
    const title = document.getElementById('note-title').value;
    const content = document.getElementById('note-content').value;

    if (title && content) {
        addNoteToView(title, content);
        document.getElementById('note-title').value = ''; // Clear form
        document.getElementById('note-content').value = '';
    } else {
        alert('Please fill out both fields.');
    }
});

function addNoteToView(title, content) {
    // Create new note element
    const noteCard = document.createElement('div');
    noteCard.classList.add('col-sm-3', 'note', 'card');
    noteCard.style.backgroundColor = colors[currentColorIndex];

    currentColorIndex = (currentColorIndex + 1) % colors.length; // Rotate colors

    noteCard.innerHTML = `
        <div class="note-title">${title}</div>
        <div>${content}</div>
        <button class="burn-btn">&#128293;</button>
    `;

    // Add event listener to the burn (delete) button
    noteCard.querySelector('.burn-btn').addEventListener('click', function() {
        notesContainer.removeChild(noteCard); // Remove note from DOM
    });

    // Add the new note to the notes container
    notesContainer.appendChild(noteCard);
}