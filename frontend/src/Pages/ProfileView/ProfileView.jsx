import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NavigationMenu from '../../components/NavigationMenu/NavigationMenu';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

// Components
import UILoader from '../../components/UILoader/UILoader';
import MarkdownViewer from '../PostView/MDDisplayer';
import ImageUploader from '../../components/ImageUploader/ImageUploader';

import { USER_DATA } from '../../_CONSTS_';

// Functions
import GetPosts from '../../Functions/GetPost';
import { USER, updateUser } from '../../Functions/user';

import './style.css';

import DEFAULT_PIC from '../../assets/imgs/default_pic.png'



const ProfileView = () => {
    const navigate = useNavigate();
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [post, setPost] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newDetails, setNewDetails] = useState({});
    const [showLargeImage, setShowLargeImage] = useState(false);
    const [pressTimer, setPressTimer] = useState(null); // Timer for detecting long press
    const [clicked, setClicked] = useState(false); // Track if it's a quick click
    const loggedInUser = JSON.parse(localStorage.getItem(USER_DATA)); // Get current logged-in user
    const [showUploader, setShowUploader] = useState(false);
    const CURRENT_USER_STATE_VAR = loggedInUser.user.username === username;
    const [openMenuId, setOpenMenuId] = useState(null); // State to track which post's menu is open



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

    const handleDetailChange = (e) => {
        setNewDetails({ ...newDetails, [e.target.name]: e.target.value });
    };

    const handleImageClick = () => {
        setShowLargeImage(false);
    };

    const selectImage = () => {
        setShowUploader(true); // Show the ImageUploader component
    };

    const handleCloseUploader = () => {
        setShowUploader(false); // Hide the ImageUploader component
    };

    const handleDetailDoubleClick = (field) => {
        if (isEditing) {
            setIsEditing(false);
        } else {
            setIsEditing(true);
        }
    };

    const handleCancel = () => {
        setNewDetails(user); // Revert to original user data
        setIsEditing(false); // Exit editing mode
    };

    const updateDetails = async () => {
        setIsSubmitting(true);
        let r = await updateUser(newDetails);
        if (r.status === 200) {
            setIsEditing(!isEditing);
            setIsSubmitting(false);
            location.reload();
        }
    }


    const toggleMenu = (e, id) => {
        e.stopPropagation();
        if (openMenuId === id) {
            setOpenMenuId(null); // Close the menu if it's already open
        } else {
            setOpenMenuId(id); // Open the clicked menu
        }
    };

    const handleClickOutside = (event) => {
        // Find the menu element
        const optionMenu = document.querySelector(`#optionMenu-${openMenuId}`);
        const button = document.querySelector(`#menuButton-${openMenuId}`);

        // Check if click is inside the menu or the button
        if (
            optionMenu && !optionMenu.contains(event.target) &&
            button && !button.contains(event.target)
        ) {
            setOpenMenuId(null); // Close the menu if clicked outside
        }
    };


    useEffect(() => {
        if (openMenuId !== null) {
            window.addEventListener('click', handleClickOutside);
        }

        // Cleanup event listener on unmount or when the menu is closed
        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, [openMenuId]);


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
            <Helmet>
                <title>{username} • BlogGums</title>
            </Helmet>
            <NavigationMenu />

            {loading ? (
                <UILoader />
            ) : (
                <>
                    <div className="container flex direction-col">
                        <div className="profile-header obj flex direction-col">
                            {user && (
                                <>
                                    <div className='image-container flex'>
                                        <img
                                            src={user.profile_image_url || DEFAULT_PIC}
                                            className="profile-picture size-l"
                                            alt="Profile image"
                                            onMouseDown={handleMouseDown}
                                            onMouseUp={handleMouseUp}
                                        />
                                        {CURRENT_USER_STATE_VAR && (
                                            <button className='small circle camera-btn' onClick={selectImage}>
                                                <i className="bi bi-camera-fill"></i>
                                            </button>

                                        )
                                        }
                                        {showUploader && (
                                            <div className="windows opened image-uploader">
                                                <div className="window opened flex obj-trans direction-col">
                                                    <button onClick={handleCloseUploader} className="transparent closeBtn icon">
                                                        <i className="bi bi-x-lg"></i>
                                                    </button>
                                                    <ImageUploader />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {showLargeImage && (
                                        <div className="large-image-overlay" onClick={handleImageClick}>
                                            <img src={user.profile_image_url || DEFAULT_PIC} alt="Large view" className="large-image" />
                                        </div>
                                    )}
                                    <br /><br />
                                    <p className="subtitle" onDoubleClick={() => handleDetailDoubleClick('name')}>
                                        {isEditing && CURRENT_USER_STATE_VAR ? (
                                            <><input
                                                type="text"
                                                name="first_name"
                                                value={newDetails.first_name || ''}
                                                onChange={handleDetailChange}
                                            />
                                                <input
                                                    type="text"
                                                    name="last_name"
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
                                            <button onClick={handleCancel} className="cancel-button error" disabled={isSubmitting}>
                                                <i className="bi bi-x"></i>
                                                Cancel
                                            </button>
                                            <button onClick={updateDetails} className="save-button success" disabled={isSubmitting} >
                                                <i className="bi bi-floppy2-fill"></i>
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
                                        {CURRENT_USER_STATE_VAR ? (
                                            <>
                                                <section className="right">
                                                    <button
                                                        id={`menuButton-${item.id}`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleMenu(e, item.id);
                                                        }}
                                                        className="transparent circle"
                                                    >
                                                        <i className="bi bi-three-dots-vertical"></i>
                                                    </button>
                                                </section>

                                                {/* Option Menu that only shows for the specific post */}
                                                <section
                                                    id={`optionMenu-${item.id}`}
                                                    className={`optionMenu ${openMenuId === item.id ? 'showMenu' : ''}`}
                                                >
                                                    <p className="caption grey">More options</p>
                                                    <br /><hr /><br />
                                                    <ul>
                                                        <li className='li'>Translate</li>
                                                        <li onClick={() => { renderPost(ID) }} className='li'>View in Full</li>
                                                        <br /><hr /><br />
                                                        <li className='error'>Report Author</li>
                                                    </ul>
                                                </section>
                                            </>
                                        ) : ""

                                        }
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