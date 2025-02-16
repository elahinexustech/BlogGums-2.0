import React, { useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import { AuthContext } from '../AuthUser/AuthProvider.jsx';
import MarkdownViewer from '../MarkdownViewer/MarkdownViewer';
import { Helmet } from 'react-helmet';
import './post.css';
import { Link } from 'react-router-dom';
import postCmnt from '../../Functions/PostComment';
import OptionMenu from '../PostOptionMenu/PostOptionMenu.jsx';


// Components
import LikeButton from '../LikeButton/LikeButton';
import CommentBox from '../CommentBox/CommentBox';
import { NotificationsContext } from '../Notifications/Notifications.jsx';

import { ACCESS_TOKEN, BASE_URL } from '../../_CONSTS_.js';

const Post = ({ ID, author, post, totalLikes, changeTitle = true, setPost }) => {

    const { isAuthenticated, userData } = useContext(AuthContext);
    const { addNotification } = useContext(NotificationsContext);
    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false); // New state variable for loading state
    const [openMenuId, setOpenMenuId] = useState(null); // State to track which post's menu is open
    const [postMode, setPostMode] = useState('viewing');
    const [title, setTitle] = useState(post.title);
    const [content, setContent] = useState(post.content);
    const CURRENT_USER_STATE_VAR = isAuthenticated && userData?.user?.username === author.username;


    const postComment = async (data) => {
        data.postId = parseInt(ID);

        try {
            const response = await postCmnt(data);
            if (response.status === 200) {
                const resp = response;
                setPost((prevPosts) =>
                    prevPosts.map((post) => {
                        if (post.id === response.blog_id) {
                            return {
                                ...post,
                                comments: response.comments,
                                total_comments: response.total_comments
                            };
                        }
                        return post;
                    })
                );
                setLoading(false);
            }


        } catch (error) {
            console.error("Error posting comment:", error);
        }
    };

    const toggleMenu = (e, id) => {
        e.stopPropagation();
        if (openMenuId === id) {
            setOpenMenuId(null); // Close the menu if it's already open
        } else {
            setOpenMenuId(id); // Open the clicked menu
        }
    };

    const handleClickOutside = (event) => {
        // Find the menu element
        const optionMenu = document.querySelector(`#optionMenu-${ID}`);
        const button = document.querySelector(`#menuButton-${ID}`);

        // Check if click is inside the menu or the button
        if (
            optionMenu && !optionMenu.contains(event.target) &&
            button && !button.contains(event.target)
        ) {
            setOpenMenuId(null); // Close the menu if clicked outside
        }
    };

    const editPost = async () => {
        setIsSaving(true); // Set loading state to true
        try {
            let r = await fetch(`${BASE_URL}/blogs/post/edit`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${Cookies.get(ACCESS_TOKEN)}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ post_id: ID, title: title, content: content })
            });
            if (r.ok) {
                setPostMode('viewing');
                setPost((prevPosts) =>
                    prevPosts.map((prevPost) =>
                        prevPost.id === ID
                            ? { ...prevPost, title: title, content: content }
                            : prevPost
                    )
                );
                addNotification('Post updated successfully', 'success');
            }
        } catch (error) {
            console.error("Error editing post:", error);
        } finally {
            setIsSaving(false); // Set loading state to false
        }
    };


    // Add event listener to detect clicks outside the menu
    useEffect(() => {
        if (openMenuId !== null) {
            window.addEventListener('click', handleClickOutside);
        }

        // Cleanup event listener on unmount or when the menu is closed
        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, [openMenuId]);

    if (!author || !post) {
        return null; // Return null if author or post is not defined
    }

    return (
        <>
            {changeTitle && <Helmet>
                <title>{post.title} by {author.first_name} {author.last_name} • BlogGums</title>
            </Helmet>}
            <div className='post obj'>
                <section className="header flex jc-spb">
                    <section className="left flex">
                        <img src={author.profile_image_url || './imgs/default_pic.png'} className="post-header-img" alt={`${author.username}'s profile`} />&nbsp;&nbsp;
                        <section className='username-section'>
                            <p className="heading">{author.first_name} {author.last_name}</p>
                            <Link className='caption colored' to={`/${author.username}`}>@{author.username}</Link>
                        </section>
                    </section>
                    <section className="right">
                        <button
                            id={`menuButton-${ID}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleMenu(e, ID);
                            }}
                            className="transparent circle"
                        >
                            <i className="bi bi-three-dots-vertical"></i>
                        </button>
                    </section>

                    <OptionMenu item={post} openMenuId={openMenuId} CURRENT_USER_STATE_VAR={CURRENT_USER_STATE_VAR} setPostMode={setPostMode} />
                </section>

                <br /><br />

                <section className="body">
                    {postMode === 'editing' ? (
                        <>
                            <input
                                type="text"
                                value={title || ""}
                                onChange={(e) => setTitle(e.target.value)}
                                className="subtitle"
                            />
                            <br />
                            <textarea
                                value={content || ""}
                                onChange={(e) => setContent(e.target.value)}
                                className="editor"
                            />
                        </>
                    ) : (
                        <>
                            <h2 className='subtitle'>{post.title}</h2>
                            <br />
                            <MarkdownViewer className="grey" markdownText={post.content} />
                        </>
                    )}
                </section>

                <br /><br />

                <section className="foot flex ai-start">
                    {postMode === 'editing' ? (
                        <>
                            <button
                                className={`success ${isSaving ? 'loader' : ''}`}
                                onClick={editPost}
                                disabled={isSaving} // Disable button while saving
                            >
                                {isSaving ? 'Saving...' : 'Save'}
                            </button>
                            &nbsp;&nbsp;
                            <button
                                className="error"
                                onClick={() => setPostMode('viewing')}
                                disabled={isSaving} // Disable button while saving
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <LikeButton
                                postId={ID}
                                initialLikes={totalLikes}
                                hasLiked={post.has_liked}
                                onLikeChange={(likeCount, liked) => {
                                    setPost((prevPosts) =>
                                        prevPosts.map((prevPost) =>
                                            prevPost.id === ID
                                                ? { ...prevPost, total_likes: likeCount, has_liked: liked }
                                                : prevPost
                                        )
                                    );
                                }}
                                disabled={!isAuthenticated}
                            />

                            <CommentBox post={post} postComment={postComment} loading={loading} disabled={!isAuthenticated} />
                        </>
                    )}
                </section>
            </div>
        </>
    );
};

export default Post;
