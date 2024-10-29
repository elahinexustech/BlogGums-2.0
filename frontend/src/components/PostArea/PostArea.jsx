import React, { Component } from 'react'

// Components
import UILoader from '../../components/UILoader/UILoader'
import Post from '../Post/Post'

class PostArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],        // Store fetched posts
            page: 1,          // Current page number
            hasMore: true,    // To track if more posts are available
            loading: false,   // To track loading state
            error: null       // To track any errors during fetching
        };
    }

    componentDidMount() {
        this.getPosts(this.state.page); // Fetch posts when the component mounts
    }

    // Fetch posts from API
    getPosts = async (page = 1) => {
        let token = localStorage.getItem("ACCESS_TOKEN");

        this.setState({ loading: true, error: null }); // Set loading state and reset errors

        try {
            let response = await fetch(`http://127.0.0.1:8000/blogs/get/?page=${page}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                let resp = await response.json();
                this.setState((prevState) => ({
                    posts: [...prevState.posts, ...resp.results], // Append new posts
                    hasMore: !!resp.next,                        // Set hasMore based on response
                    loading: false
                }));
            } else {
                console.log("Error Fetching Posts:", response.statusText);
                this.setState({ error: "Error fetching posts", loading: false });
            }
        } catch (error) {
            console.log("Error:", error);
            this.setState({ error: "An error occurred while fetching posts.", loading: false });
        }
    };

    // Load more posts
    loadMorePosts = () => {
        const { hasMore, loading } = this.state;
        if (hasMore && !loading) {
            this.setState(
                (prevState) => ({ page: prevState.page + 1 }),
                () => this.getPosts(this.state.page)
            );
        }
    };

    render() {
        const { posts, hasMore, loading, error } = this.state;

        return (
            <div className='container flex direction-col'>
                <h2 className="grey text-center">Featured Blogs</h2>
                <br />

                {/* Display fetched posts here */}
                <div className="flex direction-col">
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <Post
                                key={post.id}  // Assuming each post has a unique 'id' field
                                ID={post.id}
                                author={post.author}
                                postTitle={post.title}
                                postContent={post.content}
                            />
                        ))
                    ) : (
                        <p className="text-center">No posts available at the moment.</p>
                    )}
                </div>
                <br />

                {/* Load more button */}
                {hasMore && !loading && (
                    <button onClick={this.loadMorePosts}>Load More</button>
                )}

                {/* Show loader when loading */}
                {loading && <UILoader />}

                {/* Show error if there's any */}
                {error && <p className="text-center error">{error}</p>}
            </div>
        );
    }
}

export default PostArea;
