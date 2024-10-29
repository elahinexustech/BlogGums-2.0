import React, { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import SettingsUIWindow from '../../components/SettingsUIWindow/settings.ui.window';
import './Navigation.css';

import { USER_DATA } from '../../_CONSTS_';

const NavigationMenu = () => {
  const [showSettingsWin, setShowSettingsWin] = useState(false);

  const user = JSON.parse(localStorage.getItem(USER_DATA));

  // Toggle the settings window visibility
  const toggleSettingsWin = () => {
    setShowSettingsWin(prevState => !prevState);
  };

  return (
    <>
      <nav className='flex direction-col'>
        <ul className='obj'>
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
              <i className="bi bi-house-fill"></i>
            </NavLink>
          </li>
          <li>
            <NavLink to="/notifications" className={({ isActive }) => (isActive ? "active" : "")}>
              <i className="bi bi-bell-fill"></i>
            </NavLink>
          </li>
          <li>
            <NavLink to="/create" className={({ isActive }) => (isActive ? "active" : "")}>
              <i className="bi bi-plus"></i>
            </NavLink>
          </li>
          <li>
            <NavLink to={`/${user.user.username}`} className={({ isActive }) => (isActive ? "active" : "")}>
              <i className="bi bi-person-fill"></i>
            </NavLink>
          </li>
        </ul>
        <br />
        <button className='circle' onClick={toggleSettingsWin}>
          <i className="bi bi-gear-wide-connected colored"></i>
        </button>
      </nav>

      {/* Conditionally show the settings window */}
      <SettingsUIWindow stat={showSettingsWin} />
    </>
  );
};

export default NavigationMenu;
