// postModel.js
class Post {
    constructor(id, text, creator, upvotes = [], downvotes = []) {
        this._id = id;
        this.text = text;
        this.creator = creator;
        this.upvotes = upvotes;
        this.downvotes = downvotes;
    }
}

module.exports = Post;