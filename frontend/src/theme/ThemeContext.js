import React, { createContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

export const ThemeContext = createContext();

export const lightTheme = {
    background: '#FFFFFF',
    surface: '#F5F5F5',
    primary: '#6200EE',
    text: '#000000',
    textSecondary: '#666666',
    error: '#B00020',
    border: '#E0E0E0',
    mode: 'light',
};

export const darkTheme = {
    background: '#121212',
    surface: '#1E1E1E',
    primary: '#BB86FC',
    text: '#FFFFFF',
    textSecondary: '#AAAAAA',
    error: '#CF6679',
    border: '#333333',
    mode: 'dark',
};

export const ThemeProvider = ({ children }) => {
    const systemColorScheme = useColorScheme();

    // Logic for time-based auto theme detection (Day 6am-6pm / Night 6pm-6am)
    const isNightTime = () => {
        const hours = new Date().getHours();
        return hours < 6 || hours >= 18;
    };

    const [isDarkMode, setIsDarkMode] = useState(isNightTime());

    // Periodically check time to auto-switch theme if it was auto-detected initially
    useEffect(() => {
        const interval = setInterval(() => {
            // If we want purely time-based regardless of system:
            setIsDarkMode(isNightTime());
        }, 60000); // Check every minute

        return () => clearInterval(interval);
    }, []);


    const theme = isDarkMode ? darkTheme : lightTheme;

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
