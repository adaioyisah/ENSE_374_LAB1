// authRoutes.js - Handles user registration and login.

const express = require('express');
const router = express.Router();
const { loadData, saveData } = require('../dataManager');
const User = require('../models/userModel');

const USERS_FILE = './data/users.json';

// Route for user login
router.post('/login', (req, res) => {
    const usersData = loadData(USERS_FILE)["Note-Vote-Login"]; // Accessing the specific "Note-Vote-Login" array
    const { username, password } = req.body;
    const user = usersData.find(u => u.email === username && u.password === password);
    
    if (user) {
        // Redirect to note-vote page if login is successful
        res.redirect(307, '/note-vote');
    } else {
        // Send a failure message if credentials are incorrect
        res.send("Invalid credentials, please try again.");
    }
});

// Route for user registration
router.post('/register', (req, res) => {
    const usersData = loadData(USERS_FILE)["Note-Vote-Signup"]; // Accessing the "Note-Vote-Signup" array
    const { username, password, inviteCode } = req.body;

    // Check if the invite code is correct and username is unique
    if (inviteCode === "Note Vote 2024" && !usersData.find(u => u.email === username)) {
        const newUser = new User(username, password);
        usersData.push(newUser);
        saveData(USERS_FILE, { "Note-Vote-Signup": usersData }); // Update only the "Note-Vote-Signup" part of the JSON
        
        // Redirect to the note-vote page after successful registration
        res.redirect(307, '/note-vote');
    } else {
        // Inform the user if the invite code is invalid or username is taken
        res.send("Invalid invite code or username already taken.");
    }
});

module.exports = router;

