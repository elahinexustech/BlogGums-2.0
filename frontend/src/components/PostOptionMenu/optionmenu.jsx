import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import PasswordChecker from '../PasswordChecker/passwordchecker';

import './optionmenu.css'
import { ACCESS_TOKEN, PORT, REFRESH_TOKEN, SERVER } from '../../_CONSTS_';

const OptionMenu = ({ item, openMenuId, CURRENT_USER_STATE_VAR }) => {
    const navigate = useNavigate();
    const [showPassPage, setShowPassPage] = useState(false);
    const [postID, setPostID] = useState();

    const renderPost = (id) => {
        navigate(`/post/${id}`);
    }

    const deleteBlogPost = async (id) => {

        const response = await fetch(`${SERVER}:${PORT}/blogs/post/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`
            },
            body: JSON.stringify({ refresh: localStorage.getItem(REFRESH_TOKEN), post_id: id })
        })

        const data = await response.json();
        console.log(data)

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
                    <li className='li'><i className="bi bi-translate"></i> &nbsp; Translate</li>
                    <li onClick={() => { renderPost(item.id) }} className='li'><i className="bi bi-box-arrow-up-right"></i> &nbsp; View in Full</li>
                    <br /><hr /><br />
                    {CURRENT_USER_STATE_VAR ? (
                        <li className='error flex jc-start' onClick={() => { handleDeleteClick(item.id) }}><i className="bi bi-trash3-fill error"></i> &nbsp; Delete Blog Post</li>
                    ) : (<li className='error flex jc-start'> <i className="bi bi-person-fill-exclamation"></i> &nbsp;Report Author</li>)
                    }
                </ul>
            </section>


            <PasswordChecker isOpen={showPassPage} onClose={handleDeleteClick} deletPost={deleteBlogPost} id={postID}/>
        </>
    );
};

export default OptionMenu;