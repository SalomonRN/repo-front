import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import '../css/login.css';
import '../css/header.css';
import imagen from '../images/logologin.png';

const Login = () => {

    const { login } = useContext("authContext");
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('username', formData.username);
        data.append('password', formData.password);
/*
        try {
           const response = await fetch('https://django-tester.onrender.com/auth/login/', {
                method: 'POST',
                body: data,  
                credentials: 'include',
            });

            const result = await response.json();

            if (response.ok) {
                console.log('Login exitoso:', result);
                const token = result.token;  
                localStorage.setItem('token', token); // Guarda el token en el localStorage
                login();
                navigate('/calendar');  // Redirigir después de iniciar sesión

            } else {
                alert('Error en la autenticación: ' + result.message);
            }

        } catch (error) {
            console.error('Error al intentar iniciar sesión:', error);
            alert('Error de red: no se pudo conectar al servidor.');
        }*/
        login();
        navigate('/calendar');  // Redirigir después de iniciar sesión
        console.log("HOLA")
    }

    const fetchContentProposal = async () => {
        /*
        try {
            const response = await fetch('https://django-tester.onrender.com/content_proposal/', {
                credentials: 'include',
            });
            const data = await response.json();

            if (response.ok) {
                console.log('Contenido de propuestas:', data);  
            } else {
                console.error('Error al obtener las propuestas:', data);
            }
        } catch (error) {
            console.error('Error en la solicitud GET:', error);
        }*/
    };

    // Fetch content proposal when component mounts
    useEffect(() => {
        fetchContentProposal();
    }, []);

    return (
        <div className='container-l'>
            <div className="header">
                <button className="opc" onClick={() => navigate('/brainstorming')}>Ir a lluvia de ideas</button>
                <button className="opc" onClick={() => navigate('/proposals')}>Ir a Propuestas</button>
                <button className="opc" onClick={() => navigate('/proposals_form')}>Ir al formulario de Propuestas</button>
                <button className="opc" onClick={() => navigate('/calendar')}>Ir a Calendario</button>
            </div>
            <div className='login-container'>
                <div className='image-container'>
                    <img src={imagen} alt='Imagen' className='image' />
                </div>
                <div className='form-container-login'>
                    <h1 className='title-login'>Inicio de sesión</h1>
                    <center>
                        <form onSubmit={handleSubmit}>
                            <input
                                type='text'
                                name='username'
                                placeholder='Username'
                                value={formData.username}
                                onChange={handleChange}
                                className='input-field-login'
                                required
                            />
                            <input
                                type='password'
                                name='password'
                                placeholder='Contraseña'
                                value={formData.password}
                                onChange={handleChange}
                                className='input-field-login'
                                required
                            />
                            <button type='submit' className='submit-button-l'>
                                Ingresar
                            </button>
                        </form> 
                    </center>
                </div>
            </div>
        </div>
    );
};

export default Login;
