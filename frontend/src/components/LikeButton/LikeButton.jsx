import React, { useState, useEffect } from 'react';
import { AddLike } from '../../Functions/AddLike';

const LikeButton = ({ postId, initialLikes = 0, hasLiked, onLikeChange }) => {
    const [liked, setLiked] = useState(hasLiked);
    const [totalLikes, setTotalLikes] = useState(initialLikes);

    const handleLikeToggle = async () => {
        setLiked((prev) => !prev); // Toggle the local liked state

        try {
            const likeCount = await AddLike(postId); // Get updated like count
            setTotalLikes(likeCount); // Update total likes
            onLikeChange(likeCount); // Notify parent component about the like change
        } catch (error) {
            console.error('Error adding like:', error);
            setLiked((prev) => !prev); // Revert the liked state on error
        }
    };

    return (
        <span aria-label='likes' className='flex direction-col'>
            <button className='transparent icon' onClick={handleLikeToggle}>
                {liked ? (
                    <i className="bi bi-heart-fill caption"></i>
                ) : (
                    <i className="bi bi-heart caption"></i>
                )}
            </button>
            <p className="grey caption">{totalLikes}</p>
        </span>
    );
};

export default LikeButton;