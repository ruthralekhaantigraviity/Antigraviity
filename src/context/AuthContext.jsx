import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const API_URL = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const savedUser = localStorage.getItem('ff_user');
            if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
                setUser(JSON.parse(savedUser));
            }
        } catch (err) {
            console.error('AuthContext: Failed to parse saved user', err);
            localStorage.removeItem('ff_user');
            localStorage.removeItem('ff_token');
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (response.ok) {
                setUser(data.user);
                localStorage.setItem('ff_token', data.token);
                localStorage.setItem('ff_user', JSON.stringify(data.user));
                return { success: true };
            } else {
                return { success: false, error: data.error };
            }
        } catch (err) {
            return { success: false, error: 'Server connection failed' };
        }
    };

    const register = async (userData) => {
        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            const data = await response.json();
            if (response.ok) {
                return { success: true };
            } else {
                return { success: false, error: data.error };
            }
        } catch (err) {
            return { success: false, error: 'Server connection failed' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('ff_token');
        localStorage.removeItem('ff_user');
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, register, logout, isAuthenticated: !!user, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
