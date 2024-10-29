import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import './post.css'

const Post = ({
    author,
    postTitle,
    postContent,
    ID
}) => {
    const [openMenuId, setOpenMenuId] = useState(null); // State to track which post's menu is open
    const [hasLiked, sethasLiked] = useState(false);

    const navigate = useNavigate();


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


    const renderPost = (id) => {
        navigate(`/post/${id}`);
    }

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
        <div className='post obj' onClick={() => { renderPost(ID) }}>
            <section className="header flex jc-spb">
                <section className="left flex">
                    <img src={author.profile_image_url} className="post-header-img" alt={`${author.username}'s profile`} />&nbsp;&nbsp;
                    <section className='username-section'>
                        <p className="heading">{author.first_name} {author.last_name}</p>
                        <a className="caption grey">@{author.username}</a>
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
                <section
                    id={`optionMenu-${ID}`}
                    className={`optionMenu ${openMenuId === ID ? 'showMenu' : ''}`}
                >
                    <p className="caption grey">More options</p>
                    <br /><hr /><br />
                    <ul>
                        <li>About this post</li>
                        <li>Follow User</li>
                        <li>Translate</li>
                        <li>View in Full</li>
                        <br /><hr /><br />
                        <li className='error'>Remove post from your feed</li>
                        <li className='error'>Report Author</li>
                    </ul>
                </section>
            </section>

            <br /><br />
            <section className="body">
                <h2>{postTitle}</h2>
                <br />
                <ReactMarkdown className='postContent'>
                    {postContent}
                </ReactMarkdown>
            </section>
            <br /><br />
            <section className="foot flex">
                <button className='transparent' onClick={async () => {
                    // Toggle `hasLiked` state
                    this.setState((prevState) => ({ hasLiked: !prevState.hasLiked }));

                    // Call `AddLike` to get the updated like count
                    const like_count = await AddLike(post.post.id);

                    // Update the `total_likes` in `post`
                    this.setState((prevState) => ({
                        post: {
                            ...prevState.post,
                            total_likes: like_count
                        }
                    }));
                }}>
                    {hasLiked ?
                        <i className="bi bi-heart-fill caption"></i> :
                        <i className="bi bi-heart caption"></i>
                    }
                </button>
                <i className="bi bi-hand-thumbs-up"></i>
                <i className="bi bi-chat-quote"></i>
                <i className="bi bi-share-fill"></i>
            </section>
        </div>
    );
};

export default Post;
