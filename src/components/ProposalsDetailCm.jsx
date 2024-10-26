import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import '../css/proposalDetailCm.css';
import Header from './header';
import URL from './url';
import Swal from 'sweetalert2';

const ProposalDetailCm = () => {
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
    const [isEditing, setIsEditing] = useState(false);
    const [editedProposal, setEditedProposal] = useState({});
    const [files, setFiles] = useState(null);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
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
                    const data = await response.json(); // Obtenemos la respuesta que contiene la propuesta y los comentarios
                    console.log("Datos obtenidos:", data);

                    const proposal = data.proposal; // Obtenemos la propuesta
                    const comments = data.comments; // Obtenemos los comentarios

                    if (proposal) {
                        setSelectedProposal(proposal);
                        setEditedProposal(proposal);
                    } else {
                        Swal.fire({
                            title: 'Error',
                            text: `Propuesta no encontrada`,
                            icon: 'error'
                        });
                        //setError('Propuesta no encontrada.');
                    }

                    if (comments) {
                        setComments(comments);
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

        fetchContentProposal();
    }, [id, navigate]);

    // Nueva función para obtener los comentarios
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

    const handleAddComment = async (event) => {
        event.preventDefault();
        if (!newComment.trim()) return;

        try {
            const token = localStorage.getItem('token');
            const formData = new FormData(); // Crear una nueva instancia de FormData

            formData.append('id', selectedProposal.id); // Cambia proposal_id a id
            formData.append('body', newComment); // Cambia 'text' a 'body'

            const response = await fetch(`${URL}/content_proposal/comment/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                },
                body: formData, // Enviar el FormData
            });

            if (response.ok) {
                await fetchComments(); // Actualiza los comentarios llamando a la función
                setNewComment(''); // Limpia el campo del nuevo comentario
            } else {
                const errorData = await response.json();
                Swal.fire({
                    title: 'Error',
                    text: `Error al agregar el comentario`,
                    icon: 'error'
                });
                //alert(`Error al agregar el comentario: ${JSON.stringify(errorData)}`);
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: `Error al agregar el comentario`,
                icon: 'error'
            });
            //alert('Error al agregar el comentario');
        }
    };

    const isVideoValid = (file) => {
        return new Promise((resolve, reject) => {
            const videoElement = document.createElement('video');
            videoElement.src = URL.createObjectURL(file);
            
            videoElement.onloadedmetadata = () => {
                const duration = videoElement.duration; // Duración en segundos
                const aspectRatio = videoElement.videoWidth / videoElement.videoHeight;
                const isVertical = aspectRatio < 1; // Verificar si el video es vertical
                
                if (duration <= 60 && isVertical) {
                    resolve(true);
                } else {
                    reject(false);
                }
            };
            
            videoElement.onerror = () => reject(false);
        });
    };

    const handleEditProposal = async () => {
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

            {/* if (!files || files.length === 0) {
                Swal.fire({
                    title: 'Warning',
                    text: `Debes seleccionar al menos un archivo para subir`,
                    icon: 'warning'
                });
                //alert('Debes seleccionar al menos un archivo para subir.');
                return;
            } */}

            const selectedFileTypes = Array.from(files).map(file => file.type);
            const hasVideo = selectedFileTypes.some(type => type.startsWith('video'));
            const hasImage = selectedFileTypes.some(type => type.startsWith('image'));

            if (editedProposal.social_media.includes('YT') && hasImage) {
                Swal.fire({
                    title: 'Error',
                    text: `No puedes subir imágenes si selecccionas YouTube`,
                    icon: 'warning'
                });
                //alert('No puedes subir imágenes si seleccionas YouTube.');
                return;
            }

            if (editedProposal.type === 'IMG' && hasVideo) {
                Swal.fire({
                    title: 'Error',
                    text: `No puedes subir videos si selecciones tipo Imágen`,
                    icon: 'warning'
                });
                //alert('No puedes subir videos si seleccionas tipo Imagen.');
                return;
            }

            if (editedProposal.type === 'VID' && hasImage) {
                Swal.fire({
                    title: 'Error',
                    text: `No puedes subir imágenes si seleccionas tipo Video`,
                    icon: 'warning'
                });
                //alert('No puedes subir imágenes si seleccionas tipo Video.');
                return;
            }

            if (editedProposal.type === 'STI' && hasVideo) {
                Swal.fire({
                    title: 'Error',
                    text: `No puedes subir videos si seleccionas tipo Storie_Image`,
                    icon: 'warning'
                });
                //alert('No puedes subir videos si seleccionas tipo Storie_Image.');
                return;
            }

            if (editedProposal.type === 'STV' && hasImage) {
                Swal.fire({
                    title: 'Error',
                    text: `No puedes subir imágenes si seleccionas tipo Storie_Video`,
                    icon: 'warning'
                });
                //alert('No puedes subir imágenes si seleccionas tipo Storie_Video.');
                return;
            }

            if (editedProposal.type === 'STV' && editedProposal.social_media.includes('YT')) {
                Swal.fire({
                    title: 'Error',
                    text: `No puedes seleccionar Youtube si eliges Storie_Video`,
                    icon: 'warning'
                });
                //alert('No puedes seleccionar YouTube si eliges Storie_Video.');
                return;
            }

            // verificacion
            if (editedProposal.social_media.includes('YT') && editedProposal.type === 'VID') {
                for (const file of files) {
                    const isValid = await isVideoValid(file);
                    if (!isValid) {
                        Swal.fire({
                            title: 'Error',
                            text: `El video debe durar un máximo de 60 segundos y ser en formato vertical`,
                            icon: 'warning'
                        });
                        return;
                    }
                }
            }

            const formData = new FormData();
            formData.append('title', editedProposal.title || '');
            formData.append('description', editedProposal.description || '');
            formData.append('social_media', editedProposal.social_media || '');
            formData.append('type', editedProposal.type || '');
            formData.append('edited_by', editedProposal.edited_by || '');
            formData.append('copy', editedProposal.copy || '');

            for (let i = 0; i < files.length; i++) {
                formData.append('files', files[i]);
            }

            const response = await fetch(`${URL}/content_proposal/${selectedProposal.id}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Token ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                const updatedProposal = await response.json();
                setSelectedProposal(updatedProposal);
                Swal.fire({
                    title: 'Éxito',
                    text: `Propuesta actualizada correctamente`,
                    icon: 'success'
                });
                //alert('Propuesta actualizada correctamente');
                navigate('/proposals_cm');
            } else {
                const errorData = await response.json();
                Swal.fire({
                    title: 'Error',
                    text: `Error al actualizar la propuesta`,
                    icon: 'error'
                });
                //alert(`Error al actualizar la propuesta: ${JSON.stringify(errorData)}`);
            }
        } catch (error) {
        Swal.fire({
                    title: 'Error',
                    text: `Error al actualizar la propuesta. Inténtalo nuevamente`,
                    icon: 'error'
                });
            //alert('Error al actualizar la propuesta. Inténtalo nuevamente.');
        }
    };

    const handleEditChange = (e) => {
        setEditedProposal({
            ...editedProposal,
            [e.target.name]: e.target.value,
        });
    };

    const handleFilesChange = (e) => {
        setFiles(e.target.files);
    };

    const handleSocialMediaChange = (selectedOptions) => {
        setEditedProposal({
            ...editedProposal,
            social_media: selectedOptions.map(option => option.value).join(', '),
        });
    };

    const handleTypeChange = (e) => {
        setEditedProposal({
            ...editedProposal,
            type: e.target.value,
        });
    };

    const handleProposedByChange = (e) => {
        setEditedProposal({
            ...editedProposal,
            edited_by: e.target.value,
        });
    };

    const closeModal = () => {
        setIsEditing(false);
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

    const socialMediaOptions = [
        { value: 'IG', label: 'Instagram' },
        { value: 'FB', label: 'Facebook' },
        { value: 'YT', label: 'YouTube' }
    ];

    return (
        <div className={`proposal-detail-d ${menuOpen ? 'shifted' : ''}`} style={{ marginTop: menuHeight }}>
            <div className="header-container">
                <Header toggleMenu={toggleMenu} menuOpen={menuOpen} />
            </div>
            <div className="proposal-container-d">
                <div className="proposal-details-d">
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

                <div className="proposal-comments-d">
                    <h2>Comentarios</h2>
                    {comments.length > 0 ? (
                        comments.map((comment, index) => (
                            <div key={comment.id || index} className="comment-d">
                                <p><strong>{comment.comment_by || 'Usuario desconocido'}</strong>: {comment.body || 'Comentario vacío'}</p>
                            </div>
                        ))
                    ) : (
                        <p>No hay comentarios.</p>
                    )}

                    <form onSubmit={handleAddComment}>
                        <textarea
                            className='comments-d'
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Escribe un comentario..."
                            required
                        />
                        <button className='btn-save-d' type="submit">Agregar Comentario</button>
                    </form>
                </div>
            </div>
            {error && <p className="error-message">{error}</p>}

            <button className='btn-edit-d' onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? 'Cancelar Edición' : 'Editar Propuesta'}
            </button>

            {isEditing && (
                <center>
                    <div className="modal-overlay-d">
                        <div className="modal-content-d">
                            <button className="close-button-d" onClick={closeModal}>✖</button>
                            <h2>Editar Propuesta</h2>
                            <label>Título:</label>
                            <input
                                className="input-form-d"
                                type="text"
                                name="title"
                                value={editedProposal.title || ''}
                                onChange={handleEditChange}
                                placeholder="Título"
                            /><br />
                            <br /><label>Tipo:</label>
                            <select
                                className='select-type-d'
                                value={editedProposal.type || ''} onChange={handleTypeChange}>
                                <option value="">---------</option>
                                <option value="VID">Video</option>
                                <option value="IMG">Imagen</option>
                                <option value="STI">Storie_Image</option>
                                <option value="STV">Storie_Video</option>
                            </select><br />
                            <br /><label>Redes Sociales:</label>
                            <Select
                                className='select-rs-d'
                                isMulti
                                options={socialMediaOptions}
                                value={editedProposal.social_media?.split(', ').map(value => ({ value, label: value })) || []}
                                onChange={handleSocialMediaChange}
                            /><br />
                            <br /><label>Descripción:</label>
                            <textarea
                                className="input-form-d"
                                name="description"
                                value={editedProposal.description || ''}
                                onChange={handleEditChange}
                                placeholder="Descripción"
                            /><br />
                            <br /><label>Copy:</label>
                            <textarea
                                className="input-form-d"
                                name="copy"
                                value={editedProposal.copy || ''}
                                onChange={handleEditChange}
                                placeholder="Copy"
                            /><br />
                            <br /><label>Archivos:</label>
                            <input
                                className='input-btn-d'
                                type="file"
                                multiple
                                onChange={handleFilesChange}
                            /><br />

                            <br />
                            <button className='btn-save-d' type="button" onClick={handleEditProposal}>Guardar Cambios</button>
                        </div>
                    </div>
                </center>
            )}
        </div>
    );

}

export default ProposalDetailCm;
