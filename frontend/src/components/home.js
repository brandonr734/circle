import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../scss/main.scss';
import Post from './post.js'

function Home() {

  const [postContent, setPostContent] = useState('');
  const [posts, setPosts] = useState([]);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content: postContent }),
      });
  
      if (response.ok) {
        const newPost = await response.json();
        setPosts(prevPosts => [newPost, ...prevPosts]);
        setPostContent('');
      } else {
        console.error('Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        if (response.ok) {
          const fetchedPosts = await response.json();
          console.log(fetchedPosts)
          setPosts(fetchedPosts);
        } else {
          console.error('Failed to fetch posts');
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="col-8 kc-page">
      <div className="card p-2">
        <div className="card-body">
          <div className="row g-1">
            <div className="col-12 col-md-8 mb-0 px-2">
              <h4 className="mx-1 mb-1">Posts</h4>
              <div id="pc-post-list-container" className="p-2 screen-height mobile-scroll">
                <div className="card-body">
                  {posts.map((post) => (
                    <Post
                      _id={post._id}
                      message={post.content}
                      user_name={post.author.tag}
                      user_icon={post.author.icon}
                      display_name={post.author.display_name}
                      time={new Date(post.createdAt).toLocaleTimeString()}
                      reply_count={post.replies}
                      repost_count={post.reposts}
                      likes={post.likes}
                      image={post.image}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4 mb-4 px-2">
              <h4 className="mx-1 mb-1">Account</h4>
              <div className="p-2">
                <div className="card-body">
                  <h6 className="mx-1 mb-1">Create a Post</h6>
                  <div>
                    <textarea className="form-control no-resize" style={{ height: "10rem" }} placeholder="Enter message..." value={postContent} onChange={(e) => setPostContent(e.target.value)} />
                  </div>
                  <div className="d-flex justify-content-center pt-2">
                    <button className="btn-pill" onClick={handleSubmit}>
                      <div className="d-flex align-items-center justify-content-center" style={{ width: "80px" }}>Post</div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
