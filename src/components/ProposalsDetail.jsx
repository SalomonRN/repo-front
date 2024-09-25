import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import '../css/proposalDetail.css';
import '../css/header.css';


const ProposalDetail = () => {

  const navigate = useNavigate();

  const { id } = useParams();  // Obtiene el id desde los parámetros de la url
  const [loading, setLoading] = useState(true); // Maneja el estado de carga (si los datos aun están cargando desde la api)
  const [comments, setComments] = useState({}); // Objeto vacío para guardar los comentarios
  const [commentBy, setCommentBy] = useState({}); // Objeto vacío para guardar a la persona que hace el comentario
  const [selectedProposal, setSelectedProposal] = useState([]);
  const [error, setError] = useState(''); // Estado para mensajes de error
  const [statusAction, setStatusAction] = useState(''); // Hook para el estado de propuesta

  // Obtener los datos de las propuestas
  useEffect(() => {
    const fetchProposals = async () => {
      /*try {
        const response = await axios.get('django-tester.onrender.com/content_proposal/');
        const proposal = response.data.find(proposal => proposal.id === parseInt(id)); // Busca la propuesta con el id proporcionado
        console.log('Propuesta seleccionada:', proposal); // Inspecciona la estructura del objeto aquí
        setSelectedProposal(proposal);
      } catch (error) {
        console.error('Error obteniendo las propuestas:', error);
      } finally {
        setLoading(false);
      }*/
    };

    fetchProposals();
  }, [id]); // Ejecuta el hook solo cuando cambia el id

  // Actualiza el estado de 'comments' cuando se escribe un comentario
  const handleCommentChange = (event, proposalId) => {
    setComments({
      ...comments,
      [proposalId]: event.target.value,
    });
  };

  // Actualiza el estado de 'commentBy' cuando cambia la persona del comentario
  const handleCommentByChange = (event, proposalId) => {
    setCommentBy({
      ...commentBy,
      [proposalId]: event.target.value,
    });
  };

  // Actualiza el estado de 'statusAction' cuando se selecciona una opción
  const handleStatusChange = (event) => {
    setStatusAction(event.target.value);
  };

  // Envía el comentario y la acción al servidor
  const handleCommentSubmit = (proposalId) => {
    if (!comments[proposalId] || !commentBy[proposalId] || !statusAction) {
      setError('Por favor, completa todos los campos antes de enviar el comentario.');
      return;
    }
    
    const comment = {
      body: comments[proposalId],
      comment_by: commentBy[proposalId],
    };

    // Envía el comentario al servidor
    /*
    axios.post(`http://django-tester.onrender.com/proposals/${proposalId}/comments`, comment)
      .then(response => {
        console.log('Comentario enviado:', response.data);
        setError(''); // Limpiar mensaje de error al enviar comentario exitosamente
        // Envía la acción correspondiente después de enviar el comentario
        if (statusAction === 'accept') {
          axios.put(`django-tester.onrender.com/proposals/${proposalId}/accept`)
            .then(response => {
              console.log('Propuesta aceptada:', response.data);
            })
            .catch(error => console.error('Error al aceptar la propuesta:', error));
        } else if (statusAction === 'reject') {
          axios.put(`django-tester.onrender.com/proposals/${proposalId}/reject`)
            .then(response => {
              console.log('Propuesta rechazada:', response.data);
            })
            .catch(error => console.error('Error al rechazar la propuesta:', error));
        }
        // Limpiar la selección de estado después de enviar
        setStatusAction('');
      })
      .catch(error => {
        console.error('Error al enviar el comentario:', error.response ? error.response.data : error.message);
        setError('Error al enviar el comentario. Inténtalo nuevamente.');
      });*/
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!selectedProposal) {
    return <p>No se encontró la propuesta.</p>;
  }

  return (
    <div className="proposal-detail">
      <div className="header">
            <button className="opc" onClick={() => navigate('/brainstorming')}>Ir a lluvia de ideas</button>
            <button className="opc" onClick={() => navigate('/proposals')}>Ir a Propuestas</button>
            <button className="opc" onClick={() => navigate('/proposals_form')}>Ir al formulario de Propuestas</button>
            <button className="opc" onClick={() => navigate('/calendar')}>Ir a Calendario</button>
          </div>
      <h1>{selectedProposal.title}</h1>
      <p><strong>Descripción:</strong> {selectedProposal.desc || 'No hay descripción'}</p>
      <p><strong>Descripción 2.0:</strong> {selectedProposal.descripcion}</p>
      <p><strong>Tipo:</strong> {selectedProposal.type}</p>
      <p><strong>Red social:</strong> {selectedProposal.social_media}</p>
      <p><strong>Copy:</strong> {selectedProposal.copy || 'No hay copy'}</p>
      <p><strong>Creado por:</strong> {selectedProposal.proposed_by || 'Desconocido'}</p>
      <p><strong>Fecha de actualización:</strong> {selectedProposal.updated || 'Desconocida'}</p>

      {/* <p><strong>Estado:</strong> {selectedProposal.status || 'Desconocido'}</p>*/}

      {error && <p className="error-message">{error}</p>}

      <div>
        <select
          name="comment_by"
          value={commentBy[selectedProposal.id] || ''}
          onChange={(e) => handleCommentByChange(e, selectedProposal.id)}
        >
          <option value="" disabled>Selecciona un usuario</option>
          <option value="salo">salo</option>
          <option value="root">root</option>
          <option value="R1oGeyms">R1oGeyms</option>
        </select>
        <textarea
          name="body"
          cols="3"
          rows="3"
          value={comments[selectedProposal.id] || ''}
          onChange={(e) => handleCommentChange(e, selectedProposal.id)}
          placeholder="Escribe un comentario..."
          required
        ></textarea>
        <select
          name="status_action"
          value={statusAction}
          onChange={handleStatusChange}
        >
          <option value="" disabled>Selecciona una acción</option>
          <option value="accept">Aceptar</option>
          <option value="reject">Rechazar</option>
        </select>
        <button className='btn-detail'
          onClick={() => handleCommentSubmit(selectedProposal.id)}
          disabled={!commentBy[selectedProposal.id] || !comments[selectedProposal.id] || !statusAction}
        >
          Enviar comentario
        </button>
      </div>
    </div>
  );
};

export default ProposalDetail;
