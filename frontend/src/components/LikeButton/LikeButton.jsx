import React, { useState } from 'react';
import { AddLike } from '../../Functions/AddLike';

const LikeButton = ({ postId, initialLikes = 0, hasLiked, onLikeChange, disabled }) => {
    const [liked, setLiked] = useState(hasLiked);
    const [totalLikes, setTotalLikes] = useState(initialLikes);

    const handleLikeToggle = async () => {
        const newLikedState = !liked;
        setLiked(newLikedState); // Toggle the local liked state

        try {
            const likeCount = await AddLike(postId); // Get updated like count
            setTotalLikes(likeCount); // Update total likes
            onLikeChange(likeCount, newLikedState); // Notify parent component about the like and liked state change
        } catch (error) {
            console.error('Error adding like:', error);
            setLiked((prev) => !prev); // Revert the liked state on error
        }
    };


    return (
        <span aria-label='likes' className='flex direction-col'>
            <button className='transparent icon' onClick={handleLikeToggle} disabled={disabled}>
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