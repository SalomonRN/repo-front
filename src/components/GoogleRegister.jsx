import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../css/register.css';
import '../css/header.css';
import imagen from '../images/logologin.png';

const Register = () => {

    const navigate = useNavigate();
    const {login} = useContext("authContext");
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password1: '',
        password2: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
         /*e.preventDefault();

        if (formData.password1 !== formData.password2) {
            setError('Las contraseñas no coinciden');
            return;
        }

        const data_obj = new FormData();
        data_obj.append('username', formData.username);
        data_obj.append('email', formData.email);
        data_obj.append('password1', formData.password1);
        data_obj.append('password2', formData.password2);

        try {
           const response = await fetch('https://django-tester.onrender.com/auth/signup/', {
                method: 'POST',
                body: data_obj,
                credentials: 'include',
            });

            const data = await response.json();
            console.log('Salomoononon:', data);

            if (response.ok) {
                login(); // Actualiza el estado de autenticación en el contexto
                localStorage.setItem('token', data.token); // Guarda el token en el almacenamiento local
                navigate('/login'); // Redirige al login después de registrar
            } else {
                throw new Error(data.message || 'Error al registrar');
            }
        } catch (err) {
            setError(err.message || 'Error en el registro');
        }
        */
    };

    const fetchContentProposal = async () => {/*
        try {
            const response = await fetch('https://django-tester.onrender.com/content_proposal/');
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
        <div className='container-r'>
            <div className="header">
            <button className="opc" onClick={() => navigate('/brainstorming')}>Ir a lluvia de ideas</button>
            <button className="opc" onClick={() => navigate('/proposals')}>Ir a Propuestas</button>
            <button className="opc" onClick={() => navigate('/proposals_form')}>Ir al formulario de Propuestas</button>
            <button className="opc" onClick={() => navigate('/calendar')}>Ir a Calendario</button>
          </div>

            <div className='register-container'>
                <div className='image-container'>
                    <img src={imagen} alt='Imagen' className='image' />
                </div>
                <div className='form-container-register'>
                    <h1 className='title-register'>Registro</h1>
                    <center>
                        <form onSubmit={handleSubmit}>
                            <input
                                type='text'
                                name='username'
                                placeholder='Nombre'
                                value={formData.username}
                                onChange={handleChange}
                                className='name-register'
                                required
                            />
                            <input
                                type='email'
                                name='email'
                                placeholder='Correo Electrónico'
                                value={formData.email}
                                onChange={handleChange}
                                className='input-field-register'
                                required
                            />
                            <input
                                type='password'
                                name='password1'
                                placeholder='Contraseña'
                                value={formData.password}
                                onChange={handleChange}
                                className='input-field-register'
                                required
                            />
                            <input
                                type='password'
                                name='password2'
                                placeholder='Confirme contraseña'
                                value={formData.password2}
                                onChange={handleChange}
                                className='input-field-register'
                                required
                            />
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                            <button type='submit' className='submit-button-r'>
                                Registrarse
                            </button>
                        </form>
                    </center>
                </div>
            </div>
        </div>
    );
}

export default Register;
