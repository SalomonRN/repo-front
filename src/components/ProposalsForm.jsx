import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import '../css/proposalsForm.css';
import Header from './header';
import { AuthContext } from "../context/AuthContext";
import URL from "./url";
import Swal from "sweetalert2";


const ProposalsForms = () => {
    const navigate = useNavigate();
    const { token, isAdmin } = useContext(AuthContext);
    const [menuHeight, setMenuHeight] = useState('0px');
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
        setMenuHeight(menuOpen ? '0px' : '400px');
    };


    const [title, setTitle] = useState('');
    const [type, setType] = useState('');
    const [socialMedia, setSocialMedia] = useState([]);
    const [copy, setCopy] = useState('');
    const [description, setDescription] = useState('');
    const [proposedBy, setProposedBy] = useState('');
    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Opciones para el multiselect de redes sociales
    const socialMediaOptions = [
        { value: 'IG', label: 'Instagram' },
        { value: 'FB', label: 'Facebook' },
        { value: 'YT', label: 'YouTube' }
    ];

    useEffect(() => {
        // Verificar que el token esté presente al cargar el componente
        if (!token) {
            Swal.fire({
                title: 'Error',
                text: `No tienes token de acceso. Inicia sesión primero`,
                icon: 'error'
            });
            //alert('Token no disponible. Por favor, inicia sesión nuevamente.');
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
            Swal.fire({
                title: 'Warning',
                text: `Debes seleccionar al menos un archivo para subir`,
                icon: 'warning'
            });
            //alert('Debes seleccionar al menos un archivo para subir.');
            return false;
        }

        const selectedFileTypes = Array.from(files).map(file => file.type);
        const hasVideo = selectedFileTypes.some(type => type.startsWith('video'));
        const hasImage = selectedFileTypes.some(type => type.startsWith('image'));

        // Verificaciones para YouTube y archivos
        if (socialMedia.includes('YT') && hasImage) {
            Swal.fire({
                title: 'Error',
                text: `No puedes subir imágenes si seleccionas YouTube`,
                icon: 'warning'
            });
            alert('No puedes subir imágenes si seleccionas YouTube.');
            return false;
        }

        if (type === 'IMG' && hasVideo) {
            Swal.fire({
                title: 'Error',
                text: `No puedes subir videos si selecciones tipo Imágen`,
                icon: 'warning'
            });
            //alert('No puedes subir videos si seleccionas tipo Imagen.');
            return false;
        }

        if (type === 'VID' && hasImage) {
            Swal.fire({
                title: 'Error',
                text: `No puedes subir imágenes si seleccionas tipo Video`,
                icon: 'warning'
            });
            //alert('No puedes subir imágenes si seleccionas tipo Video.');
            return false;
        }

        // Verificaciones para Storie_Image y Storie_Video
        if (type === 'STI' && hasVideo) {
            Swal.fire({
                title: 'Error',
                text: `No puedes subir videos si seleccionas tipo Storie_Image`,
                icon: 'warning'
            });
            //alert('No puedes subir videos si seleccionas tipo Storie_Image.');
            return false;
        }

        if (type === 'STV' && hasImage) {
            Swal.fire({
                title: 'Error',
                text: `No puedes subir imágenes si seleccionas tipo Storie_Video`,
                icon: 'warning'
            });
            //alert('No puedes subir imágenes si seleccionas tipo Storie_Video.');
            return false;
        }

        // Verificación para Storie_Video y YouTube
        if (type === 'STV' && socialMedia.includes('YT')) {
            Swal.fire({
                title: 'Error',
                text: `No puedes seleccionar Youtube si eliges Storie_Video`,
                icon: 'warning'
            });
            //alert('No puedes seleccionar YouTube si eliges Storie_Video.');
            return false;
        }

        // Verificación para videos de YouTube
        if (socialMedia.includes('YT') && type === 'VID') {
            for (const file of files) {
                if (!isVideoValid(file)) {
                    Swal.fire({
                        title: 'Error',
                        text: `El video debe durar un máximo de 60 segundos y ser en formato vertical`,
                        icon: 'warning'
                    });
                    //alert('El video debe durar un máximo de 60 segundos y ser en formato vertical.');
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
        formData.append('social_media', socialMedia.join(',')); // Agrega las redes sociales seleccionadas
        formData.append('copy', copy);
        formData.append('description', description);
        formData.append('proposed_by', proposedBy);

        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
            
        }

        setIsSubmitting(true);

        const loadingSwal = Swal.fire({
            title: 'Enviando...',
            text: 'Por favor, espera mientras se envía tu propuesta.',
            didOpen: () => {
                Swal.showLoading(); 
            },
            allowOutsideClick: false, 
        });

        // Depuración: imprimir el contenido de formData
        for (let [key, value] of formData.entries()) {
            console.log('Token:', token);
            console.log(key, value);
        }

        try {
            const response = await axios.post(`${URL}/content_proposal/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Token ${token}`, // Asegúrate de que el token esté en el formato correcto
                },
            });

            console.log('Respuesta del servidor:', response.data);
            await Swal.fire({
                title: 'Éxito',
                text: `Propuesta enviada con éxito`,
                icon: 'success',
                timer: 2000, // Duración del SweetAlert (en milisegundos)
                timerProgressBar: true,
                willClose: () => {
                    if (isAdmin) {
                        navigate('/proposals'); // Redirige después de que se cierre el SweetAlert
                    } else {
                        navigate('/proposals_cm'); 
                    }
                }
            });
            //alert('Propuesta enviada con éxito');
            //navigate('/proposals'); // Redirige a la página deseada después de enviar la propuesta
        } catch (error) {
            console.error('Error al enviar la propuesta:', error.response ? error.response.data : error.message);
            Swal.fire({
                title: 'Error',
                text: `Hubo un error al enviar la propuesta `,
                icon: 'warning'
            });
            //alert('Hubo un error al enviar la propuesta: ' + (error.response ? error.response.data : error.message));
        }finally{
            setIsSubmitting(false);
            Swal.close();
        }
    };

    return (
        <div className={`container-f ${menuOpen ? 'shifted' : ''}`} style={{ marginTop: menuHeight }}>
            <div className="header-container">
                <Header toggleMenu={toggleMenu} menuOpen={menuOpen} />
            </div>
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
                                {/*<div className="pb-container">
                                    <label>Propuesto por:</label>
                                    <select value={proposedBy} onChange={handleProposedByChange} required>
                                        <option value="">---------</option>
                                        <option value="wavy">wavy</option>
                                        <option value="salo">salo</option>
                                    </select>
                                </div>*/}
                                <div className="file-container">
                                    <label>Archivos:</label>
                                    <input className='input-btn-f' type="file" multiple onChange={handleFilesChange} />
                                </div>
                                <button className="btn-pform" type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Enviando...' : 'Enviar Propuesta'}
                                </button>
                                
                            </center>
                        </div>
                    </form>
                </div>
            </center>
        </div>
    );
};

export default ProposalsForms;
