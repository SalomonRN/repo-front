import React, { useState, useEffect } from "react";
import '../css/linkAccount.css';
import { useLocation, useNavigate } from "react-router-dom"; // Importar useNavigate
import Swal from 'sweetalert2'; // Importar SweetAlert
import URL from "./url";

const LinkAccount = () => {
    const location = useLocation();
    const navigate = useNavigate(); // Para manejar la redirección
    const [error, setError] = useState(null);
    const [hasCheckedGoogle, setHasCheckedGoogle] = useState(false);
    const [hasCheckedMeta, setHasCheckedMeta] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token')); // Obtener el token del localStorage
    const [isGoogleLinked, setIsGoogleLinked] = useState(localStorage.getItem('isGoogleLinked') === 'true'); // Estado de vinculación de Google
    const [isMetaLinked, setIsMetaLinked] = useState(localStorage.getItem('isMetaLinked') === 'true'); // Estado de vinculación de Meta

    useEffect(() => {
        // Verificar el token al cargar el componente
        if (!token) {
            console.error('No se encontró el token de autenticación');
            setError('No se encontró el token de autenticación. Por favor, inicia sesión nuevamente.');
            return; // Salir si no hay token
        }

        // Si hay parámetros en la URL, llamar a la función de callback para Google
        const queryString = location.search;
        if (!hasCheckedGoogle && queryString) {
            const params = new URLSearchParams(queryString);
            const code = params.get('code');
            const state = params.get('state');

            // Solo proceder si existen los parámetros de Google en la URL
            if (code && state) {
                handleOauthCallback(queryString, 'google'); // Llama a la función de callback para Google
                setHasCheckedGoogle(true); // Marca que ya se ha ejecutado el callback de Google
            }
        }

        // Si hay parámetros en la URL, llamar a la función de callback para Meta
        if (!hasCheckedMeta && queryString) {
            const params = new URLSearchParams(queryString);
            const code = params.get('code');
            const state = params.get('state');

            // Solo proceder si existen los parámetros de Meta en la URL
            if (code && state) {
                handleOauthMetaCallback(queryString); // Llama a la función de callback para Meta
                setHasCheckedMeta(true); // Marca que ya se ha ejecutado el callback de Meta
            }
        }
    }, [hasCheckedGoogle, hasCheckedMeta, location.search, token]); // Dependencias de useEffect

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
            console.log('url:', data)
            if (data) {
                window.location.href = data; // Redirige a la autenticación de Google
            } else {
                setError('Error al obtener la URL de autenticación de Google');
            }
        } catch (error) {
            setError('Error al iniciar el proceso de vinculación con Google');
        }
    };

    const handleLinkMeta = () => {
        const metaAuthUrl = 'https://www.facebook.com/v17.0/dialog/oauth?client_id=1360414881319473&redirect_uri=https%3A%2F%2Frepo-front-o1hw.onrender.com%2Fauth%2Fmeta%2F&scope=email%2Cpages_manage_cta%2Cpages_manage_instant_articles%2Cpages_manage_engagement%2Cpages_manage_posts%2Cpages_read_engagement%2Cpublish_video%2Cinstagram_basic%2Cinstagram_shopping_tag_products%2Cinstagram_content_publish&response_type=code&ret=login&fbapp_pres=0&logger_id=41cf9ed8-b228-4b0f-af1e-a2806bd3a321&tp=unspecified&cbt=1725916819679&ext=1725920435&hash=AeZAyJGld3iQbPmNgr4';

        // Redirigir a la URL de autenticación de Meta
        window.location.href = metaAuthUrl;
    };

    const handleOauthMetaCallback = async (queryString) => {
        console.log('Procesando callback de Meta con queryString:', queryString);

        const url = `${URL}/auth/meta/${queryString}`; // Corregido el URL

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`, // Agregar el token a la cabecera
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Resultado del servidor Meta:', result);
                setIsMetaLinked(true); // Cambiar estado a vinculado para Meta
                localStorage.setItem('isMetaLinked', 'true'); // Guardar en localStorage

                // Usar SweetAlert para mostrar la vinculación exitosa
                Swal.fire({
                    title: 'Vinculación exitosa!',
                    text: 'La cuenta de Meta ha sido vinculada con éxito',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    navigate('/link_account'); // Redirigir al componente LinkAccount
                });
            } else {
                const errorData = await response.json();
                setError(`Error al procesar el callback de Meta: ${errorData.message}`);
            }
        } catch (error) {
            setError('Error en la solicitud al servidor');
        }
    };

    const handleOauthCallback = async (queryString) => {
        console.log('Procesando callback con queryString:', queryString);

        const url = `https://django-tester.onrender.com/auth/google/oauth2callback${queryString}`;

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
                console.log('Resultado del servidor:', result);
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

    const handleUnlinkGoogle = async () => {
        try {
            const response = await fetch(`${URL}/auth/unlink/google/`, {
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
                setError(`Error al desvincular la cuenta de Google: ${errorData.message}`);
            }
        } catch (error) {
            setError('Error en la solicitud al servidor');
        }
    };

    const handleUnlinkMeta = async () => {
        try {
            const response = await fetch(`${URL}/auth/unlink/meta/`, {
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
                setError(`Error al desvincular la cuenta de Meta: ${errorData.message}`);
            }
        } catch (error) {
            setError('Error en la solicitud al servidor');
        }
    };

    return (
        <div className="link-container">
            <center>
            <h1>Vinculación de cuentas</h1>
            {error && <p className="error-message">{error}</p>}
            
            <button className="google-button" onClick={isGoogleLinked ? handleUnlinkGoogle : handleLinkGoogle}>
                {isGoogleLinked ? 'Desvincular cuenta' : 'Vincular cuenta de Google'}
            </button>
            <button className="meta-button" onClick={isMetaLinked ? handleUnlinkMeta : handleLinkMeta}>
                {isMetaLinked ? 'Desvincular cuenta' : 'Vincular cuenta de Meta'}
            </button>
            </center>
        </div>
    );
};

export default LinkAccount;
