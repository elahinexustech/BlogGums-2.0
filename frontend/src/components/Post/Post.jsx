import React, { useState, useEffect } from 'react';
import MarkdownViewer from '../../Pages/PostView/MDDisplayer';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import './post.css'

// Components
import LikeButton from '../LikeButton/LikeButton';
import OptionMenu from '../PostOptionMenu/OptionMenu';
import { USER_DATA } from '../../_CONSTS_';

const Post = ({ ID, author, post, totalLikes, changeTitle = true, setPost }) => {
    const [openMenuId, setOpenMenuId] = useState(null); // State to track which post's menu is open
    const loggedInUser = JSON.parse(localStorage.getItem(USER_DATA)); // Get current logged-in user
    const CURRENT_USER_STATE_VAR = loggedInUser.user.username === author.username; // Check if the current user is the author of the post


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

                <section className="foot flex">
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


                    <button className='icon'>
                        <i onClick={() => { renderPost(ID) }} className="bi bi-book-half"></i>
                    </button>
                </section>
            </div >
        </>
    );
};

export default Post;
