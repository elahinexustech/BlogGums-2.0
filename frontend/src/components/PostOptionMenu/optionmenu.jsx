import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import PasswordChecker from '../PasswordChecker/passwordchecker';

import './optionmenu.css'

const OptionMenu = ({ item, openMenuId, CURRENT_USER_STATE_VAR }) => {
    const navigate = useNavigate();
    const [showPassPage, setShowPassPage] = useState(false);
    const [postID, setPostID] = useState();

    const renderPost = (id) => {
        navigate(`/post/${id}`);
    }

    const handleDeleteClick = async (id) => {
        setPostID(id);
        setShowPassPage(prevState => !prevState);
    }

    return (
        <>
            <section id={`optionMenu-${item.id}`} className={`optionMenu ${openMenuId === item.id ? 'showMenu' : ''}`}>
                <p className="caption grey">More options</p>
                <br /><hr /><br />
                <ul>
                    <li onClick={() => { renderPost(item.id) }} className='li'><i className="bi bi-box-arrow-up-right"></i> &nbsp; View in Full</li>
                    <br /><hr /><br />
                    {CURRENT_USER_STATE_VAR ? (
                        <li className='error flex jc-start' onClick={() => { handleDeleteClick(item.id) }}><i className="bi bi-trash3-fill error"></i> &nbsp; Delete Blog Post</li>
                    ) : (<li className='error flex jc-start'> <i className="bi bi-person-fill-exclamation"></i> &nbsp;Report Author</li>)
                    }
                </ul>
            </section>


            <PasswordChecker isOpen={showPassPage} onClose={handleDeleteClick} id={postID}/>
        </>
    );
};

export default OptionMenu;