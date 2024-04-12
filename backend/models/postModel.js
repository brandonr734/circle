const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  replies: { type: Number, default: 0},
  reposts: { type: Number, default: 0},
  likes: { type: Number, default: 0},
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
