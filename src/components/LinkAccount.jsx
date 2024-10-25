import React, { useState, useEffect } from "react";
import '../css/linkAccount.css';
import Header from "./header";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import URL from "./url";

const LinkAccount = () => {



    const location = useLocation();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    // Estados para el manejo de cuentas vinculadas
    const [isGoogleLinked, setIsGoogleLinked] = useState(localStorage.getItem('isGoogleLinked') === 'true');
    const [isMetaLinked, setIsMetaLinked] = useState(localStorage.getItem('isMetaLinked') === 'true');

    useEffect(() => {
        if (!token) {
            setError('No se encontró el token de autenticación. Por favor, inicia sesión nuevamente.');
            return;
        }

        // Procesar la URL de callback
        const queryString = location.search;
        if (queryString.includes('code=')) {
            if (queryString.includes('state=google')) {
                handleOauthCallbackGoogle(queryString);
            } else if (queryString.includes('state=meta')) {
                handleOauthCallbackMeta(queryString);
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
            if (data) {
                window.location.href = data; // Redirige a la autenticación de Google
            } else {
                setError('Error al obtener la URL de autenticación de Google');
            }
        } catch (error) {
            setError('Error al iniciar el proceso de vinculación con Google');
        }
    };

    const handleLinkMeta = async () => {
        window.location.href = 'https://www.facebook.com/v17.0/dialog/oauth?client_id=1360414881319473&redirect_uri=https%3A%2F%2Frepo-front-o1hw.onrender.com%2Fauth%2Fmeta%2F&scope=email%2Cpages_manage_cta%2Cpages_manage_instant_articles%2Cpages_manage_engagement%2Cpages_manage_posts%2Cpages_read_engagement%2Cpublish_video%2Cinstagram_basic%2Cinstagram_shopping_tag_products%2Cinstagram_content_publish&response_type=code&state=meta'; // Agregar state
    };

    const handleOauthCallbackGoogle = async (queryString) => {
        const url = `${URL}/auth/google/oauth2callback${queryString}`;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setIsGoogleLinked(true);
                localStorage.setItem('isGoogleLinked', 'true');
                Swal.fire({
                    title: 'Vinculación exitosa!',
                    text: 'La cuenta de Google ha sido vinculada',
                    icon: 'success',
                }).then(() => navigate('/link_account')); // Redirigir después del SweetAlert
            } else {
                const errorData = await response.json();
                setError(`Error al procesar el callback de Google: ${errorData.message}`);
            }
        } catch (error) {
            setError('Error en la solicitud al servidor');
        }
    };

    const handleOauthCallbackMeta = async (queryString) => {
        const url = `${URL}/auth/meta/${queryString}`;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.ok) {
                const responseData = await response.json(); 
                console.log(JSON.stringify(responseData, null, 2)); 
    
                setIsMetaLinked(true);
                localStorage.setItem('isMetaLinked', 'true');
                Swal.fire({
                    title: 'Vinculación exitosa!',
                    text: 'La cuenta de Meta ha sido vinculada',
                    icon: 'success',
                }).then(() => navigate('/link_account')); 
            } else {
                const errorData = await response.json();
                setError(`Error al procesar el callback de Meta: ${errorData.message}`);
                console.log(`Error al procesar el callback de Meta: ${JSON.stringify(errorData, null, 2)}`); 
            }
        } catch (error) {
            setError('Error en la solicitud al servidor');
            console.log('Error en la solicitud al servidor:', error); 
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
                localStorage.removeItem('isGoogleLinked');
                setIsGoogleLinked(false);
                Swal.fire({
                    title: 'Desvinculación exitosa!',
                    text: 'La cuenta de Google ha sido desvinculada con éxito',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then(() => navigate('/link_account'));
            } else {
                const errorData = await response.json();
                setError(`Error al desvincular la cuenta de Google: ${errorData.message}`);
            }
        } catch (error) {
            setError('Error al procesar la solicitud de desvinculación');
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
                localStorage.removeItem('isMetaLinked');
                setIsMetaLinked(false);
                Swal.fire({
                    title: 'Desvinculación exitosa!',
                    text: 'La cuenta de Meta ha sido desvinculada con éxito',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then(() => navigate('/link_account'));
            } else {
                const errorData = await response.json();
                setError(`Error al desvincular la cuenta de Meta: ${errorData.message}`);
            }
        } catch (error) {
            setError('Error al procesar la solicitud de desvinculación');
        }
    };

    useEffect(() => {
        setIsGoogleLinked(localStorage.getItem('isGoogleLinked') === 'true');
        setIsMetaLinked(localStorage.getItem('isMetaLinked') === 'true');
    }, []);

    return (
        <div className="link-container">
            {/*<Header /> */}
            <h1>Vinculación de cuentas</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <center>
                {isGoogleLinked ? (
                    <button onClick={handleUnlinkGoogle}>Desvincular cuenta de Google</button>
                ) : (
                    <button onClick={handleLinkGoogle}>Iniciar Vinculación con Google</button>
                )}
                {isMetaLinked ? (
                    <button onClick={handleUnlinkMeta}>Desvincular cuenta de Meta</button>
                ) : (
                    <button onClick={handleLinkMeta}>Iniciar Vinculación con Meta</button>
                )}
            </center>
        </div>
    );
};

export default LinkAccount;
