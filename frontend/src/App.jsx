import React, { useState, useEffect, useCallback } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie'; // Import js-cookie

// Import Components/Pages
import LoginForm from './Pages/LoginPage/LoginForm';
import SignUpForm from './Pages/SignupPage/SignUpForm';
import Home from './Pages/HomePage/home';
import NavigationMenu from './components/NavigationMenu/NavigationMenu';
import DetailaView from './Pages/DetailsPage/DetailaView';
import ProfileView from './Pages/ProfileView/ProfileView';
import ResetPassword from './Pages/ResetPassword/ResetPassword';
import ThemeProvider from './components/ThemeProvider/ThemeProvider';
import UILoader from './components/UILoader/UILoader';
import MediaUploader from './components/MediaUploader/ImageUploader';
import NotificationsProvider from './components/Notifications/Notifications';




import {
    SERVER,
    PORT,
    ACCESS_TOKEN,
    REFRESH_TOKEN,
    THEME_MODE,
    BLOG_FONT_SIZE,
    CODE_THEME, USER_DATA
} from './_CONSTS_.js';

const BASE_URL = (SERVER && PORT) ? `${SERVER}:${PORT}` : '/choreo-apis/bloggums/backend/v1';

// Import CSS
import './assets/css/main.css';
import './assets/css/container.css';
import './assets/css/darkmode.css';
import './assets/css/utility.css';
import './assets/css/windows.css';

// Functions
import { USER } from './Functions/user';
import { AuthProvider } from './components/AuthUser/AuthProvider';
import PostView from './Pages/PostView/PostView.jsx';
import Post from './components/Post/Post.jsx';


const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [loading, setLoading] = useState(true);
    const [darkTheme, setDarkTheme] = useState(false);
    const [color, setColor] = useState('default');

    useEffect(() => {
        const initializeApp = async () => {
            await checkAuthStatus();

            const theme = localStorage.getItem(THEME_MODE) || "light";
            if (theme === "dark") setDarkTheme(true);
            if (darkTheme) document.body.classList.add("dark-theme");

            const storedColor = localStorage.getItem("color") || "default";
            setColor(storedColor);
            applyColorClass(storedColor);

            localStorage.setItem(BLOG_FONT_SIZE, localStorage.getItem(BLOG_FONT_SIZE) || '1rem');
            localStorage.setItem(CODE_THEME, localStorage.getItem(CODE_THEME) || 'dark-plus');

            setLoading(false);
        };

        initializeApp();
    }, [darkTheme]);

    const checkAuthStatus = useCallback(async () => {
        const token = Cookies.get(ACCESS_TOKEN); // Get token from cookies
        if (!token) {
            setIsAuthenticated(false);
        } else {
            const { exp } = jwtDecode(token);
            if (exp < Date.now() / 1000) {
                await refreshToken();
            } else {
                setIsAuthenticated(true);
                await getUser();
            }
        }
    }, []);

    const refreshToken = useCallback(async () => {
        const refreshToken = Cookies.get(REFRESH_TOKEN); // Get refresh token from cookies
        try {
            const res = await fetch(`${BASE_URL}/api/token/refresh/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ refresh: refreshToken })
            });
            if (res.status === 200) {
                const { access } = await res.json();
                Cookies.set(ACCESS_TOKEN, access); // Save new access token in cookies
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error(error);
            setIsAuthenticated(false);
        }
    }, []);

    const getUser = useCallback(async () => {
        try {
            const user = await USER();
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    }, []);

    const applyColorClass = useCallback((selectedColor) => {
        document.body.className = document.body.className.replace(/\btheme-color-\S+/g, '');
        document.body.classList.add(`theme-color-${selectedColor}`);
    }, []);

    const router = createBrowserRouter([
        { path: "/", element: isAuthenticated ? <><NavigationMenu /><Home /></> : <LoginForm /> },
        { path: "/resetpassword", element: <ResetPassword /> },
        { path: "/signup", element: isAuthenticated ? <Navigate to="/" /> : <SignUpForm /> },
        { path: "/support", element: <DetailaView /> },
        { path: "/post/:id", element: <><NavigationMenu /><PostView /></>},
        { path: "/:username", element: isAuthenticated ? <ProfileView /> : <LoginForm /> },
    ]);

    if (loading) return <UILoader />;

    return (
        <AuthProvider>
            <ThemeProvider>
                <NotificationsProvider value={0}>
                    <RouterProvider router={router}>
                    </RouterProvider>
                    {isAuthenticated && (<MediaUploader />)}
                </NotificationsProvider>
            </ThemeProvider>
        </AuthProvider>
    );
};

export default App;
