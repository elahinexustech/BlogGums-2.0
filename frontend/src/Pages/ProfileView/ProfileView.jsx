import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NavigationMenu from '../../components/NavigationMenu/NavigationMenu';
import { USER } from '../../Functions/GetUser';
import { useNavigate } from 'react-router-dom';
import MarkdownViewer from '../PostView/MDDisplayer';
import UILoader from '../../components/UILoader/UILoader';
import './style.css';
import PIC from './pic.png'; // Default profile picture
import GetPosts from '../../Functions/GetPost';
import { USER_DATA } from '../../_CONSTS_';

const ProfileView = () => {
    const navigate = useNavigate();
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [post, setPost] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [newDetails, setNewDetails] = useState({});
    const [showLargeImage, setShowLargeImage] = useState(false);
    const [pressTimer, setPressTimer] = useState(null); // Timer for detecting long press
    const [clicked, setClicked] = useState(false); // Track if it's a quick click
    const loggedInUser = JSON.parse(localStorage.getItem(USER_DATA)); // Get current logged-in user
    const CURRENT_USER_STATE_VAR = loggedInUser.user.username === username;



    const handleMouseDown = () => {
        setClicked(false); // Reset click state on mouse down
        setPressTimer(setTimeout(() => {
            setShowLargeImage(true); // Show large image after holding
        }, 500)); // Time threshold for "press and hold"
    };

    const handleMouseUp = () => {
        clearTimeout(pressTimer); // Clear the press timer on mouse up
        if (!clicked) {
            setClicked(true); // Mark as clicked if it's a quick release
            handleImageDoubleClick(); // Trigger the double click behavior for a quick click
        }
    };


    const fetchUserData = async () => {
        setLoading(true);
        const data = await USER(username);
        if (data) {
            setUser(data);
            setNewDetails(data); // Initialize newDetails with fetched user data
        } else {
            console.error("Failed to fetch user data.");
        }
    };

    const fetchPostsData = async () => {
        const posts = await GetPosts(username);
        setPost(posts.post);
        setLoading(false);
    };

    const renderPost = (id) => {
        navigate(`/post/${id}`);
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleDetailChange = (e) => {
        setNewDetails({ ...newDetails, [e.target.name]: e.target.value });
    };

    const handleImageClick = () => {
        setShowLargeImage(false);
    };

    const handleImageDoubleClick = () => {
        
    };

    const handleDetailDoubleClick = (field) => {
        if (isEditing) {
            // Send updated details to the server
            console.log("Updated user details:", newDetails);
            setIsEditing(false);
        } else {
            setIsEditing(true);
        }
    };

    const handleCancel = () => {
        setNewDetails(user); // Revert to original user data
        setIsEditing(false); // Exit editing mode
    };

    useEffect(() => {
        fetchUserData();
    }, [username]);

    useEffect(() => {
        if (user) {
            fetchPostsData();
        }
    }, [user]);

    return (
        <>
            <NavigationMenu />

            {loading ? (
                <UILoader />
            ) : (
                <>
                    <div className="container flex direction-col">
                        <div className="profile-header obj flex direction-col">
                            {user && (
                                <>
                                    <img
                                        src={PIC}
                                        className="profile-img"
                                        alt="Profile image"
                                        onMouseDown={handleMouseDown}
                                        onMouseUp={handleMouseUp}
                                        onClick={() => clicked && handleImageDoubleClick()} // Click event to handle quick click
                                    />
                                    {showLargeImage && (
                                        <div className="large-image-overlay" onClick={handleImageClick}>
                                            <img src={PIC} alt="Large view" className="large-image" />
                                        </div>
                                    )}
                                    <br /><br />
                                    <p className="subtitle" onDoubleClick={() => handleDetailDoubleClick('name')}>
                                        {isEditing && CURRENT_USER_STATE_VAR ? (
                                            <><input
                                                type="text"
                                                name="f_name"
                                                value={newDetails.first_name || ''}
                                                onChange={handleDetailChange}
                                            />
                                                <input
                                                    type="text"
                                                    name="l_name"
                                                    value={newDetails.last_name || ''}
                                                    onChange={handleDetailChange}
                                                />
                                            </>
                                        ) : (
                                            `${user.first_name} ${user.last_name}`
                                        )}
                                    </p>
                                    <p className="heading grey" onDoubleClick={() => handleDetailDoubleClick('username')}>
                                        {isEditing && CURRENT_USER_STATE_VAR ? (
                                            <input
                                                type="text"
                                                name="username"
                                                value={newDetails.username || ''}
                                                onChange={handleDetailChange}
                                            />
                                        ) : (
                                            `@${user.username}`
                                        )}
                                    </p>
                                    <br />
                                    <table>
                                        <thead>
                                            <tr>
                                                <th className="grey">DOB</th>
                                                <th className="grey">POSTS</th>
                                                <th className="grey">CONTACT</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td onDoubleClick={() => handleDetailDoubleClick('dob')}>
                                                    {isEditing && CURRENT_USER_STATE_VAR ? (
                                                        <input
                                                            type="date"
                                                            name="dob"
                                                            value={newDetails.dob || ''}
                                                            onChange={handleDetailChange}
                                                        />
                                                    ) : (
                                                        user.dob || 'None'
                                                    )}
                                                </td>
                                                <td>{post.length}</td>
                                                <td onDoubleClick={() => handleDetailDoubleClick('email')}>
                                                    {isEditing && CURRENT_USER_STATE_VAR ? (
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            value={newDetails.email || ''}
                                                            onChange={handleDetailChange}
                                                        />
                                                    ) : (
                                                        user.email
                                                    )}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    {isEditing && CURRENT_USER_STATE_VAR && (
                                        <div className="edit-buttons flex">
                                            <br /><br />
                                            <button onClick={handleCancel} className="cancel-button error">
                                                <i class="bi bi-x"></i>
                                                Cancel
                                            </button>
                                            <button onClick={() => console.log("Saved user details:", newDetails)} className="save-button success">
                                                <i class="bi bi-floppy2-fill"></i>
                                                Save
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                        <br />
                        <div className="profile-body flex direction-col">
                            {post.length > 0 ? (
                                post.map((item) => (
                                    <div className="obj posts flex direction-col ai-start" key={item.id}>
                                        <p className="heading">{item.title}</p>
                                        <MarkdownViewer className="grey" markdownText={item.content} />
                                        <br /><br />
                                        <i onClick={() => { renderPost(item.id) }} className="bi bi-box-arrow-in-up-right caption"></i>
                                    </div>
                                ))
                            ) : (
                                <p>No posts available.</p>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default ProfileView;