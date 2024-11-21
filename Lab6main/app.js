
const express = require("express");

const fs = require("fs");

const path = require("path");

// Create an instance of Express
const app = express();
// Define the port for the server
const PORT = 3000;


app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

// Route for the login page 

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "note-vote-login.html"));
});

// Handle login form submission (POST request to /login)
app.post("/login", (req, res) => {

    const { loginEmail, loginPassword } = req.body;

    
    fs.readFile(path.join(__dirname, "data", "users.json"), "utf8", (err, data) => {
        // Handle file read error
        if (err) {
            console.error("Error reading users file:", err);
            return res.status(500).send("Server error: Unable to read user data");
        }
        //const user = users.find(user => user.email === loginEmail && user.password === loginPassword);
        try {
            const users = JSON.parse(data)["Note-Vote-Login"];
            let userFound = false;  // Flag to check if user is found

            for (let i = 0; i < users.length; i++) {
                if (users[i].email === loginEmail && users[i].password === loginPassword) {
                    userFound = true;
                    break;  // Exit loop if user is found
                }
            }

            if (userFound) {
                res.redirect("/register");
            } else {
                res.redirect("/?error=invalid_credentials");
            }
        } catch (err) {
            // Handle JSON parsing errors
            console.error("Error parsing JSON:", err);
            res.status(500).send("Server error: Invalid data format");
        }
    });
});

app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "note-vote-register.html"));
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});