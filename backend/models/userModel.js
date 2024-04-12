const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  tag: { type: String, required: true },
  display_name: { type: String, required: true},
  password: { type: String },
  email: { type: String},
  icon: { type: String},
  createdAt: { type: Date, default: Date.now },
  liked_posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
