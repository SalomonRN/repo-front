import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../css/home.css';
import '../css/header.css';
import Header from "./header";

const Home = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [showTutorial, setShowTutorial] = useState(false);
    const [hideTutorialPermanently, setHideTutorialPermanently] = useState(false);
    const navigate = useNavigate();

    
    useEffect(() => {
        const hideTutorial = localStorage.getItem("hideTutorial");
        if (!hideTutorial) {
            setShowTutorial(true);
        }
    }, []);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const closeTutorial = () => {
        if (hideTutorialPermanently) {
            localStorage.setItem("hideTutorial", "true");
        }
        setShowTutorial(false);
    };

    const handleCheckboxChange = () => {
        setHideTutorialPermanently(!hideTutorialPermanently);
    };

    return (
        <div className={`home-container ${menuOpen ? 'shifted' : ''}`}>
            <div className="header-container">
                <Header toggleMenu={toggleMenu} menuOpen={menuOpen} />
            </div>
            <h1 className="title-home">¡Bienvenido!</h1>
            <p className="p-home">
            Este es más que un simple espacio: es una comunidad de soñadores, creadores y líderes como tú, 
            comprometidos con transformar ideas en realidades. Te invitamos a formar parte de un viaje de 
            crecimiento y aprendizaje, donde cada opinión es respetada y cada visión tiene un impacto. 
            En este camino, cada aporte cuenta, cada voz se escucha, y cada idea es un paso hacia un futuro 
            más brillante y lleno de oportunidades. Ven, inspírate y deja tu huella en este emocionante viaje 
            de transformación
            </p>
    
            {showTutorial && (
                <>
                    {/* Agrega el overlay */}
                    <div className="overlay" onClick={closeTutorial}></div>
                    
                    <div className="tutorial-modal">
                        {/*<button className="close-button" onClick={closeTutorial}>X</button> */}
                        <h1 className="tuto-title"><center>Tutorial de Inicio</center></h1>
                        <div className="tutorial-section">
                            <h3>1. ¿Tienes una idea? ¡Plásmala!</h3>
                            <p>Entra a la sección de lluvia de ideas para agregar tu idea y editarla. Los administrativos la revisarán para aprobarla o rechazarla.</p>
                        </div>
                        <div className="tutorial-section">
                            <h3>2. ¿Tienes una propuesta? ¡Envíala!</h3>
                            <p>Accede a la sección de propuestas y envía tu contenido. Podrás visualizarlo en la lista de propuestas.</p>
                        </div>
                        <div className="tutorial-section">
                            <h3>3. Revisa las propuestas actuales</h3>
                            <p>En la sección de propuestas puedes ver todas las propuestas y sus detalles, así como los comentarios de CM y administrativos.</p>
                        </div>
                        <div className="tutorial-section">
                            <h3>4. Eventos importantes</h3>
                            <p>Consulta el calendario para ver eventos programados y estar al día con el esquema.</p>
                        </div>
                        <div className="tutorial-section">
                            <h3>5. ¿Necesitas ayuda?</h3>
                            <p>Visita la sección de "About" para enviar preguntas o sugerencias que serán respondidas oportunamente.</p>
                        </div>
                        <p className="note"><i>Recuerda que cada rol tiene funciones específicas</i></p>
                        <div className="tutorial-footer">
                            <label>
                                <input 
                                    type="checkbox" 
                                    checked={hideTutorialPermanently} 
                                    onChange={handleCheckboxChange} 
                                />
                                No volver a mostrar
                            </label>
                            <button className="btn-close" onClick={closeTutorial}>Cerrar</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
    
};

export default Home;
