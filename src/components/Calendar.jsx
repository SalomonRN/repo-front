import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import '../css/calendar.css';
import Header from './header';
import URL from "./url";

Modal.setAppElement('#root');

function Calendar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const [menuHeight, setMenuHeight] = useState('0px');
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
        setMenuHeight(menuOpen ? '0px' : '400px');
    };



    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [viewEventModalIsOpen, setViewEventModalIsOpen] = useState(false);
    const [confirmDeleteModalIsOpen, setConfirmDeleteModalIsOpen] = useState(false);
    const [events, setEvents] = useState([]);
    const [eventTitle, setEventTitle] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventColor, setEventColor] = useState('');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [status, setStatus] = useState("");
    const [acceptedBy, setAcceptedBy] = useState("");


    useEffect(() => {
        if (!token) {
            alert('Token no disponible. Por favor, inicia sesión nuevamente.');
            navigate('/login');
        }
    }, [token, navigate]);

    useEffect(() => {
        if (token) {
            fetchEvents();
        }
    }, [token]);

    const fetchEvents = () => {
        fetch(`${URL}/project_management/events`, {
            headers: {
                'Authorization': `Token ${token}`,
            }
        })
            .then(response => response.json())
            .then(data => setEvents(data))
            .catch(error => console.error('Error al cargar los eventos:', error));
    };

    const handleDateClick = (arg) => {

        if (isAdmin) {
            setEventDate(arg.dateStr); // Establece la fecha del evento
            openModal(); // Abre el modal para crear el evento
        } else {
            alert('No tienes permisos para crear eventos.'); // Mensaje de advertencia
        }
    };

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        resetEventForm();
    };

    const openViewEventModal = () => {
        setViewEventModalIsOpen(true);
    };

    const closeViewEventModal = () => {
        setViewEventModalIsOpen(false);
    };

    const openConfirmDeleteModal = () => {
        setConfirmDeleteModalIsOpen(true);
    };

    const closeConfirmDeleteModal = () => {
        setConfirmDeleteModalIsOpen(false);
    };

    const resetEventForm = () => {
        setSelectedEvent(null);
        setEventTitle('');
        setEventDescription('');
        setEventDate('');
        setEventColor('green');
        setError('');
        setSuccessMessage('');
    };

    const handleSaveEvent = () => {
        // Verifica que el título tenga un máximo de 45 caracteres
        if (eventTitle.length > 45) {
            alert('El título no puede exceder los 45 caracteres.');
            return; // Salir de la función si la validación falla
        }

        if (!validateEventForm()) return;

        const formData = new FormData();
        formData.append('title', eventTitle);
        formData.append('date', eventDate);
        formData.append('description', eventDescription);
        formData.append('color', eventColor);

        if (selectedEvent) {
            handleUpdateEvent(formData);
        } else {
            handleCreateEvent(formData);
        }
    };


    // Función para manejar la creación de eventos (POST)
    const handleCreateEvent = (formData) => {
        fetch(`${URL}/project_management/events`, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${token}`,
            },
            body: formData,
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errData => {
                        console.error("Error de respuesta del servidor:", errData);
                        const errorMessage = errData.detail || `Error: ${response.status} - ${response.statusText}`;
                        throw new Error(errorMessage);
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log("Evento creado correctamente:", data);
                alert('Evento creado con éxito')
                // Agregar el nuevo evento al estado
                setEvents(prevEvents => [...prevEvents, data]); // Esto debería funcionar para mostrarlo en el calendario
                fetchEvents();
                closeModal();

            })
            .catch(error => {
                console.error("Error al crear el evento:", error);
                setError(error.message);
            });
    };

    const handleUpdateEvent = (formData) => {
        const url = `${URL}/project_management/events/${selectedEvent.id}/`;

        fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Token ${token}`,
            },
            body: formData,
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errData => {
                        console.error("Error de respuesta del servidor:", errData);
                        const errorMessage = errData.detail || `Error: ${response.status} - ${response.statusText}`;
                        throw new Error(errorMessage);
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log("Evento actualizado correctamente:", data);
                // Actualizar el evento en el estado
                fetchEvents();
                closeModal();
                alert('Evento actualizado exitosamente.');
            })
            .catch(error => {
                console.error("Error al actualizar el evento:", error);
                setError(error.message);
            });
    };

    const validateEventForm = () => {
        if (!eventTitle || !eventDescription) {
            alert('El título y la descripción son obligatorios.');
            return false;
        }
        setError('');
        return true;
    };

    const handleDeleteEvent = () => {
        fetch(`${URL}/project_management/events/${selectedEvent.id}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Token ${token}`
            }
        })
            .then(response => {
                if (response.status === 204) {
                    // El evento se eliminó correctamente
                    fetchEvents();
                    closeConfirmDeleteModal();
                    closeViewEventModal();
                    return;
                }
                if (!response.ok) {
                    // Intentar obtener el cuerpo de la respuesta
                    return response.json().then(errData => {
                        console.error("Error de respuesta del servidor:", errData);
                        const errorMessage = errData.detail || `Error: ${response.status} - ${response.statusText}`;
                        throw new Error(errorMessage);
                    });
                }
                return response.json();
            })
            .then(() => {
                console.log('Evento eliminado con éxito.');
                alert('Evento eliminado con éxito')
            })
            .catch(error => {
                console.error("Error al eliminar el evento:", error);
                setError(error.message); // Muestra el mensaje de error
            });
    };


    const handleEventClick = (info) => {
        const clickedEvent = events.find(event => event.id.toString() === info.event.id.toString());

        if (clickedEvent) {
            setSelectedEvent(clickedEvent);
            setEventTitle(clickedEvent.title);
            setEventDescription(clickedEvent.description);
            setEventDate(clickedEvent.date);
            setEventColor(clickedEvent.color);
            openViewEventModal();
        } else {
            console.error("Evento no encontrado");
        }
    };

    const handleEditEvent = () => {
        openModal();
        closeViewEventModal();
    };

    const eventContent = (eventInfo) => {
        return (
            <>
                <b style={{ color: eventInfo.event.textColor }}>{eventInfo.timeText}</b><br />
                {eventInfo.event.title}
            </>
        );
    };

    const handleMarkAsCompleted = async () => {
        if (!selectedEvent) {
            console.error('No hay evento seleccionado.');
            return;
        }
    
        console.log('maldito id:', selectedEvent.id); 
    
        const formData = new FormData();
        formData.append('status', 1); 
        formData.append('id', selectedEvent.id); 
    
        try {
            const response = await fetch(`${URL}/project_management/change-event-status/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                },
                body: formData,
            });
    
            if (response.ok) {
                alert('Evento marcado como completado.');
                closeViewEventModal();
                fetchEvents(); 
            } else {
                const errorData = await response.json();
                console.error('Error al marcar el evento como completado:', errorData);
                setError(errorData.message || 'No se pudo marcar el evento como completado.');
                
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            setError('Error en la solicitud al marcar el evento como completado.');
        }
    };
    
    


    return (
        <div className={`full-container ${menuOpen ? 'shifted' : ''}`} style={{ marginTop: menuHeight }}>
            <div className="header-container">
                <Header toggleMenu={toggleMenu} menuOpen={menuOpen} />
            </div>
            <div className='container-calendar'>
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView='dayGridMonth'
                    headerToolbar={{
                        start: 'prev,today,next',
                        center: 'title',
                        end: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    height={'95vh'}
                    dateClick={handleDateClick}
                    events={events}
                    eventContent={eventContent}
                    eventClick={handleEventClick}
                />

                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    className="modal-creation-event"
                    overlayClassName="overlay1"
                >
                    <h2>{selectedEvent ? 'Editar Evento' : 'Crear Evento'}</h2>
                    {error && <p className='error'>{error}</p>}
                    {successMessage && <p className='success'>{successMessage}</p>}
                    <label className='titulo'>Título del Evento:</label>
                    <input type="text" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} />
                    <label className='descripcion'>Descripción del Evento:</label>
                    <textarea value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} />
                    <label className='color'>Color del Evento:</label>
                    <select value={eventColor} onChange={(e) => setEventColor(e.target.value)}>
                        <option value="" disabled>Selecciona un color</option>
                        <option value="#07A128">Verde</option>
                        <option value="#900C3F">Rosa</option>
                        <option value="#581845">Morado</option>
                        <option value="#07A193">Azul</option>
                    </select>
                    <p className='fecha'>Fecha seleccionada: {eventDate}</p>
                    <div>
                        <button className='guardar' onClick={handleSaveEvent}>
                            {selectedEvent ? 'Guardar Cambios' : 'Guardar Evento'}
                        </button>
                        <button className='cancelar' onClick={closeModal}>Cancelar</button>
                    </div>
                </Modal>

                <Modal
                    isOpen={viewEventModalIsOpen}
                    onRequestClose={closeViewEventModal}
                    className="modal-view-event"
                    overlayClassName="overlay1"
                >
                    <h2>Detalles del Evento</h2>
                    {selectedEvent && (
                        <>
                            <p><strong>Título:</strong> {selectedEvent.title}</p>
                            <p><strong>Descripción:</strong> {selectedEvent.description}</p>
                            <p><strong>Fecha:</strong> {selectedEvent.date}</p>
                            <p><strong>Creado por:</strong> {selectedEvent.created_by}</p>

                            <div>
                                <p><strong>Estado actual:</strong> {selectedEvent.status}</p>
                                {isAdmin && (
                                    selectedEvent.status ? ( 
                                        <button className='btn-complete' disabled>
                                            Completado
                                        </button>
                                    ) : (
                                        <button className='btn-complete' onClick={handleMarkAsCompleted}>
                                            Marcar como realizado
                                        </button>
                                    )
                                )}
                                {acceptedBy && (
                                    <p><strong>Cambiado por:</strong> {acceptedBy}</p>
                                )}
                            </div>

                            <div>
                                {isAdmin && ( // Solo mostrar botones si es admin
                                    <>
                                        <button className='editar' onClick={handleEditEvent}>Editar Evento</button>
                                        <button className='eliminar' onClick={openConfirmDeleteModal}>Eliminar Evento</button>
                                    </>
                                )}
                                <button className='cerrar' onClick={closeViewEventModal}>Cerrar</button>
                            </div>
                        </>
                    )}
                </Modal>

                <Modal
                    isOpen={confirmDeleteModalIsOpen}
                    onRequestClose={closeConfirmDeleteModal}
                    className="modal-confirm-delete"
                    overlayClassName="overlay1"
                >
                    <h2>Confirmar Eliminación</h2>
                    <p>¿Estás seguro de que deseas eliminar este evento?</p>
                    <div><center>
                        <button className='confirmar' onClick={handleDeleteEvent}>Sí, Eliminar</button>
                        <button className='cancelar' onClick={closeConfirmDeleteModal}>Cancelar</button>
                    </center>
                    </div>
                </Modal>
            </div>
        </div>
    );
}

export default Calendar;
