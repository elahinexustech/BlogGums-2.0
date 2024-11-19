import React, { useState, useEffect, useCallback, useContext } from 'react';
import NavigationMenu from '../../components/NavigationMenu/NavigationMenu';
import UILoader from '../../components/UILoader/UILoader';
import MarkdownViewer from './MDDisplayer';
import LikeButton from '../../components/LikeButton/LikeButton';
import { BLOG_FONT_SIZE } from '../../_CONSTS_';
import { FSContext } from '../../Context/useFontSize';
import { Link } from 'react-router-dom';
import './post.css';

// Utility function to format the date
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

const PostView = ({ id, user }) => {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [fontSize, setFontSize] = useState(localStorage.getItem(BLOG_FONT_SIZE) || '1rem');

    // Fetch post details function with useCallback for memoization
    const getPostDetails = useCallback(async () => {
        const token = localStorage.getItem("ACCESS_TOKEN");
        const refreshToken = localStorage.getItem("REFRESH_TOKEN");

        if (!token || !refreshToken) {
            setError("Authentication tokens are missing.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/blogs/post/${id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ refresh: refreshToken }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const postData = await response.json();
            setPost(postData);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        getPostDetails();
    }, [getPostDetails]);

    return (
        <FSContext.Provider value={{ fontSize, setFontSize }}>
            <NavigationMenu />
            {loading && <UILoader />}
            {error && <p className='error'>Error: {error}</p>}
            {post && (
                <div className="post-container flex">
                    <div className="post-area obj" style={{ fontSize }}>
                        <h1 className='title'>{post.post.title}</h1>
                        <p className="grey">
                            <i>{formatDate(post.post.published_at)}</i>&nbsp; <br />
                            By <Link className='colored' to={`/${post.post.author.username}`}>{post.post.author.username}</Link>
                        </p>
                        <MarkdownViewer markdownText={post.post.content} />
                    </div>
                </div>
            )}

            <aside className='obj flex ai-start direction-col'>
                <LikeButton
                    postId={post?.post.id}
                    initialLikes={post?.total_likes}
                    hasLiked={post?.liked_by_this_user}
                    onLikeChange={(likeCount) => {
                        console.log(post.initialLikes)
                        setPost((prevPost) => ({
                            ...prevPost,
                            total_likes: likeCount,
                        }));
                    }}
                />

                <span aria-label='comments' className='flex direction-col'>
                    <button className="transparent">
                        <i className="bi bi-chat caption"></i>
                    </button>
                    <p className="grey caption">{post?.total_comments}</p>
                </span>
            </aside>

            <div className="container flex">
                <h2>More blogs from {post?.post.author.first_name}</h2>

            </div>
        </FSContext.Provider>
    );
};

export default PostView;
