import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkLoggedIn();
    }, []);

    const checkLoggedIn = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const email = await AsyncStorage.getItem('email');

            if (token && email) {
                setUser({ token, email });
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const res = await api.post('/auth/login', { email, password });
            await AsyncStorage.setItem('token', res.data.token);
            await AsyncStorage.setItem('email', res.data.email);
            setUser({ token: res.data.token, email: res.data.email });
            return { success: true };
        } catch (e) {
            return { success: false, message: e.response?.data?.message || 'Login failed' };
        }
    };

    const register = async (email, password) => {
        try {
            const res = await api.post('/auth/register', { email, password });
            return { success: true, message: res.data.message };
        } catch (e) {
            return { success: false, message: e.response?.data?.message || 'Registration failed' };
        }
    };

    const logout = async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('email');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
