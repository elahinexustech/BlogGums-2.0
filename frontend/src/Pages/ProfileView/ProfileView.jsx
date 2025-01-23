import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import NavigationMenu from '../../components/NavigationMenu/NavigationMenu';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { NotificationsContext } from '../../components/Notifications/Notifications';
import Cookies from 'js-cookie';

// Components
import UILoader from '../../components/UILoader/UILoader';
import MarkdownViewer from '../../components/MarkdownViewer/MarkdownViewer';
import ProfileImageUploader from '../../components/ProfileImageUploader/ProfileImageUploader';

import { USER_DATA } from '../../_CONSTS_';

// Functions
import GetPosts from '../../Functions/GetPost';
import { USER, updateUser } from '../../Functions/user';

import './style.css';



const ProfileView = () => {
    const { addNotifications, removeNotifications } = useContext(NotificationsContext);
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
    const [showUploader, setShowUploader] = useState(false);
    const loggedInUser = JSON.parse(Cookies.get(USER_DATA)); // Get current logged-in user
    const CURRENT_USER_STATE_VAR = loggedInUser.user.username === username;
    const [openMenuId, setOpenMenuId] = useState(null); // State to track which post's menu is open
    const [isChanged, setIsChanged] = useState(false)
    const [userUpdated, setUserUpdated] = useState(false);

    const handleMouseDown = () => {
        setClicked(false);
        setPressTimer(
            setTimeout(() => {
                setShowLargeImage(true);
            }, 500)
        );
    };

    const handleMouseUp = () => {
        clearTimeout(pressTimer);
        if (!clicked) {
            setClicked(true);
        }
    };

    const fetchUserData = async () => {
        setLoading(true);
        const data = await USER(username);
        if (data) {
            setUser(data);
            setNewDetails(data);
        } else {
            console.error('Failed to fetch user data.');
        }
    };

    const fetchPostsData = async () => {
        const posts = await GetPosts(username);
        setPost(posts.post);
        setLoading(false);
    };

    const handleDetailChange = (e) => {
        setNewDetails({ ...newDetails, [e.target.name]: e.target.value });
    };

    const handleImageClick = () => {
        setShowLargeImage(false);
    };

    const selectImage = () => {
        setShowUploader(true);
    };

    const handleCloseUploader = () => {
        setShowUploader(false);
    };

    const handleDetailDoubleClick = (field) => {
        setIsEditing(!isEditing);
    };

    const handleCancel = () => {
        setNewDetails(user);
        setIsEditing(false);
    };

    const updateDetails = async () => {
        setIsSubmitting(true);
        let r = await updateUser(newDetails);
        if (r.status === 200) {
            setIsEditing(false);
            setIsSubmitting(false);
            setUserUpdated(true); // Set the flag for user update
        }
    };

    const toggleMenu = (e, id) => {
        e.stopPropagation();
        if (openMenuId === id) {
            setOpenMenuId(null);
        } else {
            setOpenMenuId(id);
        }
    };

    const handleClickOutside = (event) => {
        const optionMenu = document.querySelector(`#optionMenu-${openMenuId}`);
        const button = document.querySelector(`#menuButton-${openMenuId}`);
        if (
            optionMenu &&
            !optionMenu.contains(event.target) &&
            button &&
            !button.contains(event.target)
        ) {
            setOpenMenuId(null);
        }
    };

    useEffect(() => {
        if (openMenuId !== null) {
            window.addEventListener('click', handleClickOutside);
        }
        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, [openMenuId]);

    useEffect(() => {
        fetchUserData();
    }, [setIsChanged]);

    useEffect(() => {
        if (user) {
            fetchPostsData();
        }
    }, [user]);

    // New effect to fetch user data after updates
    useEffect(() => {
        if (userUpdated) {
            fetchUserData().then(() => {
                fetchPostsData();
                setUserUpdated(false); // Reset the flag
            });
        }
    }, [userUpdated]);

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
                                            src={user.profile_image_url || './imgs/default_pic.png'}
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
                                                    <ProfileImageUploader />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {showLargeImage && (
                                        <div className="large-image-overlay" onClick={handleImageClick}>
                                            <img src={user.profile_image_url || './imgs/default_pic.png'} alt="Large view" className="large-image" />
                                        </div>
                                    )}
                                    <br /><br />
                                    <p className="subtitle text-center" onDoubleClick={() => handleDetailDoubleClick('name')}>
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
                                        <section className="right">
                                            <button id={`menuButton-${item.id}`} className="transparent circle"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleMenu(e, item.id);
                                                }}
                                            >
                                                <i className="bi bi-three-dots-vertical"></i>
                                            </button>
                                        </section>

                                        {/* Option Menu that only shows for the specific post */}
                                        {/* <OptionMenu item={item} openMenuId={openMenuId} CURRENT_USER_STATE_VAR={CURRENT_USER_STATE_VAR} /> */}

                                        <p className="heading">{item.title}</p>
                                        <MarkdownViewer className="grey" markdownText={item.content} />
                                        <br /><br />
                                        <i onClick={() => { renderPost(item.id) }} className="bi bi-box-arrow-in-up-right caption"></i>
                                    </div>
                                ))
                            ) : (
                                <>
                                    <br /> <br />
                                    <p className='subtitle grey'>No posts available.</p>
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default ProfileView;
