import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotificationsContext } from '../Notifications/Notifications';
import PasswordChecker from '../PasswordChecker/passwordchecker';

import './optionmenu.css'

const OptionMenu = ({ item, openMenuId, CURRENT_USER_STATE_VAR }) => {
    const navigate = useNavigate();
    const [showPassPage, setShowPassPage] = useState(false);
    const [postID, setPostID] = useState();
    const { addNotification } = useContext(NotificationsContext);

    const navigateToProfile = (data) => { navigate(`/${data.username}`); }

    const handleDeleteClick = async (id) => {
        setPostID(id);
        setShowPassPage(prevState => !prevState);
    }


    return (
        <>
            <section id={`optionMenu-${item.id}`} className={`optionMenu ${openMenuId === item.id ? 'showMenu' : ''}`}>
                <p className="caption grey">More options</p>
                <br />
                <ul>

                    {(window.location.href.split('/')[3] != `${item.author.username}`) && (
                        <li onClick={() => { navigateToProfile(item.author) }} className='li'>
                            <i className="bi bi-person-circle"></i> &nbsp; View Author Profile
                        </li>
                    )}

                    <li onClick={() => { }} className='li'>
                        <i className="bi bi-info-circle"></i> &nbsp; About this Blog
                    </li>

                    <li onClick={() => {
                        navigator.clipboard.writeText(`${window.location.href}post/${item.id}`).then(() => {
                            addNotification('Link copied to clipboard', 'success');
                        }).catch(err => {
                            addNotification('Failed to copy link', 'error');
                        });
                    }} className='li'>
                        <i className="bi bi-share"></i> &nbsp; Share
                    </li>


                    <br /><hr /><br />


                    {CURRENT_USER_STATE_VAR ? (
                        <>
                            <li className='flex jc-start' onClick={() => { handleDeleteClick(item.id) }}>
                                <i className="bi bi-pencil"></i> &nbsp; Edit Blog Post
                            </li>

                            <li className='error flex jc-start' onClick={() => { handleDeleteClick(item.id) }}>
                                <i className="bi bi-trash3-fill error"></i> &nbsp; Delete Blog Post
                            </li>

                        </>
                    ) : (
                        <>
                            <li onClick={() => { }} className='li error'>
                                <i className="bi bi-exclamation"></i> &nbsp; Report Issues
                            </li>

                            <li className='error flex jc-start'>
                                <i className="bi bi-person-fill-exclamation"></i> &nbsp;Report Author
                            </li>
                        </>
                    )}
                </ul>
            </section>


            <PasswordChecker isOpen={showPassPage} onClose={handleDeleteClick} id={postID} />
        </>
    );
};

export default OptionMenu;