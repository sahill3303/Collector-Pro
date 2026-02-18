import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

// Create the context
const AuthContext = createContext();

/**
 * Custom hook to access AuthContext
 */
export const useAuth = () => {
    return useContext(AuthContext);
};

/**
 * AuthProvider Component
 * 
 * Manages the global authentication state of the user.
 * - Checks for a stored token on initial load.
 * - Provides login, register, and logout functions.
 * - Exposes the current `user` object and `loading` state.
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initial check for existing token
    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Verify token and get user data from backend
                    const res = await api.get('/auth/user');
                    setUser(res.data);
                } catch (err) {
                    console.error('Error loading user:', err);
                    localStorage.removeItem('token'); // Clear invalid token
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    /**
     * Login Function
     * @param {string} username 
     * @param {string} password 
     */
    const login = async (username, password) => {
        try {
            const res = await api.post('/auth/login', { username, password });
            localStorage.setItem('token', res.data.token); // Store token
            setUser(res.data.user); // Update state
            return { success: true };
        } catch (err) {
            console.error('Login error', err);
            return {
                success: false,
                message: err.response?.data?.msg || 'Login failed'
            };
        }
    };

    /**
     * Register Function
     * @param {string} username 
     * @param {string} password 
     */
    const register = async (username, password) => {
        try {
            const res = await api.post('/auth/register', { username, password });
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            return { success: true };
        } catch (err) {
            console.error('Register error', err);
            return {
                success: false,
                message: err.response?.data?.msg || 'Registration failed'
            };
        }
    };

    /**
     * Logout Function
     * Clears token and resets state.
     */
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {/* Render children only after initial loading is done to prevent redirects */}
            {!loading && children}
        </AuthContext.Provider>
    );
};
