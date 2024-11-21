// noteVoteRoutes.js - Handles note voting, post addition, and displaying the Note-Vote page.

const express = require('express');
const router = express.Router();
const { loadData, saveData } = require('../dataManager');
const Post = require('../models/postModel');
const User = require('../models/userModel');

const POSTS_FILE = './data/posts.json';
const USERS_FILE = './data/users.json';

// Route to render the main Note-Vote page
router.get('/note-vote', (req, res) => {
    const posts = loadData(POSTS_FILE); // Load posts data from JSON
    const username = req.query.username || "Guest"; // Default to "Guest" if username is not provided
    res.render('noteVote', { posts, username });
});

// Route to handle voting on posts
router.post('/vote', (req, res) => {
    const posts = loadData(POSTS_FILE);
    const { postId, username, voteType } = req.body;
    const post = posts.find(p => p._id === parseInt(postId));
    const users = loadData(USERS_FILE)["Note-Vote-Login"]; // Access users for voting

    const user = users.find(u => u.email === username);

    if (post && user) {
        if (voteType === "upvote") {
            const alreadyUpvoted = post.upvotes.some(u => u.email === username);
            post.upvotes = alreadyUpvoted
                ? post.upvotes.filter(u => u.email !== username) // Remove upvote if already upvoted
                : [...post.upvotes, user]; // Add upvote
            post.downvotes = post.downvotes.filter(u => u.email !== username); // Remove downvote if exists
        } else if (voteType === "downvote") {
            const alreadyDownvoted = post.downvotes.some(u => u.email === username);
            post.downvotes = alreadyDownvoted
                ? post.downvotes.filter(u => u.email !== username) // Remove downvote if already downvoted
                : [...post.downvotes, user]; // Add downvote
            post.upvotes = post.upvotes.filter(u => u.email !== username); // Remove upvote if exists
        }

        // Save updated posts
        saveData(POSTS_FILE, posts);
    }

    res.redirect(307, '/note-vote');
});

// Route to add a new post
router.post('/add-post', (req, res) => {
    const posts = loadData(POSTS_FILE);
    const { username, text } = req.body;
    const users = loadData(USERS_FILE)["Note-Vote-Signup"]; // Use the signup array to identify users
    const user = users.find(u => u.email === username);

    if (user && text.trim()) { // Ensure the post text is not empty
        const newPost = new Post(posts.length + 1, text, user); // Create a new Post instance
        posts.push(newPost); // Add the new post to the array
        
        // Save the new post
        saveData(POSTS_FILE, posts);
    }

    res.redirect(307, '/note-vote');
});

module.exports = router;