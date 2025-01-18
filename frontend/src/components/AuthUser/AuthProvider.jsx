import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { ACCESS_TOKEN, REFRESH_TOKEN, USER_DATA } from '../../_CONSTS_'; // Adjust the import path if needed
import { USER } from '../../Functions/user'; // Adjust the import path if needed

// Create the AuthContext
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const access_token = Cookies.get(ACCESS_TOKEN);
            if (access_token) {
                try {
                    const user = await USER(); // Fetch user data
                    setUserData(user);
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error('Authentication failed', error);
                    setIsAuthenticated(false);
                    setUserData(null);
                }
            } else {
                setIsAuthenticated(false);
                setUserData(null);
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (accessToken, refreshToken, user) => {
        Cookies.set(ACCESS_TOKEN, accessToken, { expires: 7 });
        Cookies.set(REFRESH_TOKEN, refreshToken, { expires: 7 });
        Cookies.set(USER_DATA, JSON.stringify(user), { expires: 7 });
        setIsAuthenticated(true);
        setUserData(user);
    };

    const logout = () => {
        Cookies.remove(ACCESS_TOKEN);
        Cookies.remove(REFRESH_TOKEN);
        Cookies.remove(USER_DATA);
        setIsAuthenticated(false);
        setUserData(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userData, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

