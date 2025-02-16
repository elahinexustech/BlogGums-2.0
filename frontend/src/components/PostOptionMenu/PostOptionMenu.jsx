import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthUser/AuthProvider';
import { NotificationsContext } from '../Notifications/Notifications';
import PasswordChecker from '../PasswordChecker/passwordchecker';
import AboutPostWindow from '../AboutPostWindow/AboutPostWindow';

import './optionmenu.css'

const OptionMenu = ({ item, openMenuId, CURRENT_USER_STATE_VAR, postMode, setPostMode }) => {
    const navigate = useNavigate();
    const [showPassPage, setShowPassPage] = useState(false);
    const [showAboutPage, setShowAboutPage] = useState(false);
    const [postID, setPostID] = useState();
    const { addNotification } = useContext(NotificationsContext);
    const { isAuthenticated } = useContext(AuthContext);


    const navigateToProfile = (data) => { navigate(`/${data.username}`); }

    const handleDeleteClick = async (id) => {
        setPostID(id);
        setShowPassPage(prevState => !prevState);
    }

    const handleEditClick = (id) => {
        setPostMode('editing');
    }


    return (
        <>
            <section id={`optionMenu-${item.id}`} className={`optionMenu ${openMenuId === item.id ? 'showMenu' : ''}`}>
                <p className="caption grey">More options</p>
                <br />
                <ul>
                    {isAuthenticated ? (
                        <>
                            {/* Show "View Author Profile" if the current URL is not the author's profile */}
                            {window.location.href.split('/')[3] !== `${item.author.username}` && (
                                <li onClick={() => navigateToProfile(item.author)} className="li">
                                    <i className="bi bi-person-circle"></i> &nbsp; View Author Profile
                                </li>
                            )}

                            {/* About this Blog */}
                            <li onClick={() => { 
                                setShowAboutPage(true)
                            }} className="li">
                                <i className="bi bi-info-circle"></i> &nbsp; About this Blog
                            </li>

                            {/* Share Blog */}
                            <li
                                onClick={() => {
                                    navigator.clipboard
                                        .writeText(`${window.location.href}post/${item.id}`)
                                        .then(() => {
                                            addNotification('Link copied to clipboard', 'success');
                                        })
                                        .catch((err) => {
                                            addNotification('Failed to copy link', 'error');
                                        });
                                }}
                                className="li"
                            >
                                <i className="bi bi-share"></i> &nbsp; Share
                            </li>

                            <br />
                            <hr />
                            <br />

                            {CURRENT_USER_STATE_VAR ? (
                                <>
                                    {/* Edit Blog Post */}
                                    <li className="flex jc-start" onClick={() => handleEditClick(item.id)}>
                                        <i className="bi bi-pencil"></i> &nbsp; Edit Blog Post
                                    </li>

                                    {/* Delete Blog Post */}
                                    <li className="error flex jc-start" onClick={() => handleDeleteClick(item.id)}>
                                        <i className="bi bi-trash3-fill error"></i> &nbsp; Delete Blog Post
                                    </li>
                                </>
                            ) : (
                                <>
                                    {/* Report Issues */}
                                    <li onClick={() => { }} className="li error">
                                        <i className="bi bi-exclamation"></i> &nbsp; Report Issues
                                    </li>

                                    {/* Report Author */}
                                    <li className="error flex jc-start">
                                        <i className="bi bi-person-fill-exclamation"></i> &nbsp; Report Author
                                    </li>
                                </>
                            )}
                        </>
                    ) : (
                        <li className="alert flex jc-start" onClick={()=> {
                            // Show the LoginWindow here
                        }}>
                            <i className="bi bi-person-fill-exclamation"></i> &nbsp; Login First
                        </li>
                    )}
                </ul>

            </section>


            <PasswordChecker isOpen={showPassPage} onClose={handleDeleteClick} id={postID} />
            <AboutPostWindow isOpen={showAboutPage} onClose={()=> {setShowAboutPage(false)}} id={postID} data={item} />
        </>
    );
};

export default OptionMenu;