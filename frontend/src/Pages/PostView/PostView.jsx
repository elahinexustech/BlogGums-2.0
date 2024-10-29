import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import NavigationMenu from '../../components/NavigationMenu/NavigationMenu';
import UILoader from '../../components/UILoader/UILoader';
import MarkdownViewer from './MDDisplayer';
import { extractHeadingsFromMarkdown } from './convertor';


// functions
import { AddLike } from '../../Functions/AddLike';

import './post.css';

class PostView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            post: null,
            loading: true,
            error: null,
            user: props.user, // This will now correctly receive the user prop
            hasLiked: false,
            headings: []
        };
    }

    componentDidMount() {
        this.getPostDetails();
    }

    fetchHeadings = async () => {
        if (this.state.post) {
            const content = this.state.post.post.content;
            const extractedHeadings = await extractHeadingsFromMarkdown(content);
            this.setState({ headings: extractedHeadings });
        }
    };
    
    
    getPostDetails = async () => {
        const { id } = this.props;
        const token = localStorage.getItem("ACCESS_TOKEN");
        const refreshToken = localStorage.getItem("REFRESH_TOKEN");
    
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
    
            const post = await response.json();
    
            this.setState({ 
                post, 
                hasLiked: post.liked_by_this_user 
            }, this.fetchHeadings); // Call fetchHeadings after setting state
        } catch (error) {
            this.setState({ error: error.message });
        } finally {
            this.setState({ loading: false });
        }
    };
    

    render() {
        const { post, loading, error, user, hasLiked, headings } = this.state;
        return (
            <>
                <NavigationMenu />

                {loading && <UILoader />}

                {error && <p className='error'>Error: {error}</p>}

                {post && (
                    <>
                        <div className="post-container flex">
                            <div className="post-area obj">
                                <h1>{post.post.title}</h1>
                                <br />
                                <hr />
                                <br />
                                <MarkdownViewer markdownText={post.post.content} />
                            </div>
                        </div>

                        <aside className='obj flex ai-start direction-col'>
                            <span aria-label='likes' className='flex direction-col'>
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
                                <p className="grey caption">{post.total_likes}</p>
                            </span>

                            <span aria-label='comments' className='flex direction-col'>
                                <button className="transparent">
                                    <i className="bi bi-chat caption"></i>
                                </button>
                                <p className="grey caption">{post.total_comments}</p>
                            </span>
                        </aside>


                        <div className="container flex">
                            <h2>More blogs from {post.post.author.first_name}</h2>
                        </div>

                        <section className="topics flex direction-col ai-start obj">
                            <p className="caption grey">Topics in this blog</p>
                            <br /><hr /><br />
                            {headings.map((heading) => (
                                    <a key={heading.id} href={`#${heading.id}`} className='heading'>{heading.text}</a>
                            ))}
                        </section>


                    </>
                )}
            </>
        );
    }
}

export default PostView;
