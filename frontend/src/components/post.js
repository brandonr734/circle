import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../scss/main.scss';
import { useUser } from './providers/usercontext.js';

function Post({ _id, display_name, user_name, user_icon, message, time, reply_count, repost_count, likes, image }) {

    const [like_count, setLikeCount] = useState(likes);
    const { user } = useUser();
    const [user_liked, setUserLiked] = useState(false);
    const [likedActionTrigger, setLikedActionTrigger] = useState(false);

    const handleLike = async () => {
        if (!user_liked) {
            setLikeCount(like_count + 1);
            setUserLiked(true);
            try {
                const response = await fetch(`/api/posts/${_id}/like`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                    },
                });
                if (response.ok) {
                    const updatedPost = await response.json();
                    user.liked_posts.push(_id);
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
                const response = await fetch(`/api/posts/${_id}/unlike`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                    },
                });
                if (response.ok) {
                    const updatedPost = await response.json();
                    user.liked_posts = user.liked_posts.filter(item => item !== _id);
                    console.log('removed');
                    console.log('removed id :', _id);
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
        if (user && user.liked_posts.includes(_id)) {
            setUserLiked(true);
        } else {
            setUserLiked(false);
        }
    }, [user, _id, likedActionTrigger]);

    return (
        <Link to={`/post/${_id}`} state={{ post_data: { _id, display_name, user_name, user_icon, message, time, reply_count, repost_count, likes, image } }} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="container-fluid" L>
                <div id="posts-row-1" className="row">
                    <div id="kc-posts" className="col">
                        <div className="kc-panel mb-2 p-2 w-100">
                            <div className="d-flex mx-1">
                                <div className="kc-user-icon">
                                    <img src={user_icon}></img>
                                </div>
                                <div className="px-2">
                                    <div>
                                        <span> {display_name}</span>
                                        <span className="px-1">@{user_name}</span>
                                        <span style={{ fontSize: ".8rem" }} className="pe-1">•</span>
                                        <span>{time}</span>
                                    </div>
                                    <div className="pt-1">
                                        <div>
                                            <span>{message}</span>
                                        </div>
                                        {image ? <div className="py-2"><img className="kc-post-image" style={{ width: "22rem" }} src={image}></img></div> : null}
                                    </div>
                                    <div className="d-flex justify-content-between w-75 pt-1">
                                        <div>
                                            <button className="btn d-flex py-0 ps-0"><i className="bi bi-chat pe-1"></i> {reply_count}</button>
                                        </div>
                                        <div>
                                            <button className="btn d-flex py-0"><i className="bi bi-repeat pe-1"></i> {repost_count}</button>
                                        </div>
                                        <div>
                                            <button className="btn d-flex py-0" onClick={handleLike}> {user_liked ? <i class="bi bi-heart-fill pe-1"></i> : <i className="bi bi-heart pe-1"></i>} {like_count}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default Post;
