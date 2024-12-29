import React, { createContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
    const [darkTheme, setDarkTheme] = useState(localStorage.getItem("theme") === "dark");
    const [color, setColor] = useState(localStorage.getItem("color") || 'default');

    useEffect(() => {
        applyTheme();
        applyColorTheme();

        // Attach event listener for color selection
        const themeColorsContainer = document.querySelector(".js-theme-colors");
        if (themeColorsContainer) {
            themeColorsContainer.addEventListener("click", handleColorClick);
        }

        // Cleanup event listener on unmount
        return () => {
            if (themeColorsContainer) {
                themeColorsContainer.removeEventListener("click", handleColorClick);
            }
        };
    }, []);

    useEffect(() => {
        applyTheme();
    }, [darkTheme]);

    useEffect(() => {
        applyColorClass();
    }, [color]);

    const applyTheme = () => {
        localStorage.setItem("theme", darkTheme ? "dark" : "light");
        document.body.classList.toggle("dark-theme", darkTheme);
    };

    const applyColorTheme = () => {
        // Apply the initial color class when the component mounts
        applyColorClass();
    };

    const handleColorClick = (event) => {
        const target = event.target;
        if (target.classList.contains("js-theme-color-item")) {
            const newColor = target.getAttribute("data-js-theme-color");
            localStorage.setItem("color", newColor);
            setColor(newColor);
        }
    };

    const applyColorClass = () => {
        // Remove any existing color class from the body
        document.body.classList.forEach(className => {
            if (className.startsWith("theme-color-")) {
                document.body.classList.remove(className);
            }
        });

        // Add the new color class based on the selected color
        document.body.classList.add(`theme-color-${color}`);
    };

    const toggleTheme = () => {
        setDarkTheme(prevTheme => !prevTheme);
    };

    return (
        <ThemeContext.Provider value={{ darkTheme, toggleTheme, color }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
export { ThemeContext };
export const useTheme = () => React.useContext(ThemeContext);
