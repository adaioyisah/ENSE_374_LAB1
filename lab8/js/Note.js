/*** 
 * [
    {
        "_id": 1,
        "text": "Alexander the Great had conquered half the world by age 25",
        "creator": { "username": "adai@a.com", "password": "aAnunaki" },
        "upvotes": [],
        "downvotes": []
    },
    {
        "_id": 2,
        "text": "Adolf Hitler lost to General August in St Petersburg",
        "creator": { "username": "adai@a.com", "password": "aAnunaki" },
        "upvotes": [{ "username": "yisah@a.com", "password": "yAnunaki" }],
        "downvotes": []
    },
    {
        "_id": 3,
        "text": "Cleopatra was originally from Macedonia",
        "creator": { "username": "adai@a.com", "password": "aAnunaki" },
        "upvotes": [],
        "downvotes": [{ "username": "yisah@a.com", "password": "yAnunaki" }]
    }
]

*****/

const mongoose = require('mongoose');

// Define Note schema
const noteSchema = new mongoose.Schema({
    text: { type: String, required: true },
    creator: {
email: { type: String, required: true }, password: String
    },
    upvotes: [{ email: String, password: String }],
    downvotes: [{ email: String, password: String }]
});

module.exports = mongoose.model('Note', noteSchema);