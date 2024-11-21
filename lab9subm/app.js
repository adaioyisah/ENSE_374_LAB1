// Require modules
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const session = require("express-session");
require("dotenv").config();

// Create Epress app
const app = express();
const port = 3000;

// Middleware setup
app.use(express.static("public")); // Serve static files
app.use(express.urlencoded({ extended: true })); // Parse POST data
app.set("view engine", "ejs"); // Set EJS as the view engine

// Session and Passport setup
app.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.initialize());
app.use(passport.session());

// DB connection
mongoose.connect("mongodb://localhost:27017/noteVoteDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Schems and Models
// User schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);

// Post schems
const postSchema = new mongoose.Schema({
    text: String,
    creator: String,
    upvotes: { type: [String], default: [] },
    downvotes: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model("Post", postSchema);

// Passport setup
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes
// Home/login page
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// User registration
app.post("/register", (req, res) => {
    const { username, password, inviteCode } = req.body;

    console.log("Registering user:", username, "with invite code:", inviteCode);

    if (inviteCode !== process.env.INVITE_CODE) {
        console.log("Invalid invite code.");
        return res.redirect("/"); // Invalid invite code
    }

    User.register({ username }, password, (err, user) => {
        if (err) {
            console.log("Error registering user:", err);
            return res.redirect("/");
        }

        passport.authenticate("local")(req, res, () => {
            console.log("Registration successful. Redirecting to /note-vote...");
            res.redirect("/note-vote");
        });
    });
});

// User login
app.post("/login", (req, res, next) => {
    console.log("Attempting to log in user:", req.body.username);

    passport.authenticate("local", (err, user, info) => {
        if (err) {
            console.log("Authentication error:", err);
            return next(err); // Pass the error to error-handling middleware
        }
        if (!user) {
            console.log("Authentication failed: Invalid username or password.");
            return res.redirect("/"); // Redirect to the login page on failure
        }
        req.login(user, (err) => {
            if (err) {
                console.log("Error logging in:", err);
                return next(err); // Pass the error to error-handling middleware
            }
            console.log("Login successful! Redirecting to /note-vote.");
            return res.redirect("/note-vote"); // Redirect to the authenticated page
        });
    })(req, res, next);
});

// Note-vote page (authenticated route)
app.get("/note-vote", async (req, res) => {
    if (!req.isAuthenticated()) {
        console.log("User not authenticated. Redirecting to /.");
        return res.redirect("/");
    }

    try {
        const posts = await Post.find();
        console.log("Rendering posts:", posts);
        res.render("partials/posts", { username: req.user.username, posts });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).send("Error fetching posts.");
    }
});

// Add new post
app.post("/add-post", async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/");
    }

    const newPost = new Post({
        text: req.body.text,
        creator: req.user.username,
    });

    try {
        await newPost.save();
        res.redirect("/note-vote");
    } catch (error) {
        console.log("Error adding post:", error);
        res.status(500).send("Error adding post.");
    }
});

// Upote a post
app.post("/upvote", async (req, res) => {
    const { postId } = req.body;

    try {
        const post = await Post.findById(new mongoose.Types.ObjectId(postId));

        if (post) {
            post.downvotes = post.downvotes.filter((user) => user !== req.user.username);

            if (!post.upvotes.includes(req.user.username)) {
                post.upvotes.push(req.user.username);
            }

            await post.save();
        }

        res.redirect("/note-vote");
    } catch (error) {
        console.log("Error upvoting post:", error);
        res.status(500).send("Error upvoting post.");
    }
});

// Downvot a post
app.post("/downvote", async (req, res) => {
    const { postId } = req.body;

    try {
        const post = await Post.findById(new mongoose.Types.ObjectId(postId));

        if (post) {
            post.upvotes = post.upvotes.filter((user) => user !== req.user.username);

            if (!post.downvotes.includes(req.user.username)) {
                post.downvotes.push(req.user.username);
            }

            await post.save();
        }

        res.redirect("/note-vote");
    } catch (error) {
        console.log("Error downvoting post:", error);
        res.status(500).send("Error downvoting post.");
    }
});

// Logout
app.post("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            console.log("Logout error:", err);
            return res.redirect("/");
        }
        res.redirect("/");
    });
});

// for Starting server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
