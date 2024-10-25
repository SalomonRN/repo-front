import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import '../css/ideasArchive.css';
import Header from './header';
import URL from "./url";

const IdeasArchive = () => {
    const [acceptedIdeas, setAcceptedIdeas] = useState([]);  // Estado para ideas aceptadas
    const [rejectedIdeas, setRejectedIdeas] = useState([]);  // Estado para ideas rechazadas
    const token = localStorage.getItem('token');
    const navigate = useNavigate();



    const [menuHeight, setMenuHeight] = useState('0px'); 
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
        setMenuHeight(menuOpen ? '0px' : '300px'); 
    };

    useEffect(() => {
        const fetchIdeas = async () => {
            try {
                const response = await fetch(`${URL}/project_management/ideas`, {
                    headers: {
                        'Authorization': `Token ${token}`,
                    }
                });
                if (!response.ok) {
                    throw new Error(`Error al obtener ideas: ${response.status}`);
                }

                const data = await response.json();
                const accepted = data.filter(idea => idea.status === 'AP'); // Filtrar ideas aceptadas
                const rejected = data.filter(idea => idea.status === 'RJ'); // Filtrar ideas rechazadas

                setAcceptedIdeas(accepted);
                setRejectedIdeas(rejected);
            } catch (error) {
                console.error('Error fetching ideas:', error);
            }
        };

        fetchIdeas();
    }, []);

    return (
            <div className={`ideas-archive-container ${menuOpen ? 'shifted' : ''}`} style={{ marginTop: menuHeight }}>
            <div className="header-container">
                <Header toggleMenu={toggleMenu} menuOpen={menuOpen} />
            </div>
            <div className="ideas-board-a-r accepted">
                <h1 className="title-a">Ideas Aceptadas</h1>
                <div className="ideas-list-a-r">
                    {acceptedIdeas.length > 0 ? (
                        acceptedIdeas.map((idea, index) => (
                            <div key={index} className="idea-postit-a-r">
                                <p><strong>Idea:</strong> {idea.idea}</p>
                                <p><strong>Usuario:</strong> {idea.created_by}</p>
                            </div>
                        ))
                    ) : (
                        <p className="empty-ideas">No hay ideas aceptadas por el momento</p>
                    )}
                </div>
            </div>

            <div className="ideas-board-a-r rejected">
                <h1 className="title-r">Ideas Rechazadas</h1>
                <div className="ideas-list-a-r">
                    {rejectedIdeas.length > 0 ? (
                        rejectedIdeas.map((idea, index) => (
                            <div key={index} className="idea-postit-a-r">
                                <p><strong>Idea:</strong> {idea.idea}</p>
                                <p><strong>Usuario:</strong> {idea.created_by}</p>
                            </div>
                        ))
                    ) : (
                        <p className="empty-ideas">No hay ideas rechazadas por el momento</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default IdeasArchive;
