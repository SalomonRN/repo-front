import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/context.css';

// Crear el contexto
export const AuthContext = createContext();

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [username, setUsername] = useState ('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedIsAdmin = localStorage.getItem('isAdmin') === 'true';
        const storedUsername = localStorage.getItem('username');

        if (storedToken) {
            setToken(storedToken);
            setIsAdmin(storedIsAdmin);
            setUsername(storedUsername);
        } 
          
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => clearTimeout(timeout);
    }, [navigate]);

    const login = (newToken, adminStatus, user) => {
        console.log("User received in login:", user);
        setToken(newToken);
        setUsername(user)
        setIsAdmin(!!adminStatus);
        localStorage.setItem('token', newToken);
        localStorage.setItem('isAdmin', adminStatus ? 'true' : 'false');
        localStorage.setItem('username', user)
    };

    const logout = () => {
        setToken(null);
        setIsAdmin(false);
        setUsername('')
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('username')
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-text">Cargando...</div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ token, isAdmin, login, logout, username }}>
            {children}
        </AuthContext.Provider>
    );
};
