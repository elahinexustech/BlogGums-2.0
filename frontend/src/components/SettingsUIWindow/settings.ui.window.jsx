import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../ThemeProvider/ThemeProvider';
import { BLOG_FONT_SIZE, CODE_THEME } from '../../_CONSTS_';
import { FSContext } from '../../Context/useFontSize';
import { AuthContext } from '../AuthUser/AuthProvider'; // Import AuthContext

import { Link } from 'react-router-dom';

import './settings.css';

const SettingsUIWindow = ({ stat }) => {
    const { darkTheme, toggleTheme } = useContext(ThemeContext);
    const { userData, logout } = useContext(AuthContext); // Get user from AuthContext
    const user = userData.user
    const [selectedColor, setSelectedColor] = useState(localStorage.getItem('color') || 'original');
    const { fontSize, setFontSize } = useContext(FSContext);
    const [selectedTheme, setSelectedTheme] = useState('dark-plus'); // Default to 'dark-plus'

    // const navigate = useNavigate();

    // Load theme from localStorage on component mount
    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            setSelectedTheme(storedTheme);
        }
    }, []);

    useEffect(() => {
        applyColorClass();
    }, [selectedColor]);

    const handleCodeThemeChange = (event) => {
        const newTheme = event.target.value;
        setSelectedTheme(newTheme);
        localStorage.setItem(CODE_THEME, newTheme);
    };

    const applyColorClass = () => {
        // Remove any existing color class from the body
        document.body.classList.forEach(className => {
            if (className.startsWith("theme-color-")) {
                document.body.classList.remove(className);
            }
        });

        // Add the new color class based on the selected color
        document.body.classList.add(`theme-color-${selectedColor}`);
    };

    const handleColorChange = (color) => {
        localStorage.setItem('color', color);
        setSelectedColor(color);
    };

    const handleFontSizeChange = (e) => {
        const newSize = `${e.target.value}rem`;
        setFontSize(newSize); // Update context
        localStorage.setItem(BLOG_FONT_SIZE, newSize); // Save to localStorage for persistence
    };

    return (
        <div className={`settings obj ${stat ? "show" : ""}`}>
            <section className="header flex">
                <p className="heading text-center grey">Settings</p>
            </section>
            <section className='body'>

                <section className="settings-sections information">
                    <p className="caption grey">General</p>
                    {user && (
                        <label className='flex jc-start account-label' onClick={() => { navigate(`/${user.username}`) }}>
                            <img src={user.profile_image_url} className="profile-picture size-m" />
                            &nbsp;
                            <section>
                                <p className="heading-2 grey">@{user.username}</p>
                                <p className="heading">{user.first_name} {user.last_name}</p>
                            </section>
                        </label>
                    )}

                    <br /><hr /><br />

                    <Link to="/pricing" className="flex jc-start information-label pricing">
                        <i className="bi bi-currency-dollar"></i>
                        <p className="caption">Pricing</p>
                    </Link>

                    <Link to="/terms-conditions" className="flex jc-start information-label terms-conditions">
                        <i className="bi bi-newspaper"></i>
                        <p className="caption">Terms & Conditions</p>
                    </Link>

                    <Link to="/privacy" className="flex jc-start information-label privacy">
                        <i className="bi bi-shield-shaded"></i>
                        <p className="caption">Privacy</p>
                    </Link>

                    <Link to="/learn" className="flex jc-start information-label learn">
                        <i className="bi bi-book-half"></i>
                        <p className="caption">Learn</p>
                    </Link>

                    <Link to="/about" className="flex jc-start information-label about">
                        <i className="bi bi-info-circle-fill"></i>
                        <p className="caption">About</p>
                    </Link>

                    <Link to="/featured" className="flex jc-start information-label featured">
                        <i className="bi bi-circle-fill"></i>
                        <p className="caption">Featured</p>
                    </Link>

                </section>

                <section className='settings-sections appearance'>
                    <p className="caption grey">Appearance</p><br />

                    <label className='flex jc-spb'>
                        <p>Dark theme</p>
                        <label className="switch">
                            <input
                                type="checkbox"
                                onChange={toggleTheme}
                                checked={darkTheme}
                            />
                            <span className="slider"></span>
                        </label>
                    </label>

                    <label className='flex direction-col ai-start'>
                        <p>Accent Colour</p>
                        <br />
                        <section className='flex jc-start' style={{ gap: '0.5rem' }}>
                            {['original', 'orange', 'blue', 'red', 'green'].map(color => (
                                <span
                                    key={color}
                                    className={`color-circles ${color} ${selectedColor === color ? 'active' : ''}`}
                                    onClick={() => handleColorChange(color)}
                                ></span>
                            ))}
                        </section>
                    </label>
                </section>

                <section className='settings-sections blog'>
                    <p className="caption grey">Blog Settings</p><br />
                    <label>
                        <p>Font Size</p>
                        <input
                            type="range"
                            name="font-size-slider"
                            id="fs-slider"
                            min="1"
                            max="3"
                            step="0.1"
                            value={parseFloat(fontSize)}
                            onChange={handleFontSizeChange}
                        />
                    </label>

                    <br /><br />

                    <label>
                        <p>Code Theme</p>
                        <select id="theme-select" value={selectedTheme} onChange={handleCodeThemeChange}>
                            <optgroup label="Dark Themes">
                                <option value="ayu-dark">Ayu Dark</option>
                                <option value="catppuccin-frappe">Catppuccin Frappe</option>
                                <option value="catppuccin-macchiato">Catppuccin Macchiato</option>
                                <option value="catppuccin-mocha">Catppuccin Mocha</option>
                                <option value="dark-plus">Dark Plus</option>
                                <option value="dracula">Dracula</option>
                                <option value="dracula-soft">Dracula Soft</option>
                                <option value="everforest-dark">Everforest Dark</option>
                                <option value="github-dark">GitHub Dark</option>
                                <option value="github-dark-default">GitHub Dark Default</option>
                                <option value="github-dark-dimmed">GitHub Dark Dimmed</option>
                                <option value="github-dark-high-contrast">GitHub Dark High Contrast</option>
                                <option value="houston">Houston</option>
                                <option value="kanagawa-dragon">Kanagawa Dragon</option>
                                <option value="kanagawa-wave">Kanagawa Wave</option>
                                <option value="laserwave">Laserwave</option>
                                <option value="material-theme">Material Theme</option>
                                <option value="material-theme-darker">Material Theme Darker</option>
                                <option value="min-dark">Min Dark</option>
                                <option value="monokai">Monokai</option>
                                <option value="night-owl">Night Owl</option>
                                <option value="nord">Nord</option>
                                <option value="one-dark-pro">One Dark Pro</option>
                                <option value="plastic">Plastic</option>
                                <option value="red">Red</option>
                                <option value="rose-pine">Rose Pine</option>
                                <option value="rose-pine-moon">Rose Pine Moon</option>
                                <option value="slack-dark">Slack Dark</option>
                                <option value="solarized-dark">Solarized Dark</option>
                                <option value="synthwave-84">Synthwave '84</option>
                                <option value="tokyo-night">Tokyo Night</option>
                                <option value="vitesse-black">Vitesse Black</option>
                                <option value="vitesse-dark">Vitesse Dark</option>
                            </optgroup>

                            <optgroup label="Light Themes">
                                <option value="catppuccin-latte">Catppuccin Latte</option>
                                <option value="everforest-light">Everforest Light</option>
                                <option value="github-light">GitHub Light</option>
                                <option value="github-light-default">GitHub Light Default</option>
                                <option value="github-light-high-contrast">GitHub Light High Contrast</option>
                                <option value="light-plus">Light Plus</option>
                                <option value="material-theme-lighter">Material Theme Lighter</option>
                                <option value="min-light">Min Light</option>
                                <option value="one-light">One Light</option>
                                <option value="rose-pine-dawn">Rose Pine Dawn</option>
                                <option value="slack-ochin">Slack Ochin</option>
                                <option value="snazzy-light">Snazzy Light</option>
                                <option value="solarized-light">Solarized Light</option>
                                <option value="vitesse-light">Vitesse Light</option>
                            </optgroup>

                            <optgroup label="Other Themes">
                                <option value="andromeeda">Andromeeda</option>
                                <option value="aurora-x">Aurora X</option>
                                <option value="kanagawa-lotus">Kanagawa Lotus</option>
                                <option value="material-theme-ocean">Material Theme Ocean</option>
                                <option value="material-theme-palenight">Material Theme Palenight</option>
                                <option value="poimandres">Poimandres</option>
                                <option value="vesper">Vesper</option>
                            </optgroup>
                        </select>
                    </label>

                </section>

                <section className="settings-sections danger">
                    <p className="caption grey">Danger</p>
                    <br />
                    <label className='flex jc-spb'>
                        <p>Logout</p>
                        <button className='error' onClick={() => {
                            if (window.confirm("Are you sure to logout!")) {
                                logout()
                                window.location = "/"
                            }
                        }}>Logout</button>
                    </label>
                </section>
            </section>
        </div>
    );
};

export default SettingsUIWindow;
