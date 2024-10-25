import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Importar axios para hacer solicitudes
import { AuthContext } from '../context/AuthContext'; // Importar el contexto
import '../css/login.css';
import imagen from '../images/logologin.png';
import URL from "./url";

const Login = () => {



    const navigate = useNavigate();
    const { login } = useContext(AuthContext); // Usar login del contexto
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState(null); // Para manejar errores

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const data = new URLSearchParams(); // Usar URLSearchParams para formatear correctamente los datos
        data.append('username', formData.username);
        data.append('password', formData.password);
    
        try {
            const response = await axios.post(`${URL}/auth/login/`, data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded', // Asegúrate de que el tipo de contenido sea correcto
                },
                withCredentials: true,
            });
    
            if (response.status === 200) {
                const token = response.data.token;
                const isAdmin = response.data.is_admin;
                console.log('Token recibido:', token);
                console.log('Admin:', isAdmin)
                login(token, isAdmin); // Guarda el token en el contexto
                navigate('/'); 
            } else {
                console.error('Error al iniciar sesión:', response.data.message);
                alert('Error: ' + response.data.message);
            }
        } catch (error) {
            console.error('Error al intentar iniciar sesión:', error);
            alert('Error de red: no se pudo conectar al servidor.');
        }
    };

    return (
        <div className='container-l'>
            <div className='login-container'>
                <div className='image-container'>
                    <img src={imagen} alt='Imagen' className='image' />
                </div>
                <div className='form-container-login'>
                    <h1 className='title-login'>Inicio de sesión</h1>
                    <center>
                        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Mostrar errores si existen */}
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
