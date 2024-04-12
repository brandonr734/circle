import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../scss/main.scss';
import { useParams, useLocation } from 'react-router-dom';
import { useUser } from './providers/usercontext.js';
import Post from './post.js';

function PostPage() {

    const { postid } = useParams();
    console.log(postid)
    const location = useLocation();
    console.log(location);
    const post_data = location.state?.post_data;
    console.log(post_data);

    const [like_count, setLikeCount] = useState(post_data.likes);
    const { user } = useUser();
    const [user_liked, setUserLiked] = useState(false);
    const [likedActionTrigger, setLikedActionTrigger] = useState(false);

    const handleLike = async () => {
        if (!user_liked) {
            setLikeCount(like_count + 1);
            setUserLiked(true);
            try {
                const response = await fetch(`/api/posts/${post_data.id}/like`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                    },
                });
                if (response.ok) {
                    const updatedPost = await response.json();
                    user.liked_posts.push(post_data.id);
                    setLikeCount(updatedPost.likes);
                    setLikedActionTrigger(!likedActionTrigger);
                } else {
                    console.error('Failed to like post');
                    setLikeCount(like_count);
                }
            } catch (error) {
                console.error('Error liking post:', error);
                setLikeCount(like_count);
            }
        }
        else {
            setLikeCount(like_count - 1);
            setUserLiked(false);
            try {
                const response = await fetch(`/api/posts/${post_data.id}/unlike`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                    },
                });
                if (response.ok) {
                    const updatedPost = await response.json();
                    user.liked_posts = user.liked_posts.filter(item => item !== post_data.id);
                    console.log('removed');
                    console.log('removed id :', post_data.id);
                    console.log('liked posts:');
                    console.log(user.liked_posts);
                    setLikeCount(updatedPost.likes);
                    setLikedActionTrigger(!likedActionTrigger);
                } else {
                    console.error('Failed to like post');
                    setLikeCount(like_count);
                }
            } catch (error) {
                console.error('Error liking post:', error);
                setLikeCount(like_count);
            }
        }
    };

    useEffect(() => {
        if (user && user.liked_posts.includes(post_data.id)) {
            setUserLiked(true);
        } else {
            setUserLiked(false);
        }
    }, [user, post_data.id, likedActionTrigger]);

    return (
        <div className="col-6 kc-page">
            <div className="card p-2">
                <div className="card-body">
                    <div className="container-fluid">
                        <div className="">
                            <div id="pc-post-list-container" className="p-2 screen-height mobile-scroll">
                                <div className="card-body">
                                    <div className="container-fluid" L>
                                        <div id="posts-row-1" className="row">
                                            <div id="kc-posts" className="col">
                                                <div className="kc-panel mb-2 p-2 w-100">
                                                    <div className="d-flex mx-1">
                                                        <div className="kc-user-icon">
                                                            <img src={post_data.user_icon}></img>
                                                        </div>
                                                        <div className="px-2">
                                                            <div>
                                                                <span> {post_data.display_name}</span>
                                                            </div>
                                                            <div>
                                                                <span>@{post_data.user_name}</span>
                                                            </div>
                                                            <div className="pt-1">
                                                                <div>
                                                                    <span>{post_data.message}</span>
                                                                </div>
                                                                {post_data.image ? <div className="py-2"><img className="kc-post-image" style={{ width: "22rem" }} src={post_data.image}></img></div> : null}
                                                            </div>
                                                            <div className="d-flex justify-content-between w-75 pt-1">
                                                                <div>
                                                                    <button className="btn d-flex py-0 ps-0"><i className="bi bi-chat pe-1"></i> {post_data.reply_count}</button>
                                                                </div>
                                                                <div>
                                                                    <button className="btn d-flex py-0"><i className="bi bi-repeat pe-1"></i> {post_data.repost_count}</button>
                                                                </div>
                                                                <div>
                                                                    <button className="btn d-flex py-0" onClick={handleLike}> {user_liked ? <i class="bi bi-heart-fill pe-1"></i> : <i className="bi bi-heart pe-1"></i>} {like_count}</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <textarea className="form-control no-resize"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
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

export default PostPage;