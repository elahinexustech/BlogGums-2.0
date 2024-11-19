import React, { useState, useEffect } from 'react';

// Components
import UILoader from '../UILoader/UILoader';
import Post from '../Post/Post';

const Feed = () => {
  const [posts, setPosts] = useState([]);          // Store fetched posts
  const [page, setPage] = useState(1);             // Current page number
  const [hasMore, setHasMore] = useState(true);    // To track if more posts are available
  const [loading, setLoading] = useState(false);   // To track loading state
  const [error, setError] = useState(null);        // To track any errors during fetching

  useEffect(() => {
    getPosts(page); // Fetch posts when the component mounts
  }, [page]);

  // Fetch posts from API
  const getPosts = async (page = 1) => {
    const token = localStorage.getItem("ACCESS_TOKEN");

    setLoading(true);
    setError(null); // Reset errors before new request

    try {
      const response = await fetch(`http://127.0.0.1:8000/blogs/get/?page=${page}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const resp = await response.json();
        console.log("API Response:", resp); // Log the full response for debugging

        // Access the posts from resp.data
        if (Array.isArray(resp.data)) {
          const newPosts = resp.data.map(item => ({
            ...item,                // Use item directly since it's already structured correctly
            total_likes: item.total_likes // Include total_likes from the response
          }));

          setPosts((prevPosts) => [...prevPosts, ...newPosts]); // Append new posts
          setHasMore(!!resp.next); // Adjust if your API supports pagination
        } else {
          console.error("Unexpected response structure:", resp);
          setError("Unexpected response structure from the server.");
        }
      } else {
        console.log("Error Fetching Posts:", response.statusText);
        setError("Error fetching posts");
      }
    } catch (error) {
      console.log("Error:", error);
      setError("An error occurred while fetching posts.");
    } finally {
      setLoading(false); // Stop loading once request completes
    }
  };


  // Load more posts
  const loadMorePosts = () => {
    if (hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className="container flex direction-col">
      <h2 className="title fancy grey text-center">Feed</h2>
      <br />

      {/* Display fetched posts here */}
      <div className="flex direction-col">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Post
              key={post.id}  // Assuming each post has a unique 'id' field
              ID={post.id}
              post={post}
              author={post.author}  // Spread the post object to pass all attributes as props
              totalLikes={post.total_likes} // If you want to specifically pass total likes
            />
          ))
        ) : (
          <p className="text-center">No posts available at the moment.</p>
        )}
      </div>
      <br />

      {/* Load more button */}
      {hasMore && !loading && (
        <button onClick={loadMorePosts}>Load More</button>
      )}

      {/* Show loader when loading */}
      {loading && <UILoader />}

      {/* Show error if there's any */}
      {error && <p className="text-center error">{error}</p>}
    </div>
  );
};

export default Feed;
