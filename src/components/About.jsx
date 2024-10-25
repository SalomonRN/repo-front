import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./header";
import axios from 'axios'
import '../css/about.css'

const About = () => {

    const navigate = useNavigate();
    const [menuHeight, setMenuHeight] = useState('0px');
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
        setMenuHeight(menuOpen ? '0px' : '300px');
    };

    const [errorMessage, setErrorMessage] = useState('')

    const [formData, setFormData] = useState({
        subject: '',
        email: '',
        message: ''
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(); 
        data.append('subject', formData.subject);
        data.append('email', formData.email);
        data.append('message', formData.message);

        console.log('Datos a enviar:', Object.fromEntries(data.entries())); // Muestra los datos que se envían

        try {
            const response = await fetch('https://django-tester.onrender.com/support/contact/', {
                method: 'POST',
                body: data, 
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error del servidor:', errorData);
                setErrorMessage(errorData.detail || 'Error al enviar el mensaje.');
            } else {
                alert('Mensaje enviado con éxito.');
                console.log('Formulario enviado:', formData);
                setFormData({ email: '', subject: '', message: '' });
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            alert('Hubo un error al enviar el mensaje. Intenta de nuevo más tarde.');
        }
    };


    return (
            <div className={`main-container ${menuOpen ? 'shifted' : ''}`} style={{ marginTop: menuHeight }}>
            <div className="header-container">
                <Header toggleMenu={toggleMenu} menuOpen={menuOpen} />
            </div>
            <div className="about-container">
                <section className="about-header">
                    <h1 className="title-about">Sobre Nuestra Aplicación</h1>
                    <p className="p1-about">Bienvenidos a la próxima evolución en innovación y colaboración.
                        Nuestra aplicación ha sido diseñada con un propósito claro: empoderar a las mentes creativas,
                        simplificar procesos y transformar ideas en realidad. Con una interfaz intuitiva y herramientas
                        diseñadas para potenciar la productividad, te ofrecemos una plataforma donde cada propuesta cobra
                        vida, cada evento está a un clic de distancia, y la creatividad no tiene límites. Aquí, el trabajo
                        en equipo y la eficiencia se encuentran para crear soluciones únicas.</p>
                </section>

                <section className="about-content">
                    <div className="about-objective">
                        <h2 className="subtitle-about">Nuestros Objetivos :D</h2>
                    </div>

                    <div className="about-goals">
                        <div className="goal-item">
                            <h3 className="goal-about">Inspirar Colaboración</h3>
                            <p className="p-goal">Fomentamos el trabajo en equipo, permitiendo que las ideas fluyan libremente
                                y evolucionen a través de propuestas dinámicas.</p>
                        </div>

                        <div className="goal-item">
                            <h3 className="goal-about">Simplificar la Gestión</h3>
                            <p className="p-goal">Desde la planificación hasta la ejecución, nuestra app transforma la gestión de proyectos
                                en una experiencia fluida y organizada.</p>
                        </div>

                        <div className="goal-item">
                            <h3 className="goal-about">Transformar la productividad</h3>
                            <p className="p-goal">Con un enfoque en la eficiencia, nuestra app te ayuda a mantener el control total de tus
                                proyectos y eventos, para que puedas concentrarte en lo que realmente importa: hacer que las cosas sucedan.</p>
                        </div>

                        <div className="goal-item">
                            <h3 className="goal-about">Impulsar el reconociminedo digital</h3>
                            <p className="p-goal">Nos comprometemos a hacer que tu empresa sea más visible y reconocida en el mundo digital,
                                proporcionando las herramientas necesarias para destacar y sobresalir en un mercado competitivo.</p>
                        </div>

                    </div>
                </section>

                <section className="about-contact">
                    <h2 className="title-contact">Contáctanos</h2>
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Correo Electrónico</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="subject">Asunto</label>
                            <input
                                type="text"
                                name="subject"
                                id="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="message">Mensaje</label>
                            <textarea
                                className="textarea-about"
                                name="message"
                                id="message"
                                rows="5"
                                value={formData.message}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>

                        {errorMessage && <p className="error-message">{errorMessage}</p>}

                        <button type="submit" className="send-btn">Enviar Mensaje</button>
                    </form>
                </section>
            </div>
        </div>
    );
}
export default About;
