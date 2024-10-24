import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { useNavigate } from 'react-router-dom';


import Header from './header';

const Brainstorming = () => {
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin');
    const [menuHeight, setMenuHeight] = useState('0px'); 
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
        setMenuHeight(menuOpen ? '0px' : '300px'); 
    };
    
    const URL = 'https://django-tester.onrender.com';
    
    const [ideas, setIdeas] = useState([]); // Estado para almacenar las ideas
    const [newIdea, setNewIdea] = useState(''); // Estado para la nueva idea 
    const [modalIsOpen, setModalIsOpen] = useState(false); // Estado para controlar si el modal está abierto
    const [selectedIdea, setSelectedIdea] = useState(null); // Estado para la idea seleccionada en el modal
    const [error, setError] = useState(''); // Estado para manejar errores
    const [action, setAction] = useState(''); // Estado para la acción seleccionada (aceptar/rechazar) en el modal
    const [reason, setReason] = useState('')
    const [archivedIdeas, setArchivedIdeas] = useState([]); // Ideas aceptadas y rechazadas
    const navigate = useNavigate(); // para pasar al otro componente

    useEffect(() => {
        if (!token) {
            alert('Token no disponible. Por favor, inicia sesión nuevamente.');
            navigate('/login');
        } else {
            console.log("is_admin:", isAdmin); // Mostramos is_admin en consola
        }
    }, [token, navigate, isAdmin]);

    useEffect(() => {
        if (token) {
            fetchIdeas();
        }
    }, [token]);

    const fetchIdeas = () => {
        fetch(`${URL}/project_management/ideas`, {
            headers: {
                'Authorization': `Token ${token}`,
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log("Ideas:", data);
                // Filtrar ideas aceptadas o rechazadas
                const pendingIdeas = data.filter(idea => idea.status !== 'AP' && idea.status !== 'RJ');
                const archived = data.filter(idea => idea.status === 'AP' || idea.status === 'RJ');
                setIdeas(pendingIdeas); // Solo las ideas pendientes se muestran
                setArchivedIdeas(archived); // Guardar las aceptadas y rechazadas
            })
            .catch(error => console.error('Error al cargar las ideas:', error));
    };


    const handleInputChange = (e) => {
        setNewIdea(e.target.value);
    };

    const handleAddIdea = () => {
        if (newIdea.trim().length < 5) {
            alert('La idea debe tener al menos 5 caracteres.');
            return;
        }

        const formData = new FormData();
        formData.append('idea', newIdea);

        fetch(`${URL}/project_management/ideas/`, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${token}`,
            },
            body: formData,
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(errData => {
                        console.error("Error de respuesta del servidor:", errData);
                        const errorMessage = errData || `Error: ${response.status} - ${response.statusText}`;
                        throw new Error(errorMessage);
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log("Idea creada correctamente:", data);
                setIdeas(prevIdeas => [...prevIdeas, data]);
                setNewIdea('');
                alert('Idea creada exitosamente.');
                fetchIdeas();
            })
            .catch(error => {
                console.error("Error al crear la idea:", error);
                setError(error.message);
            });
    };

    // Abre el modal para una idea específica
    const openModal = (idea) => {
        setSelectedIdea(idea);
        setModalIsOpen(true);
    };

    // Cierra el modal
    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedIdea(null);
        setAction('');
        setError('');
    };

    // Maneja la acción de aceptar o rechazar la idea
    const handleAction = async () => {
        const formData = new FormData();

        if (action === 'RJ' && reason.trim() === '') {
            alert('Debes proporcionar un motivo para rechazar la idea');
            return;
        }

        if (selectedIdea) {
            formData.append('id', selectedIdea.id);
            formData.append('status', action); // 'AP' o 'RJ'
            if (action === 'RJ') formData.append('reason', reason);

            try {
                const response = await fetch(`${URL}/project_management/change-idea-status/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                    body: formData,
                });

                if (!response.ok) {
                    const errData = await response.json();
                    const errorMessage = errData.message || `Error: ${response.status} - ${response.statusText}`;
                    throw new Error(errorMessage);
                }

                alert(`Idea ${action === 'AP' ? 'aceptada' : 'rechazada'} exitosamente`);

                // Mover la idea a la lista de archivadas
                setIdeas(prevIdeas => prevIdeas.filter(idea => idea.id !== selectedIdea.id));
                setArchivedIdeas(prevArchived => [...prevArchived, { ...selectedIdea, status: action }]);

                closeModal();
            } catch (error) {
                console.error(`Error al ${action === 'AP' ? 'aceptar' : 'rechazar'} la idea:`, error);
                setError(error.message);
            }

        } else if (action === 'edit') {
            if (selectedIdea && selectedIdea.idea) {

                formData.append('idea', selectedIdea.idea);

                try {
                    const response = await fetch(`${URL}/project_management/ideas/${selectedIdea.id}/`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Token ${token}`,
                        },
                        body: formData,
                    });

                    if (!response.ok) {
                        const errData = await response.json();


                        console.error("Error de respuesta del servidor:", errData);
                        const errorMessage = errData || `Error: ${response.status} - ${response.statusText}`;
                        throw new Error(errorMessage);
                    }

                    alert('Idea editada con exito')
                    console.log("Idea editada correctamente:");
                    const updatedIdeas = ideas.map(idea =>
                        idea.id === selectedIdea.id ? { ...idea, idea: selectedIdea.idea } : idea
                    );
                    setIdeas(updatedIdeas); // Actualiza la lista de ideas
                    closeModal();
                } catch (error) {
                    console.error("Error al editar la idea:", error);
                    setError(error.message);
                }
            }


        } else if (action === 'delete') {
            if (selectedIdea) {
                try {
                    console.log("ID de la idea seleccionada:", selectedIdea.id);

                    const response = await fetch(`${URL}/project_management/ideas/${selectedIdea.id}/`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Token ${token}`,
                        },

                    });

                    if (!response.ok) {
                        const errData = await response.json();
                        console.error("Error de respuesta del servidor:", errData);
                        const errorMessage = errData.message || errData.detail || `Error: ${response.status} - ${response.statusText}`;
                        throw new Error(errorMessage);
                    }

                    alert('Idea eliminada con exito')
                    console.log("Idea eliminada correctamente:");
                    setIdeas(ideas.filter(i => i.id !== selectedIdea.id));
                    closeModal();
                } catch (error) {
                    console.error("Error al eliminar la idea:", error);
                    alert(`Error al eliminar la idea: ${error.message}`);
                    setError(error.message);
                }
            } else {
                alert("No se seleccionó ninguna idea para eliminar.");
            }
        }

    };

    return (
        <div className={`brainstorming-container ${menuOpen ? 'shifted' : ''}`} style={{ marginTop: menuHeight }}>
            <div className="header-container">
                <Header toggleMenu={toggleMenu} menuOpen={menuOpen} />
            </div>
            <div className="brainstorming-header">
            <h1 className="title-brainstorming">Lluvia de ideas</h1>
            <button className="archive-button" onClick={() => navigate('/ideas-archive')}>
                Ideas Aceptadas/Rechazadas
            </button>
        </div>
            <center>
                <textarea
                    className="textarea-brainstorming"
                    value={newIdea}
                    onChange={handleInputChange}
                    placeholder="Añade una nueva idea..."
                ></textarea>
                <br />
                <button className="btn-add" onClick={handleAddIdea}>Agregar idea</button>
            </center>
            {error && <div className="error-message">{error}</div>} {/* Mensaje de error */}
            <div className="ideas-board">
                {ideas.map((idea, index) => (
                    <div key={index} className="idea-postit" onClick={() => openModal(idea)}>
                        <b>Idea: </b> {idea.idea} {/* Muestra solo el texto de la idea */}<br />
                        <b>Creada por: </b> {idea.created_by}
                    </div>
                ))}
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Idea Modal"
                className="modal"
                overlayClassName="modal-overlay"
            >
                <h2>¿Qué deseas hacer con la idea?</h2>
                <br />
                <select
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                >
                    <option value="" disabled>Selecciona una acción</option>
                    <option value="AP">Aceptar</option>
                    <option value="RJ">Rechazar</option>
                    <option value="edit">Editar</option>
                    <option value="delete">Eliminar</option>
                </select>
                <br />

                {action === 'RJ' && (
                    <>
                        <textarea
                            className="reject-reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Escribe el motivo del rechazo..."
                        />
                        <br />
                    </>
                )}
                {action === 'edit' && (
                    <>
                        <textarea
                            className="edit-select"
                            value={selectedIdea ? selectedIdea.idea : ''}
                            onChange={(e) => setSelectedIdea({ ...selectedIdea, idea: e.target.value })}
                        />
                        <br />
                    </>
                )}

                {action === 'delete' && (
                    <p className="conf_delete">¿Estás seguro de que deseas eliminar esta idea?</p>
                )}
                <button className='btn' onClick={handleAction}>Confirmar</button>
                <button className='btn' onClick={closeModal}>Cancelar</button>
            </Modal>
        </div>
    );
};

export default Brainstorming;