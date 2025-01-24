import React, { useState, useEffect } from 'react';
import MarkdownViewer from '../MarkdownViewer/MarkdownViewer';
import { Helmet } from 'react-helmet';
import './post.css';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import postCmnt from '../../Functions/PostComment';

// Components
import LikeButton from '../LikeButton/LikeButton';
import CommentBox from '../CommentBox/CommentBox';
import OptionMenu from '../PostOptionMenu/OptionMenu';


// Import environment variables
const USER_DATA = import.meta.env.VITE_USER_DATA;



const Post = ({ ID, author, post, totalLikes, changeTitle = true, setPost }) => {
    const [loading, setLoading] = useState(false);
    const [openMenuId, setOpenMenuId] = useState(null); // State to track which post's menu is open
    const loggedInUser = Cookies.get(USER_DATA) ? JSON.parse(Cookies.get(USER_DATA)) : null; // Get current logged-in user
    const CURRENT_USER_STATE_VAR = loggedInUser && author ? loggedInUser.user.username === author.username : false; // Check if the current user is the author of the post

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

                    {/* Option Menu that only shows for the specific post */}
                    <OptionMenu item={post} openMenuId={openMenuId} CURRENT_USER_STATE_VAR={CURRENT_USER_STATE_VAR} />

                </section>

                <br /><br />

                <section className="body">
                    <h2 className='subtitle'>{post.title}</h2>
                    <br />
                    <MarkdownViewer className="grey" markdownText={post.content} />
                </section>

                <br /><br />

                <section className="foot flex ai-start">
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
                    />

                    <CommentBox post={post} postComment={postComment} loading={loading} />

                </section>
            </div >
        </>
    );
};

export default Post;
