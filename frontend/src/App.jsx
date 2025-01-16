import React, { useState, useEffect, useCallback } from 'react';
import { useParams, createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Import Components/Pages
import LoginForm from './Pages/LoginPage/LoginForm';
import SignUpForm from './Pages/SignupPage/SignUpForm';
import Home from './Pages/HomePage/home';
import PostView from './Pages/PostView/PostView';
import CreatePage from './Pages/CreatePostPage/create';
import TermsConditions from './Pages/TermsConditionsPage/TermsConditions';
import Pricing from './Pages/PricingPage/Pricing';
import Privacy from './Pages/PrivacyPage/Pricing';
import Learn from './Pages/LearnPage/Learn';
import AboutUs from './Pages/AboutPage/AboutUS';
import Features from './Pages/FeaturedPage/FeaturedPage';
import ProfileView from './Pages/ProfileView/ProfileView';
import ResetPassword from './Pages/ResetPassword/ResetPassword';
import ThemeProvider from './components/ThemeProvider/ThemeProvider';
import UILoader from './components/UILoader/UILoader';
import MediaUploader from './components/MediaUploader/ImageUploader';
import NotificationsProvider from './components/Notifications/Notifications';

// CONSTS
import { SERVER, PORT, ACCESS_TOKEN, REFRESH_TOKEN, THEME_MODE, USER_DATA, BLOG_FONT_SIZE, CODE_THEME } from './_CONSTS_';

// Import CSS
import './assets/css/main.css';
import './assets/css/container.css';
import './assets/css/dashboard.css';
import './assets/css/utility.css';
import './assets/css/windows.css';

// Functions
import { USER } from './Functions/user';

const PostViewWrapper = () => {
    const { id } = useParams();
    const user = JSON.parse(localStorage.getItem(USER_DATA));
    return <PostView id={id} user={user} />;
};

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
        const token = localStorage.getItem(ACCESS_TOKEN);
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
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try {
            const res = await fetch(`${SERVER}:${PORT}/api/token/refresh/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ refresh: refreshToken })
            });
            if (res.status === 200) {
                const { access } = await res.json();
                localStorage.setItem(ACCESS_TOKEN, access);
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
            if (user) localStorage.setItem(USER_DATA, JSON.stringify(user));
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    }, []);

    const applyColorClass = useCallback((selectedColor) => {
        document.body.className = document.body.className.replace(/\btheme-color-\S+/g, '');
        document.body.classList.add(`theme-color-${selectedColor}`);
    }, []);

    const router = createBrowserRouter([
        { path: "/", element: isAuthenticated ? <Home /> : <LoginForm /> },
        { path: "/resetpassword", element: <ResetPassword /> },
        { path: "/signup", element: isAuthenticated ? <Navigate to="/" /> : <SignUpForm /> },
        { path: "/post/:id", element: isAuthenticated ? <PostViewWrapper /> : <LoginForm /> },
        { path: "/create", element: isAuthenticated ? <CreatePage /> : <LoginForm /> },
        { path: "/pricing", element: isAuthenticated ? <Pricing /> : <LoginForm /> },
        { path: "/terms-conditions", element: <TermsConditions /> },
        { path: "/privacy", element: <Privacy /> },
        { path: "/learn", element: <Learn /> },
        { path: "/about", element: <AboutUs /> },
        { path: "/featured", element: <Features /> },

        { path: ":username", element: isAuthenticated ? <ProfileView /> : <LoginForm /> },
    ]);

    if (loading) return <UILoader />;

    return (
        <ThemeProvider>
            <NotificationsProvider value={0}>
                <RouterProvider router={router} />
                {isAuthenticated && (
                    <MediaUploader />
                )}
            </NotificationsProvider>
        </ThemeProvider>
    );
};

export default App;
