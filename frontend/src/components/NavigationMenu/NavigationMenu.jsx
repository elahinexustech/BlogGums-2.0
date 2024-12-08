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

    // Return statement needs to directly evaluate JSX
    // if (!user) return null; // If user doesn't exist, return nothing

    return (
        <>
            <nav className="nav-menu flex direction-col">
                <ul>
                    <li>
                        <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")} aria-label="Home">
                            <i className="bi bi-house-fill" title="Home"></i>
                        </NavLink>
                    </li>
                    <li>
                        <button className="transparent" type="button" onClick={toggleCreatePage} aria-label="Create Page">
                            <i className="bi bi-plus" title="Create Page"></i>
                        </button>
                    </li>
                    <li>
                        <NavLink
                            to={`/${user?.user?.username ?? ''}`}
                            className={({ isActive }) => (isActive ? "active" : "")}
                            aria-label="Profile"
                        >
                            <i className="bi bi-person-fill" title="Profile"></i>
                        </NavLink>
                    </li>
                </ul>
                <br />
                <button className="circle icon" onClick={toggleSettingsWin} aria-label="Settings">
                    <i className="bi bi-gear-wide-connected colored" title="Settings"></i>
                </button>
            </nav>

            <SettingsUIWindow stat={showSettingsWin} />
            <CreatePage isOpen={showCreatePage} onClose={toggleCreatePage} />
        </>
    );
};

export default NavigationMenu;

