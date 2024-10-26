import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/proposalDetail.css';
import Header from './header';
import URL from './url';
import Swal from 'sweetalert2';

const ProposalDetail = () => {
    const navigate = useNavigate();
    const [menuHeight, setMenuHeight] = useState('0px');
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
        setMenuHeight(menuOpen ? '0px' : '300px');
    };

    

    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [selectedProposal, setSelectedProposal] = useState(null);
    const [error, setError] = useState('');
    const [newComment, setNewComment] = useState('');

    // Estado para el modal de cambio de estado
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [newStatus, setNewStatus] = useState('');  // Nuevo estado seleccionado
    const [reason, setReason] = useState(''); // Nueva razón para el cambio de estado
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Función para obtener la propuesta y los comentarios
    const fetchContentProposal = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                Swal.fire({
                    title: 'Error',
                    text: `No tienes token de acceso. Inicia sesión primero`,
                    icon: 'error'
                });
                //alert('No tienes token de acceso. Inicia sesión primero.');
                navigate('/login');
                return;
            }

            const response = await fetch(`${URL}/content_proposal/${id}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                const proposal = data.proposal;

                if (proposal) {
                    setSelectedProposal(proposal);
                    fetchComments(); // Llama a la función para obtener comentarios
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: `Propuesta no encontrada`,
                        icon: 'error'
                    });
                    //setError('Propuesta no encontrada.');
                }
            } else {
                Swal.fire({
                    title: 'Error',
                    text: `Error al obtener los datos`,
                    icon: 'error'
                });
                //setError('Error al obtener los datos.');
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: `Error en la solicitud al servidor`,
                icon: 'error'
            });
            //setError('Error en la solicitud al servidor.');
        } finally {
            setLoading(false);
        }
    };

    // Función para obtener los comentarios
    const fetchComments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${URL}/content_proposal/${id}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setComments(data.comments); // Actualiza el estado con los comentarios obtenidos
            } else {
                console.error('Error al obtener comentarios');
            }
        } catch (error) {
            console.error('Error en la solicitud al servidor:', error);
        }
    };

    useEffect(() => {
        fetchContentProposal();
    }, [id, navigate]);

    const handleAddComment = async (commentBody) => {
        // Asegúrate de que commentBody es una cadena de texto
        if (typeof commentBody !== 'string' || !commentBody.trim()) {
            Swal.fire({
                title: 'Error',
                text: `El comentario no puede estar vacío o no es válido`,
                icon: 'error'
            });
            //alert('El comentario no puede estar vacío o no es válido.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('id', selectedProposal.id);
            formData.append('body', commentBody); // Aquí nos aseguramos de que es una cadena

            const response = await fetch(`${URL}/content_proposal/comment/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                fetchComments(); // Actualiza los comentarios después de agregar uno nuevo
            } else {
                const errorData = await response.json(); // Extrae el cuerpo de la respuesta en formato JSON
                console.error('Error en la respuesta del servidor:', errorData); // Muestra el error en la consola para depuración
                Swal.fire({
                    title: 'Error',
                    text: `Error al agregar el comentario`,
                    icon: 'error'
                });
                //alert(`Error al agregar el comentario: ${JSON.stringify(errorData)}`); // También puedes mostrar el error en un alert
            }
        } catch (error) {
            console.error('Error en la solicitud de fetch:', error); // Muestra el error de la solicitud en la consola
            Swal.fire({
                title: 'Error',
                text: `Error al agregar el comentario`,
                icon: 'error'
            });
            //alert(`Error al agregar el comentario: ${error.message}`); // Muestra un mensaje más detallado al usuario
        }
    };



    // Función para cambiar el estado de la propuesta y manejar la publicación
    const handleStatusChange = async () => {

        const loadingSwal = Swal.fire({
            title: 'Cambiando estado...',
            text: 'Por favor, espera un momento.',
            allowEscapeKey: false,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('id', selectedProposal.id);
            formData.append('status', newStatus);
    
            if (newStatus === 'RJ' || newStatus === 'MC') {
                formData.append('reason', reason);
                await handleAddComment(reason);
                setReason('');
            }
    
            // Cambiar el estado de la propuesta
            const response = await fetch(`${URL}/content_proposal/change_status/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                },
                body: formData,
            });
    
            Swal.close();

            if (response.ok) {
                const result = await response.json();
    
                // Mostrar mensaje de éxito
                Swal.fire({
                    title: 'Éxito',
                    text: `Estado cambiado correctamente a: ${newStatus}`,
                    icon: 'success'
                });
    
                // Publicar si el estado es "AP" y result.publish es true
                if (newStatus === "AP" && result.publish === true) {
                    const publishResponse = await fetch(`${URL}/publish/${selectedProposal.id}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Token ${token}`,
                        },
                    });
    
                    if (publishResponse.ok) {
                        const publishResult = await publishResponse.json();
                        Swal.fire({
                            title: 'Publicación exitosa',
                            text: `Propuesta publicada correctamente: ${publishResult.message}`,
                            icon: 'success'
                        });
                    } else {
                        const publishErrorData = await publishResponse.json();
                        Swal.fire({
                            title: 'Error de publicación',
                            text: `Error al publicar la propuesta: ${JSON.stringify(publishErrorData)}`,
                            icon: 'error'
                        });
                        
                    }
                }
    
                setShowStatusModal(false);
            } else {
                const errorData = await response.json();
                Swal.fire({
                    title: 'Error',
                    text: `Error al cambiar el estado`,
                    icon: 'error'
                });
            }
        } catch (error) {
            
            Swal.fire({
                title: 'Error',
                text: `Error al cambiar el estado de la propuesta`,
                icon: 'error'
            });
        }
    };
    

    const renderFileIframes = (fileIds) => {
        if (!fileIds) return null;

        const ids = fileIds.split(',');
        //console.log('Rendering Iframes for IDs:', ids); // Agrega este log para verificar

        return ids.map((fileId) => (
            <iframe
                key={fileId}
                src={`https://drive.google.com/file/d/${fileId}/preview`}
                width="440"
                height="280"
                allow="autoplay"
                style={{ marginBottom: '20px' }}
                title={`Archivo de Google Drive ${fileId}`}
            />
        ));
    };


    if (loading) {
        return <p>Cargando...</p>;
    }

    if (!selectedProposal) {
        return <p className='proposal_empty'>No se encontró la propuesta.</p>;
    }

    return (
        <div className={`proposal-detail-ad ${menuOpen ? 'shifted' : ''}`} style={{ marginTop: menuHeight }}>
            <div className="header-container">
                <Header toggleMenu={toggleMenu} menuOpen={menuOpen} />
            </div>
            <div className="proposal-container-ad">
                <div className="proposal-details-ad">
                    <h1>{selectedProposal.title}</h1>
                    <p><strong>Descripción:</strong> {selectedProposal.description || 'No hay descripción'}</p>
                    <p><strong>Tipo:</strong> {selectedProposal.type}</p>
                    <p><strong>Red social:</strong> {selectedProposal.social_media}</p>
                    <p><strong>Copy:</strong> {selectedProposal.copy || 'No hay copy'}</p>
                    <p><strong>Creado por:</strong> {selectedProposal.proposed_by || 'Desconocido'}</p>
                    <p><strong>Fecha de actualización:</strong> {selectedProposal.updated_at || 'Desconocida'}</p>

                    {/* drive */}
                    <div className="proposal-files-ad">
                        <center>
                        <h2 className='vid-title'>Archivos Adjuntos</h2>
                        {renderFileIframes(selectedProposal.url)}
                        </center>
                    </div>

                </div>

                <div className="proposal-comments-ad">
                    <h2>Comentarios</h2>
                    {Array.isArray(comments) && comments.length > 0 ? (
                        comments.map((comment, index) => (
                            <div key={comment.id || index} className="comment-ad">
                                <p><strong>{comment.comment_by || 'Usuario desconocido'}</strong>: {comment.body || 'Comentario vacío'}</p>
                                {/* Mostrar razón si existe */}
                                {comment.reason && (
                                    <p><strong>Razón:</strong> {comment.reason}</p>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No hay comentarios.</p>
                    )}

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleAddComment(newComment);
                            setNewComment('');
                        }}
                    >
                        <textarea
                            className='comments-ad'
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Escribe un comentario..."
                            required
                        />
                        <button className='btn-save-ad' type="submit">Agregar Comentario</button>
                    </form>
                </div>
            </div>
            <button className="btn-change-status-ad" onClick={() => setShowStatusModal(true)}>
                Cambiar Estado de la Propuesta
            </button>
            {/* Modal para cambiar el estado */}
            {showStatusModal && (
                <div className="modal-overlay-ad">
                    <div className="modal-content-ad">
                        <h2>Cambiar Estado</h2>
                        <label>Estado:</label>
                        <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="status-select"
                        >
                            <option value="">Seleccionar...</option>
                            <option value="RJ">Rechazar</option>
                            <option value="AP">Aceptar</option>
                            <option value="MC">Pedir Cambios</option>
                        </select>
                        {/* Mostrar textarea para razón si es RJ o MC */}
                        {(newStatus === 'RJ' || newStatus === 'MC') && (
                            <textarea
                                className='reason-ad'
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Escribe la razón..."
                                required
                            />
                        )}<br />
                        <button className="btn-save-ad" onClick={handleStatusChange}>
                            Enviar
                        </button>
                        <button className="btn-close-ad" onClick={() => setShowStatusModal(false)}>
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default ProposalDetail;
