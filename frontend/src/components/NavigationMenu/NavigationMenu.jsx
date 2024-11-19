import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import SettingsUIWindow from '../../components/SettingsUIWindow/settings.ui.window';
import CreatePage from '../../Pages/CreatePostPage/create';
import './Navigation.css';

import { USER_DATA } from '../../_CONSTS_';

const NavigationMenu = () => {
    const [showSettingsWin, setShowSettingsWin] = useState(false);
    const [showCreatePage, setShowCreatePage] = useState(false);

    const user = JSON.parse(localStorage.getItem(USER_DATA));

    const toggleSettingsWin = () => {
        setShowSettingsWin(prevState => !prevState);
    };

    const toggleCreatePage = () => {
        setShowCreatePage(prevState => !prevState);
    };

    return (
        <>
            <nav className='flex direction-col'>
                <ul className=''>
                    <li>
                        <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
                            <i className="bi bi-house-fill"></i>
                        </NavLink>
                    </li>
                    <li>
                        <button className='transparent' type="button" onClick={toggleCreatePage}>
                            <i className="bi bi-plus"></i>
                        </button>
                    </li>
                    <li>
                        <NavLink to={`/${user.user.username}`} className={({ isActive }) => (isActive ? "active" : "")}>
                            <i className="bi bi-person-fill"></i>
                        </NavLink>
                    </li>
                </ul>
                <br />
                <button className='circle icon' onClick={toggleSettingsWin}>
                    <i className="bi bi-gear-wide-connected colored"></i>
                </button>
            </nav>

            <SettingsUIWindow stat={showSettingsWin} />
            <CreatePage isOpen={showCreatePage} onClose={toggleCreatePage} />
        </>
    );
};

export default NavigationMenu;
