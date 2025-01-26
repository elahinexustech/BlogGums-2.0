import React, { useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext } from '../../components/AuthUser/AuthProvider';
import Cookies from 'js-cookie'
import UILoader from '../../components/UILoader/UILoader';
import LoginWindow from '../../components/LoginWindow/LoginWindow';
import Post from '../../components/Post/Post';
import { ACCESS_TOKEN, BLOG_FONT_SIZE, REFRESH_TOKEN, SERVER, PORT } from '../../_CONSTS_';
import { FSContext } from '../../Context/useFontSize';

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
    const { isAuthenticated } = useContext(AuthContext);
    const [loginWin, setLoginWin] = useState(false);




    // Fetch post details function with useCallback for memoization
    const getPostDetails = useCallback(async () => {
        const token = Cookies.get(ACCESS_TOKEN);
        const refreshToken = Cookies.get(REFRESH_TOKEN);

        try {
            const response = await fetch(`${BASE_URL}/blogs/post/${id}`, {
                method: token && refreshToken ? 'POST' : 'GET',
                headers: token && refreshToken ? {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                } : undefined,
                body: token && refreshToken ? JSON.stringify({ refresh: refreshToken }) : undefined,
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
        if(isAuthenticated) getOtherPost();
    }, [getPostDetails]);

    return (
        <FSContext.Provider value={{ fontSize, setFontSize }}>
            {loading && <UILoader />}
            {!isAuthenticated && <>

                <LoginWindow isOpen={loginWin} onClose={()=> {setLoginWin(false)}} />

                <span className="warning flex direction-col obj-trans" style={{position: 'fixed', right: '5%', top:'50%', transform: 'translateY(-50%)', padding: '1rem', borderRadius: 'var(--border-radius)', width: '200px', minHeight: '200px'}}>
                    <i className="bi bi-exclamation-triangle-fill warning"></i> &nbsp;
                    <p className="text warning">Login to interact with the application</p>
                    <br />
                    <button className='caption' onClick={()=> {
                        setLoginWin(true)
                    }}>Login Here</button>
                </span>
            </>}
            {post && (
                <div className="post-container flex">
                    <Post
                        ID={post.post.id}
                        post={post.post}
                        author={post.post.author}
                        totalLikes={post.total_likes}
                        setPost={setPost}
                    />
                </div>
            )}


            <div className="otherPost content-container flex direction-col">
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
                                    post={post}
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
