import React, { useState, useEffect, useCallback, useContext } from 'react';
import NavigationMenu from '../../components/NavigationMenu/NavigationMenu';
import UILoader from '../../components/UILoader/UILoader';
import MarkdownViewer from './MDDisplayer';
import Post from '../../components/Post/Post';
import LikeButton from '../../components/LikeButton/LikeButton';
import LabelField from '../../components/LabelField/LabelField';
import { BLOG_FONT_SIZE } from '../../_CONSTS_';
import { FSContext } from '../../Context/useFontSize';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import './post.css';


import postCmnt from '../../Functions/PostComment';

// Utility function to format the date
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

const PostView = ({ id, user }) => {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCommentBox, setShowCommentBox] = useState(false)
    const [fontSize, setFontSize] = useState(localStorage.getItem(BLOG_FONT_SIZE) || '1rem');
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

    const getOtherPost = async () => {
        const token = localStorage.getItem("ACCESS_TOKEN");
        const refreshToken = localStorage.getItem("REFRESH_TOKEN");

        if (!token || !refreshToken) {
            setError("Authentication tokens are missing.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/blogs/more_post`, {
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

    const postComment = async (data) => {
        data.postId = parseInt(id);

        try {
            const response = await postCmnt(data);

            // Refetch the post details
            await getPostDetails();
        } catch (error) {
            console.error("Error posting comment:", error);
        }
    };

    useEffect(() => {
        getPostDetails();
        getOtherPost();
    }, [getPostDetails]);

    return (
        <FSContext.Provider value={{ fontSize, setFontSize }}>
            <NavigationMenu />
            {loading && <UILoader />}
            {error && <p className='error'>Error: {error}</p>}
            {post && (
                <div className="post-container flex jc-start">
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
                        setPost((prevPost) => ({
                            ...prevPost,
                            total_likes: likeCount,
                        }));
                    }}
                />

                <span aria-label="comments" className="flex direction-col">
                    <button
                        className="transparent"
                        onClick={() => {
                            setShowCommentBox((prev) => !prev);
                        }}
                    >
                        <i className="bi bi-chat caption"></i>
                    </button>
                    <p className="grey caption">{post?.total_comments}</p>
                </span>

                <div className={`commentBox obj-trans ${showCommentBox ? "active" : ""} flex direction-col jc-start ai-start`}>
                    <p className="heading grey">Let's Chat</p>
                    {post && post.post && post.total_comments > 0 ? (
                        <>
                            <h3>Comments ({post.total_comments})</h3>
                            <div className="comments-section">
                                {post.comments.map((comment, index) => (
                                    <div key={index} className="comment obj">
                                        <section className='flex jc-start'>
                                            <img src={comment.user.profile_image_url} className="profile-picture size-icon" />
                                            <span>
                                                <Link to={`/${comment.user.username}`} className='grey caption'>{comment.user.username}</Link>
                                                <p className=''>{comment.user.first_name} {comment.user.last_name}</p>
                                            </span>
                                        </section>
                                        <pre>{comment.comment}</pre>
                                        <br />
                                        <span className="grey caption">{new Date(comment.created_at).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <p className="subtitle">No Comments yet!</p>
                    )}
                    <form className='flex' onSubmit={handleSubmit(postComment)}>
                        <textarea
                            id="comment_field"
                            placeholder="Let's comment"
                            {...register("comment_field", { required: "Cant post empty comments!" })}>

                        </textarea>
                        <button className="theme circle" disabled={loading ? true : false}>
                            <i className="bi bi-send-check-fill"></i>
                        </button>
                    </form>

                </div>

            </aside>

            <div className="container otherPost flex direction-col">
                <br />
                {otherPost?.posts && otherPost?.posts.length > 0 ? (
                    <>
                        <h2>More blogs from {post?.post?.author?.first_name}</h2>
                        <br />
                        <div className="flex direction-col">
                            {otherPost?.posts.map(post => (
                                <Post
                                    key={post.id}  // Assuming each post has a unique 'id' field
                                    ID={post.id}
                                    post={truncateContent(post)}
                                    author={post.author}  // Spread the post object to pass all attributes as props
                                    totalLikes={post.total_likes} // If you want to specifically pass total likes
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <p className='heading'>No more posts available.</p>
                )}

            </div>
        </FSContext.Provider >
    );
};

export default PostView;
