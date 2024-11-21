(async () => {
    // Import mongoose
    const mongoose = require("mongoose");

    // Connect to MongoDB
    try {
        await mongoose.connect("mongodb://localhost:27017/notevotes", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB.");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        return;
    }

    // Define User schema
    const userSchema = new mongoose.Schema({
        email: String,
        password: String,
        inviteCode: String,
    });

    // Define Post schema
    const postSchema = new mongoose.Schema({
        text: String,
        creator: { email: String, password: String },
        upvotes: [Object],
        downvotes: [Object],
    });

    // Create Mongoose models
    const User = mongoose.model("User", userSchema);
    const Post = mongoose.model("Post", postSchema);

    // Data to populate
    const usersData = [
        { email: "adai@a.com", password: "aAnunaki", inviteCode: "Bunker1" },
        { email: "yisah@a.com", password: "yAnunaki", inviteCode: "Bunker2" },
        { email: "israel@a.com", password: "iAnunaki", inviteCode: "Bunker3" },
    ];

    const postsData = [
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

    try {
        // Insert Users
        const users = await User.insertMany(usersData);
        console.log("Users saved successfully:", users);

        // Insert Posts
        const posts = await Post.insertMany(postsData);
        console.log("Posts saved successfully:", posts);
    } catch (err) {
        console.error("Error during data insertion:", err);
    } finally {
        // Close the connection
        try {
            await mongoose.connection.close(); // Updated to use await
            console.log("Database connection closed.");
        } catch (closeErr) {
            console.error("Error while closing the database connection:", closeErr);
        }
    
    }
})();