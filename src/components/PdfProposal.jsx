import React, { useEffect, useState } from "react";
import jsPDF from "jspdf"; // generar archivos PDF
import "jspdf-autotable"; // crear tablas dentro del PDF
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import URL from "./url";

const PdfProposal = () => {
  const [proposals, setProposals] = useState([]); // Estado para almacenar las propuestas
  const [comments, setComments] = useState([]); // Estado para almacenar los comentarios
  const { id } = useParams();

  // Función para obtener propuestas desde el backend
  const fetchProposals = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        Swal.fire({
          title: "Error",
          text: `No tienes token de acceso. Inicia sesión primero`,
          icon: "error",
        });
        console.error("No se encontró el token de autenticación");
        return;
      }

      const response = await axios.get(`${URL}/content_proposal/`, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Propuestas recibidas:", response.data);
      setProposals(response.data); // Actualiza el estado con las propuestas obtenidas
    } catch (error) {
      console.error(
        "Error al obtener las propuestas: ",
        error.response?.data || error.message
      );
    }
  };

  // Función para obtener los comentarios de una propuesta específica
  const fetchComments = async (proposalId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${URL}/content_proposal/${proposalId}/`, {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.comments; // Devuelve los comentarios
      } else {
        console.error("Error al obtener comentarios");
      }
    } catch (error) {
      console.error("Error en la solicitud al servidor:", error);
    }
  };

  // useEffect para cargar las propuestas al montar el componente
  useEffect(() => {
    fetchProposals();
  }, []);

  const generatePDF = async (status) => {
    if (!proposals || proposals.length === 0) {
      Swal.fire({
        title: "Advertencia",
        text: "No hay propuestas para exportar.",
        icon: "warning",
      });
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18); // Título
    doc.text(`Propuestas ${status}`, 14, 20); // Posición
    doc.setFontSize(12); // Contenido

    // Filtrar propuestas según el estado
    const filteredProposals = proposals.filter(
      (proposal) => proposal.status === status
    );

    console.log("Propuestas filtradas:", filteredProposals);

    // Columnas y filas
    const proposalTableColumn = [
      "ID",
      "Título",
      "Descripción",
      "Tipo",
      "Red Social",
      "URL",
      "Copy",
      "Propuesto por",
      "Aprobado por",
      "Estado",
    ];
    const commentTableColumn = [
      "Comentado por",
      "Comentario",
      "Fecha de creación",
      "Última actualización",
      "Fecha cambio estado",
    ];

    // Obtener los comentarios para cada propuesta
    for (const proposal of filteredProposals) {
      console.log("Status de la propuesta:", proposal.status);

      const proposalData = [
        proposal.id,
        proposal.title,
        proposal.description,
        proposal.type,
        proposal.social_media,
        proposal.url,
        proposal.copy,
        proposal.proposed_by,
        proposal.approved_by,
        proposal.status,
      ];

      console.log("Datos de propuesta:", proposalData);

      // Tabla de la propuesta
      doc.autoTable({
        startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 30,
        head: [proposalTableColumn],
        body: [proposalData],
        columnStyles: {},
        theme: "grid",
        styles: {
          fontSize: 6,
          cellPadding: 2,
          textColor: [0, 0, 0], // Color de texto
          fillColor: [230, 230, 230], // Color de fondo de las celdas
          lineColor: [255, 255, 255], // Color de las líneas
        },
        headStyles: {
          fillColor: [175, 175, 175], // Color de fondo del encabezado
          textColor: [59, 59, 59], // Color del texto del encabezado
        },
      });

      // Obtener los comentarios para esta propuesta
      const proposalComments = await fetchComments(proposal.id); // Llamar la función fetchComments
      if (proposalComments && proposalComments.length > 0) {
        const commentRows = proposalComments.map((comment) => [
          comment.comment_by,
          comment.body,
          comment.created_at,
          comment.updated_at,
          comment.status_modified_at,
        ]);

        doc.autoTable({
          startY: doc.lastAutoTable.finalY + 5,
          head: [commentTableColumn],
          body: commentRows,
          columnStyles: {},
          theme: "grid",
          styles: {
            fontSize: 6,
            cellPadding: 2,
            textColor: [0, 0, 0], // Color de texto
            fillColor: [230, 230, 230], // Color de fondo de las celdas
            lineColor: [255, 255, 255], // Color de las líneas
          },
          headStyles: {
            fillColor: [175, 175, 175], // Color de fondo del encabezado
            textColor: [59, 59, 59], // Color del texto del encabezado
          },
        });
      } else {
        doc.text("Sin comentarios", 14, doc.lastAutoTable.finalY + 10);
        doc.lastAutoTable.finalY += 15; // Agregar espacio después del mensaje
      }
    }

    // Nombre del PDF
    doc.save(`Propuestas_${status}.pdf`);
  };

  return (
    <div className="proposals-pdf-container">
      <button className="pdf-btn" onClick={() => generatePDF("AP")}>
        Exportar propuestas aceptadas
      </button>
      <button className="pdf-btn" onClick={() => generatePDF("RJ")}>
        Exportar propuestas rechazadas
      </button>
      <button className="pdf-btn" onClick={() => generatePDF("MC")}>
        Exportar propuestas con cambios
      </button>
      <button className="pdf-btn" onClick={() => generatePDF("NA")}>
        Exportar propuestas sin aprobar
      </button>
    </div>
  );
};

export default PdfProposal;
