import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../css/header.css';

const Header = ({ toggleMenu, menuOpen }) => {


    const navigate = useNavigate();
    const { logout, isAdmin } = useContext(AuthContext);
    const isLoggedIn = !!localStorage.getItem('token');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleBrainstormingRedirect = () => {
        if (isAdmin) {
            navigate('/brainstorming');
        } else {
            navigate('/brainstormingCm');
        }
    }

    const handleProposalsRedirect = () => {
        if (isAdmin) {
            navigate('/proposals');
        } else {
            navigate('/proposals_cm');
        }
    }


    return (
        <div className="header">
            <button className="hamburger" onClick={toggleMenu}>
                ☰
            </button>
            <div className={`menu ${menuOpen ? 'open' : ''}`}>
                <center>
                    <button className="opc" onClick={() => navigate('/')}>Home</button>
                    <button className="opc" onClick={handleBrainstormingRedirect}>Lluvia de ideas</button>
                    <button className="opc" onClick={handleProposalsRedirect}>Propuestas</button>
                    <button className="opc" onClick={() => navigate('/proposals_form')}>Formulario de Propuestas</button>
                    <button className="opc" onClick={() => navigate('/calendar')}>Calendario</button>
                    <button className="opc" onClick={() => navigate('/about')}>About</button>
                    {/*<button className="opc" onClick={() => navigate('/link_account')}>Ir a Vinvular cuentas</button>*/}
                    {isLoggedIn && (
                        <button className="opc" onClick={handleLogout}>Cerrar sesión</button>
                    )}
                </center>
            </div>
        </div>
    );
};

export default Header;
