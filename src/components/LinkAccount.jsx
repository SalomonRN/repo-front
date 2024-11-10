import React, { useState, useEffect } from "react";
import '../css/linkAccount.css';
import { useLocation, useNavigate } from "react-router-dom"; 
import Swal from 'sweetalert2'; 
import URL from "./url";
import Header from "./header";

const LinkAccount = () => {
    const location = useLocation();
    const navigate = useNavigate(); 
    const [error, setError] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token')); 
    const [isGoogleLinked, setIsGoogleLinked] = useState(localStorage.getItem('isGoogleLinked') === 'true');
    const [isMetaLinked, setIsMetaLinked] = useState(localStorage.getItem('isMetaLinked') === 'true'); 
    const [isTikTokLinked, setIsTikTokLinked] = useState(localStorage.getItem('isTikTokLinked') === 'true'); 

    const [menuHeight, setMenuHeight] = useState('0px');
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
        setMenuHeight(menuOpen ? '0px' : '400px');
    };

    useEffect(() => {
        if (!token) {
            setError('No se encontró el token de autenticación. Por favor, inicia sesión nuevamente.');
            return; 
        }

        const queryString = location.search;
        const params = new URLSearchParams(queryString);
        const code = params.get('code');
        const state = params.get('state');
        const scopes = params.get('scopes');

        if (code) {
            if (location.pathname.includes('google')) {
                handleGoogleCallback(queryString);
            } else if (location.pathname.includes('meta')) {
                handleMetaCallback(queryString);
            } else if (location.pathname.includes('tiktok')){
                handleTikTokCallback(queryString);
            }
        }
    }, [location.search, token]);

    const handleLinkGoogle = async () => {
        try {
            const response = await fetch(`${URL}/auth/google/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            console.log('url: ', data)
            if (data) {
                window.location.href = data;
            } else {
                setError('Error al obtener la URL de autenticación de Google');
            }
        } catch (error) {
            setError('Error al iniciar el proceso de vinculación con Google');
        }
    };

    const handleLinkMeta = () => {
        const meta_Url = 'https://www.facebook.com/v17.0/dialog/oauth?client_id=1360414881319473&redirect_uri=https%3A%2F%2Frepo-front-o1hw.onrender.com%2Fauth%2Fmeta%2F&scope=email%2Cpages_manage_cta%2Cpages_manage_instant_articles%2Cpages_manage_engagement%2Cpages_manage_posts%2Cpages_read_engagement%2Cpublish_video%2Cinstagram_basic%2Cinstagram_shopping_tag_products%2Cinstagram_content_publish&response_type=code&ret=login&fbapp_pres=0&logger_id=41cf9ed8-b228-4b0f-af1e-a2806bd3a321&tp=unspecified&cbt=1725916819679&ext=1725920435&hash=AeZAyJGld3iQbPmNgr4';
        window.location.href = meta_Url;
    };

    const handleLinkTikTok = async () => {
        try {
            const response = await fetch(`${URL}/auth/tiktok/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            console.log('url: ', data)
            if (data) {
                window.location.href = data;
            } else {
                setError('Error al obtener la URL de autenticación de TikTok');
            }
        } catch (error) {
            setError('Error al iniciar el proceso de vinculación con TikTok');
        }
    };

    const handleGoogleCallback = async (queryString) => {
        const url = `${URL}/auth/google/oauth2callback/?${queryString}`;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                setIsGoogleLinked(true); 
                localStorage.setItem('isGoogleLinked', 'true');
                Swal.fire({
                    title: 'Vinculación exitosa!',
                    text: 'La cuenta de Google ha sido vinculada con éxito',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    navigate('/link_account'); 
                });
            } else {
                const errorData = await response.json();
                setError(`Error al procesar el callback de Google: ${errorData.message}`);
            }
        } catch (error) {
            setError('Error en la solicitud al servidor');
        }
    };

    const handleMetaCallback = async (queryString) => {
    
        try {
            const response = await fetch(`${URL}/auth/meta/${queryString}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                setIsMetaLinked(true); 
                localStorage.setItem('isMetaLinked', 'true');
                Swal.fire({
                    title: 'Vinculación exitosa!',
                    text: 'La cuenta de Meta ha sido vinculada con éxito',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    navigate('/link_account'); 
                });
            } else {
                const errorData = await response.json();
                setError(`Error al procesar el callback de Meta: ${errorData.message}`);
            }
        } catch (error) {
            setError('Error en la solicitud al servidor');
        }
    };

    const handleTikTokCallback = async (queryString) => {

        if (!token) {
            navigate('/login'); 
            return;
        }

        const url = `${URL}/auth/tiktok/oauth2callback/${queryString}`;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                setIsTikTokLinked(true); 
                localStorage.setItem('isTikTokLinked', 'true');
                Swal.fire({
                    title: 'Vinculación exitosa!',
                    text: 'La cuenta de TikTok ha sido vinculada con éxito',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    navigate('/link_account'); 
                });
            } else {
                const errorData = await response.json();
                setError(`Error al procesar el callback de TikTok: ${errorData.message}`);
            }
        } catch (error) {
            setError('Error en la solicitud al servidor');
        }
    };

    const handleUnlinkGoogle = async () => {
        try {
            const response = await fetch(`${URL}/auth/google/unlink`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setIsGoogleLinked(false);
                localStorage.setItem('isGoogleLinked', 'false');
                Swal.fire({
                    title: 'Desvinculación exitosa!',
                    text: 'La cuenta de Google ha sido desvinculada con éxito',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });
            } else {
                const errorData = await response.json();
                setError(`Error al desvincular Google: ${errorData.message}`);
            }
        } catch (error) {
            setError('Error en la solicitud al servidor');
        }
    };

    const handleUnlinkMeta = async () => {
        try {
            const response = await fetch(`${URL}/auth/meta/unlink`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setIsMetaLinked(false);
                localStorage.setItem('isMetaLinked', 'false');
                Swal.fire({
                    title: 'Desvinculación exitosa!',
                    text: 'La cuenta de Meta ha sido desvinculada con éxito',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });
            } else {
                const errorData = await response.json();
                setError(`Error al desvincular Meta: ${errorData.message}`);
            }
        } catch (error) {
            setError('Error en la solicitud al servidor');
        }
    };

    const handleUnlinkTikTok = async () => {
        try {
            const response = await fetch(`${URL}/auth/tiktok/unlink`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setIsTikTokLinked(false);
                localStorage.setItem('isTikTokLinked', 'false');
                Swal.fire({
                    title: 'Desvinculación exitosa!',
                    text: 'La cuenta de TikTok ha sido desvinculada con éxito',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });
            } else {
                const errorData = await response.json();
                setError(`Error al desvincular TikTok: ${errorData.message}`);
            }
        } catch (error) {
            setError('Error en la solicitud al servidor');
        }
    };

    return (
            <div className={`link-container ${menuOpen ? 'shifted' : ''}`} style={{ marginTop: menuHeight }}>
            <div className="header-container">
                <Header toggleMenu={toggleMenu} menuOpen={menuOpen} />
            </div>
            <center><h1>Vincular Cuentas</h1>
            {error && <p className="error-message">{error}</p>}
            <button className="btn-link-acc" onClick={isGoogleLinked ? handleUnlinkGoogle : handleLinkGoogle}>
                {isGoogleLinked ? 'Desvincular Google' : 'Vincular Google'}
            </button>
            <button className="btn-link-acc" onClick={isMetaLinked ? handleUnlinkMeta : handleLinkMeta}>
                {isMetaLinked ? 'Desvincular Meta' : 'Vincular Meta'}
            </button>
            <button className="btn-link-acc" onClick={isTikTokLinked ? handleUnlinkTikTok : handleLinkTikTok}>
                {isTikTokLinked ? 'Desvincular TikTok' : 'Vincular TikTok'}
            </button>
            </center>
        </div>
    );
};


export default LinkAccount;
