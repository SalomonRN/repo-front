import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import '../css/proposalsForm.css';
import Header from './header';
import { AuthContext } from "../context/AuthContext";

const ProposalsForms = () => {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);

    const [title, setTitle] = useState('');
    const [type, setType] = useState('');
    const [socialMedia, setSocialMedia] = useState([]);
    const [copy, setCopy] = useState('');
    const [description, setDescription] = useState('');
    const [proposedBy, setProposedBy] = useState('');
    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');

    // Opciones para el multiselect de redes sociales
    const socialMediaOptions = [
        { value: 'IG', label: 'Instagram' },
        { value: 'FB', label: 'Facebook' },
        { value: 'YT', label: 'YouTube' }
    ];

    useEffect(() => {
        // Verificar que el token esté presente al cargar el componente
        if (!token) {
            alert('Token no disponible. Por favor, inicia sesión nuevamente.');
            navigate('/login'); // Redirige a la página de login si no hay token
        }
    }, [token, navigate]); // Dependencias del useEffect

    const handleTitleChange = (e) => setTitle(e.target.value);
    const handleTypeChange = (e) => setType(e.target.value);
    const handleSocialMediaChange = (selectedOptions) => {
        setSocialMedia(selectedOptions ? selectedOptions.map(option => option.value) : []);
    };
    const handleDescriptionChange = (e) => setDescription(e.target.value);
    const handleCopyChange = (e) => setCopy(e.target.value);
    const handleProposedByChange = (e) => setProposedBy(e.target.value);
    const handleFilesChange = (e) => setFiles(e.target.files);

    // Función para verificar la duración del video y si es vertical
    const isVideoValid = (file) => {
        // Puedes usar una librería para verificar las propiedades del video si es necesario
        return true; // Reemplazar con lógica de validación real
    };

    // Función de validación
    const validateForm = () => {
        // Verificación de archivos
        if (files.length === 0) {
            alert('Debes seleccionar al menos un archivo para subir.');
            return false;
        }

        const selectedFileTypes = Array.from(files).map(file => file.type);
        const hasVideo = selectedFileTypes.some(type => type.startsWith('video'));
        const hasImage = selectedFileTypes.some(type => type.startsWith('image'));

        // Verificaciones para YouTube y archivos
        if (socialMedia.includes('YT') && hasImage) {
            alert('No puedes subir imágenes si seleccionas YouTube.');
            return false;
        }

        if (type === 'IMG' && hasVideo) {
            alert('No puedes subir videos si seleccionas tipo Imagen.');
            return false;
        }

        if (type === 'VID' && hasImage) {
            alert('No puedes subir imágenes si seleccionas tipo Video.');
            return false;
        }

        // Verificaciones para Storie_Image y Storie_Video
        if (type === 'STI' && hasVideo) {
            alert('No puedes subir videos si seleccionas tipo Storie_Image.');
            return false;
        }

        if (type === 'STV' && hasImage) {
            alert('No puedes subir imágenes si seleccionas tipo Storie_Video.');
            return false;
        }

        // Verificación para Storie_Video y YouTube
        if (type === 'STV' && socialMedia.includes('YT')) {
            alert('No puedes seleccionar YouTube si eliges Storie_Video.');
            return false;
        }

        // Verificación para videos de YouTube
        if (socialMedia.includes('YT') && type === 'VID') {
            for (const file of files) {
                if (!isVideoValid(file)) {
                    alert('El video debe durar un máximo de 60 segundos y ser en formato vertical.');
                    return false;
                }
            }
        }

        // Si todas las validaciones pasan
        setError(''); // Resetea el error si todo está bien
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar el formulario
        if (!validateForm()) {
            return; // Si la validación falla, no envía el formulario
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('type', type);
        formData.append('social_media', socialMedia.join(', ')); // Agrega las redes sociales seleccionadas
        formData.append('copy', copy);
        formData.append('description', description);
        formData.append('proposed_by', proposedBy);

        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        // Depuración: imprimir el contenido de formData
        for (let [key, value] of formData.entries()) {
            console.log('Token:', token);
            console.log(key, value);
        }

        try {
            const response = await axios.post('https://django-tester.onrender.com/content_proposal/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Token ${token}`, // Asegúrate de que el token esté en el formato correcto
                },
            });

            console.log('Respuesta del servidor:', response.data);
            alert('Propuesta enviada con éxito');
            navigate('/proposals'); // Redirige a la página deseada después de enviar la propuesta
        } catch (error) {
            console.error('Error al enviar la propuesta:', error.response ? error.response.data : error.message);
            alert('Hubo un error al enviar la propuesta: ' + (error.response ? error.response.data : error.message));
        }
    };

    return (
        <div className="container-f">
            <Header />
            <center>
                <div className="form-c">
                    <form onSubmit={handleSubmit}>
                        <div className="form-container">
                            <center>
                                <strong className="title-p">Propuestas de contenido</strong>
                                <div className="title-container">
                                    <label>Título:</label><br />
                                    <input className="input-form-p" type="text" value={title} onChange={handleTitleChange} required />
                                </div>
                                <div className="type-container">
                                    <label>Tipo:</label>
                                    <select className="select-form-p" value={type} onChange={handleTypeChange} required>
                                        <option value="">---------</option>
                                        <option value="VID">Video</option>
                                        <option value="IMG">Imagen</option>
                                        <option value="STI">Storie_Image</option>
                                        <option value="STV">Storie_Video</option>
                                    </select>
                                </div>
                                <div className="sm-container">
                                    <label>Redes Sociales:</label>
                                    <Select
                                        isMulti
                                        options={socialMediaOptions}
                                        onChange={handleSocialMediaChange}
                                        className="select-form-p"
                                    />
                                </div>

                                {error && <p style={{ color: 'red' }}>{error}</p>}

                                <div className="copy-container">
                                    <label>Copy:</label>
                                    <textarea className="copy" value={copy} onChange={handleCopyChange} required ></textarea>
                                </div>
                                <div className="description-container">
                                    <label>Descripción:</label>
                                    <textarea className="description-form" value={description} onChange={handleDescriptionChange} required ></textarea>
                                </div>
                                <div className="pb-container">
                                    <label>Propuesto por:</label>
                                    <select value={proposedBy} onChange={handleProposedByChange} required>
                                        <option value="">---------</option>
                                        <option value="wavy">wavy</option>
                                        <option value="salo">salo</option>
                                    </select>
                                </div>
                                <div className="file-container">
                                    <label>Archivos:</label>
                                    <input type="file" multiple onChange={handleFilesChange} />
                                </div>
                                <button className="btn-pform" type="submit">Enviar Propuesta</button>
                            </center>
                        </div>
                    </form>
                </div>
            </center>
        </div>
    );
};

export default ProposalsForms;
