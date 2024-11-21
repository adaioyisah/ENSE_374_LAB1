/** 
{
    "Note-Vote-Login": [
        { "email": "adai@a.com", "password": "aAnunaki" },
        { "email": "yisah@a.com", "password": "yAnunaki" },
        { "email": "israel@a.com", "password": "iAnunaki" }
    ],
    "Note-Vote-Signup": [
        { "email": "adai@a.com", "password": "aAnunaki", "invite-code": "Bunker1" },
        { "email": "yisah@a.com", "password": "yAnunaki", "invite-code": "Bunker2" },
        { "email": "israel@a.com", "password": "iAnunaki", "invite-code": "Bunker3" }
    ]
}
**/
const mongoose = require('mongoose');

// Define User schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    inviteCode: String // only for signup records
});

module.exports = mongoose.model('User', userSchema);