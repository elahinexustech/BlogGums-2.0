import React, { useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie'
import UILoader from '../../components/UILoader/UILoader';
import Post from '../../components/Post/Post';
import { ACCESS_TOKEN, BLOG_FONT_SIZE, REFRESH_TOKEN, SERVER, PORT } from '../../_CONSTS_';
import { FSContext } from '../../Context/useFontSize';
import { useForm } from 'react-hook-form';
import postCmnt from '../../Functions/PostComment';

import './post.css';

const BASE_URL = (SERVER && PORT) ? `${SERVER}:${PORT}` : '/choreo-apis/bloggums/backend/v1';

// Utility function to format the date
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

const PostView = () => {
    const id = window.location.href.split('/').pop();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [fontSize, setFontSize] = useState(Cookies.get(BLOG_FONT_SIZE) || '1rem');
    const [otherPost, setOtherPost] = useState(null);
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm();


    const truncateContent = (post, wordLimit = 150) => {
        let content = post.content;

        // Ensure content is a string
        if (typeof content === 'string') {
            const words = content.split(' ');

            // Check if the content has more words than the word limit
            if (words.length > wordLimit) {
                // Truncate the content to the word limit and join the words back into a string
                const truncatedContent = words.slice(0, wordLimit).join(' ') + '...';
                post.content = truncatedContent; // Update post.content with the truncated content
            }
        } else {
            console.error('Content is not a valid string.');
        }

        return post;
    }



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



    // Fetch post details function with useCallback for memoization
    const getPostDetails = useCallback(async () => {
        const token = Cookies.get(ACCESS_TOKEN);
        const refreshToken = Cookies.get(REFRESH_TOKEN);

        if (!token || !refreshToken) {
            setError("Authentication tokens are missing.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/blogs/post/${id}`, {
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

    const getOtherPost = async () => {
        const token = Cookies.get(ACCESS_TOKEN);
        const refreshToken = Cookies.get(REFRESH_TOKEN);

        if (!token || !refreshToken) {
            setError("Authentication tokens are missing.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/blogs/more_post`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ refresh: refreshToken, 'current_post': parseInt(id) }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const postData = await response.json();
            setOtherPost(postData);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getPostDetails();
        getOtherPost();
    }, [getPostDetails]);

    return (
        <FSContext.Provider value={{ fontSize, setFontSize }}>
            {loading && <UILoader />}
            {error && <p className='error'>Error: {error}</p>}
            {post && (
                <div className="container flex">
                    <Post
                        ID={post.post.id}
                        post={post.post}
                        author={post.post.author}
                        totalLikes={post.total_likes}
                        setPost={setPost}
                    />
                </div>
            )}


            <div className="container otherPost flex direction-col">
                <br />
                {otherPost?.posts && otherPost?.posts.length > 0 ? (
                    <>
                        <h2>More blogs from {post?.post?.author?.first_name}</h2>
                        <br />
                        <div className="flex direction-col">
                            {otherPost?.posts.map(post => (
                                <Post
                                    key={post.id}
                                    ID={post.id}
                                    post={truncateContent(post)}
                                    author={post.author}
                                    totalLikes={post.total_likes}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <p className='heading'>No more posts available.</p>
                )}
            </div>
        </FSContext.Provider>
    );
};

export default PostView;
