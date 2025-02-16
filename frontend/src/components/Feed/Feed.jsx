import React, { useState, useEffect } from 'react';
import UILoader from '../UILoader/UILoader';
import Post from '../Post/Post';
import './feed.css';
import Cookies from 'js-cookie';


// Import environment variables
import {
    BASE_URL,
    ACCESS_TOKEN,
} from '../../_CONSTS_';


const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        getPosts(page);
    }, [page]);

    const getPosts = async (page = 1) => {
        const token = Cookies.get(ACCESS_TOKEN);
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${BASE_URL}/blogs/get/?page=${page}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                const resp = await response.json();
                if (Array.isArray(resp.data)) {
                    setPosts((prevPosts) => [...prevPosts, ...resp.data]);
                    setHasMore(!!resp.next);
                } else {
                    setError("Unexpected response structure from the server.");
                }
            } else {
                setError("Error fetching posts");
            }
        } catch (error) {
            setError("An error occurred while fetching posts.");
        } finally {
            setLoading(false);
        }
    };

    const loadMorePosts = () => {
        if (hasMore && !loading) setPage((prevPage) => prevPage + 1);
    };

    return (
        <div className="container flex direction-col">
            <div className="flex direction-col post-container">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <Post key={post.id} ID={post.id} post={post} author={post.author} totalLikes={post.total_likes} changeTitle={false} setPost={setPosts} />
                    ))
                ) : (
                    <p className="text-center">No posts available at the moment.</p>
                )}
            </div>
            <br />
            {!loading && hasMore && <button onClick={loadMorePosts}>Load More</button>}
            {loading && <UILoader />}
            {error && <p className="text-center error">{error}</p>}
        </div>
    );
};

export default Feed;
