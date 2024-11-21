
const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const noteVoteRoutes = require('./routes/noteVoteRoutes');
const path = require('path');

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set("view engine", "ejs");

// Root route for landing page
app.get('/', (req, res) => {
    res.render('index'); // Renders views/index.ejs as the main page
});

// Use imported routes
app.use(authRoutes);
app.use(noteVoteRoutes);

// Handle undefined routes
app.use((req, res) => {
    res.status(404).send("Page not found");
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

