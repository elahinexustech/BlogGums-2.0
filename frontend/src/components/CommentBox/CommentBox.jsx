import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import './commentbox.css';

const CommentBox = ({ post, postComment, loading, disabled }) => {


    const [showCommentBox, setShowCommentBox] = useState(false);
    const commentBoxRef = useRef(null);
    const buttonRef = useRef(null);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm();


    return (
        <div className='comment-section-container flex direction-col'>
            <div aria-label="comments" className="flex direction-col">
                <button
                    ref={buttonRef}
                    className="transparent"
                    onClick={() => {
                        setShowCommentBox((prev) => !prev);
                    }}
                >
                    <i className="bi bi-chat caption"></i>
                </button>
                <p className="grey caption">{post?.total_comments}</p>
            </div>

            <div ref={commentBoxRef} className={`obj commentBox ${showCommentBox ? "active" : ""} flex direction-col jc-start ai-start`}>
                {post?.comments?.length > 0 && (
                    <div className="comments-section">
                        {post.comments.map((comment, index) => (
                            <div key={index} className="comment">
                                <section className='flex jc-start'>
                                    <img src={comment.user.profile_image_url} className="profile-picture size-icon" />
                                    <span>
                                        <Link to={`/${comment.user.username}`} className='grey caption'>{comment.user.username}</Link>
                                        <p className='caption'>{comment.user.first_name} {comment.user.last_name}</p>
                                    </span>
                                </section>
                                <br />
                                <p className=''>{comment.comment}</p>
                                <br />
                                <span className="grey caption">{new Date(comment.created_at).toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                )}
                
                {disabled && <><p className='warning caption'>Warning: Please login first</p></>}

                <form className="flex obj-trans" onSubmit={handleSubmit(postComment)}>
                    <textarea
                        id="comment_field"
                        placeholder="Let's comment"
                        disabled={loading || disabled}
                        {...register("comment_field", { required: "Can't post empty comments!" })}
                    ></textarea>
                    <button
                        type="submit"
                        className="theme circle"
                        disabled={loading || disabled}
                    >
                        <i className="bi bi-send-check-fill"></i>
                    </button>
                </form>

            </div>
        </div>
    );
};

export default CommentBox;