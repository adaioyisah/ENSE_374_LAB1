

// Import necessary libraries
const express = require("express");
// Bring in mongoose
const mongoose = require("mongoose");


// connects to the "test" database (ensure mongod is running!)
// the later arguments fix some deprecation warnings
//mongoose.connect( 'mongodb://localhost:27017/games');


mongoose.connect("mongodb://localhost:27017/note-vote", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Canonical alias to make app configuration easier
const app = express();
// Define the port for the server
const port = 3000;

// Middleware for parsing URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Set EJS as the view engine for rendering views
app.set("view engine", "ejs");

// Mongoose schema for Users
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    inviteCode: String, //users registering with invite codes
});


// Mongoose schema for Notes
const noteSchema = new mongoose.Schema({
    text: String,
    creator: { email: String, password: String }, // Creator info
    upvotes: [Object], // List of users who upvoted
    downvotes: [Object], // List of users who downvoted
});

// Mongoose models for Users and Notes
const User = mongoose.model("User", userSchema);
const Note = mongoose.model("Note", noteSchema);

// Simple server operation
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Serve static files like CSS and client-side JavaScript
app.use(express.static("public"));

// GET route for login page
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/login_notevote.html");
});

// POST route for login form submission
app.post("/login", async (req, res) => {
    const { loginEmail, loginPassword } = req.body;

    try {
        // Check if the user exists in the database
        //const user = await User.findOne({ email: loginEmail, password: loginPassword });

        const users = await User.find(); // Fetch all users from the database
let user = null;

for (let i = 0; i < users.length; i++) {
    if (users[i].email === loginEmail && users[i].password === loginPassword) {
        user = users[i];
        break; // Exit the loop once a match is found
    }}
       if (user) {
            // If login is successful, redirect to the register page
            console.log(`User logged in: ${loginEmail}`);
            res.sendFile(__dirname + "/register_notevote.html");
        } else {
            // If login fails, display an error
            console.log("Invalid login credentials");
            res.send("Invalid email or password. Please try again.");
        }
    } catch (error) {
        console.log("Error during login:", error);
        res.send("An error occurred during login.");
    }
});

// POST route for registration form submission
app.post("/register", async (req, res) => {
    const { registerEmail, registerPassword, inviteCode } = req.body;

    try {
        // Create a new user and save it in the database
        const newUser = new User({
            email: registerEmail,
            password: registerPassword,
            inviteCode: inviteCode,
        });

        await newUser.save();
        console.log(`New user registered: ${registerEmail}`);
        res.send("Registration successful! You can now log in.");
    } catch (error) {
        console.log("Error during registration:", error);
        res.send("An error occurred during registration.");
    }
});

// Helper route for populating initial data (only run this once)
app.get("/populate", async (req, res) => {
    try {
        // Populate users from the JSON file
        const usersData = [
            { email: "adai@a.com", password: "aAnunaki", inviteCode: "Bunker1" },
            { email: "yisah@a.com", password: "yAnunaki", inviteCode: "Bunker2" },
            { email: "israel@a.com", password: "iAnunaki", inviteCode: "Bunker3" },
        ];

        await User.insertMany(usersData);

        // Populate notes from the JSON file
        const notesData = [
            {
                text: "Alexander the Great had conquered half the world by age 25",
                creator: { email: "adai@a.com", password: "aAnunaki" },
                upvotes: [],
                downvotes: [],
            },
            {
                text: "Adolf Hitler lost to General August in St Petersburg",
                creator: { email: "adai@a.com", password: "aAnunaki" },
                upvotes: [{ email: "yisah@a.com", password: "yAnunaki" }],
                downvotes: [],
            },
            {
                text: "Cleopatra was originally from Macedonia",
                creator: { email: "adai@a.com", password: "aAnunaki" },
                upvotes: [],
                downvotes: [{ email: "yisah@a.com", password: "yAnunaki" }],
            },
        ];

        await Note.insertMany(notesData);

        console.log("Initial data populated successfully");
        res.send("Data populated successfully!");
    } catch (error) {
        console.log("Error populating data:", error);
        res.send("An error occurred while populating data.");
    }
});
