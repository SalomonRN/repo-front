import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/context.css';

// Crear el contexto
export const AuthContext = createContext();

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedIsAdmin = localStorage.getItem('isAdmin') === 'true';

        if (storedToken) {
            setToken(storedToken);
            setIsAdmin(storedIsAdmin);
        } 
          
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => clearTimeout(timeout);
    }, [navigate]);

    const login = (newToken, adminStatus) => {
        setToken(newToken);
        setIsAdmin(!!adminStatus);
        localStorage.setItem('token', newToken);
        localStorage.setItem('isAdmin', adminStatus ? 'true' : 'false');
    };

    const logout = () => {
        setToken(null);
        setIsAdmin(false);
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
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
        <AuthContext.Provider value={{ token, isAdmin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
