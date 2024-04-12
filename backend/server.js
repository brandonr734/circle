const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Post = require('./models/postModel');
const User = require('./models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://admin:xbUQzB8qP4K6KupYPamD@k-circle.ugrvhsw.mongodb.net/?retryWrites=true&w=majority&appName=k-circle', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Assuming the token is sent in the Authorization header as "Bearer <token>"
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).send({ message: 'Authentication failed' });
    }

    req.user = user;
    next();
    console.log("ok")
  } catch (error) {
    return res.status(401).send({ message: 'Authentication failed', error: error.message });
  }
};

// Endpoint to submit a new post
app.post('/api/posts', authenticate, async (req, res) => {
  try {
    const { content } = req.body;
    
    const post = new Post({
      content,
      author: req.user._id,
    });

    await post.save();
    res.status(201).send(post);
  } catch (error) {
    res.status(500).send({ message: 'Creating post failed', error: error.message });
  }
});

// Like post endpoint
app.post('/api/posts/:id/like', authenticate, async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send({ message: 'Post not found' });
    }

    const user = req.user;
    if (!user.liked_posts.includes(postId)) {
      user.liked_posts.push(postId);
      await user.save();
    }

    post.likes = post.likes + 1;
    await post.save();

    res.status(200).send({ likes: post.likes });
  } catch (error) {
    res.status(500).send({ message: 'Error liking the post', error: error.message });
  }
});

// Unlike post endpoint
app.post('/api/posts/:id/unlike', authenticate, async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send({ message: 'Post not found' });
    }

    const user = req.user;
    if (user.liked_posts.includes(postId)) {
      user.liked_posts = user.liked_posts.filter(item => item.toString() !== postId);
      await user.save();
    }

    post.likes = post.likes - 1;
    await post.save();

    res.status(200).send({ likes: post.likes });
  } catch (error) {
    res.status(500).send({ message: 'Error liking the post', error: error.message });
  }
});



// Endpoint to get all posts
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 })
    .populate('author', 'icon tag display_name replies reposts likes');
    res.status(200).send(posts);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Endpoint to create a new user
app.post('/api/users', async (req, res) => {
  const { tag, display_name, password, email, icon } = req.body;

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = new User({
    tag,
    display_name,
    password: hashedPassword,
    email,
    icon,
  });

  try {
    await user.save();
    res.status(201).send({ ...user._doc, password: undefined });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({ message: 'Login failed' });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ message: 'Login failed' });
    }

    // Generate a token
    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

    const userTag = user.tag;
    const display_name = user.display_name;
    const icon = user.icon;
    const id = user._id;
    const liked_posts = user.liked_posts;

    // Send the token
    res.send({ token, userTag, display_name, icon , id, liked_posts});
  } catch (error) {
    res.status(500).send({ message: 'Server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
