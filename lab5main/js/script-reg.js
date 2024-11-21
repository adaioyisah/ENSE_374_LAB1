$(document).ready(function() {
    // Array of users
    let users = ["User A", "User B", "User C"];
    // Set the initial user to the first user in the array
    let currentUser = users[0];
    // Array to store notes
    let notes = [];

    // Event handler for switching users when a dropdown item is clicked
    $(".dropdown-item").click(function() {
        currentUser = $(this).data("user"); // Update the current user based on the selected item
        $("#loggedInUser").text(`Logged in as ${currentUser}`); // Update the displayed logged-in user
        updateView(); // Refresh the view with the new user
    });

    // Event handler for adding a new note
    $("#addNote").click(function() {
        let noteText = $("#noteInput").val(); // Get the input note text
        if (noteText) { // Check if the input is not empty
            // Create a new note object
            let note = {
                id: notes.length + 1, // Assign a unique ID
                creator: currentUser, // Set the creator to the current user
                text: noteText, // Set the note text
                upvotes: [], // Initialize upvotes array
                downvotes: [] // Initialize downvotes array
            };
            notes.push(note); // Add the note to the notes array
            $("#noteInput").val(''); // Clear the input field
            updateView(); // Refresh the view to display the new note
        }
    });

    // Function to update the view based on the notes array
    function updateView() {
        $("#notesList").empty(); // Clear the current notes display
        notes.forEach((note) => {
            // Check if the current user can vote on the note (not the creator)
            let canVote = note.creator !== currentUser;
            // Check if the user has already voted on the note
            let userVoted = note.upvotes.includes(currentUser) || note.downvotes.includes(currentUser);
            // Calculate the score based on upvotes and downvotes
            let score = note.upvotes.length - note.downvotes.length;

            // Template for the note element
            let noteElement = `
                <div class="note d-flex justify-content-between align-items-center">
                    <span>${note.text} (by ${note.creator})</span>
                    <div class="d-flex align-items-center">
                        <button class="upvote btn btn-outline-success btn-sm me-2" data-id="${note.id}" ${canVote ? '' : 'disabled'}>⬆️</button>
                        <button class="downvote btn btn-outline-danger btn-sm me-2" data-id="${note.id}" ${canVote ? '' : 'disabled'}>⬇️</button>
                        ${userVoted || note.creator === currentUser ? `<span class="score">${score}</span>` : ''}
                    </div>
                </div>
            `;
            // Add the note element to the notes list
            $("#notesList").append(noteElement);
        });

        // Attach event handlers for upvote buttons
        $(".upvote").click(function() {
            let noteId = $(this).data("id"); // Get the note ID from the button's data attribute
            handleVote(noteId, 'upvote'); // Call the handleVote function for an upvote
        });

        // Attach event handlers for downvote buttons
        $(".downvote").click(function() {
            let noteId = $(this).data("id"); // Get the note ID from the button's data attribute
            handleVote(noteId, 'downvote'); // Call the handleVote function for a downvote
        });
    }

    // Function to handle voting (upvotes and downvotes)
    function handleVote(noteId, type) {
        // Find the note object in the notes array by ID
        let note = notes.find(n => n.id === noteId);
        if (type === 'upvote') {
            // If the user already upvoted, remove the upvote
            if (note.upvotes.includes(currentUser)) {
                note.upvotes = note.upvotes.filter(user => user !== currentUser);
            } else {
                // If the user hasn't upvoted, remove any downvote and add the upvote
                note.downvotes = note.downvotes.filter(user => user !== currentUser);
                note.upvotes.push(currentUser);
            }
        } else { // Handle downvote
            // If the user already downvoted, remove the downvote
            if (note.downvotes.includes(currentUser)) {
                note.downvotes = note.downvotes.filter(user => user !== currentUser);
            } else {
                // If the user hasn't downvoted, remove any upvote and add the downvote
                note.upvotes = note.upvotes.filter(user => user !== currentUser);
                note.downvotes.push(currentUser);
            }
        }
        updateView(); // Refresh the view to reflect the vote changes
    }

    // Initial setup to populate the view on page load
    updateView();
});