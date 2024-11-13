import React, { useEffect, useState } from "react";
import jsPDF from "jspdf"; // Para generar archivos PDF
import "jspdf-autotable"; // Para crear tablas dentro del PDF
import axios from "axios";
import Swal from "sweetalert2";
import URL from "./url";

const PdfBrainstorm = () => {
  const [ideas, setIdeas] = useState([]);

  const fetchIdeas = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        Swal.fire({
          title: "Error",
          text: "No tienes token de acceso. Inicia sesión primero",
          icon: "error",
        });
        console.error("No se encontró el token de autenticación");
        return;
      }

      const response = await axios.get(`${URL}/project_management/ideas`, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Ideas recibidas:", response.data);
      setIdeas(response.data);
    } catch (error) {
      console.error(
        "Error al obtener las ideas: ",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  const generatePDF = (status) => {
    if (!ideas || ideas.length === 0) {
      Swal.fire({
        title: "Advertencia",
        text: "No hay ideas para exportar.",
        icon: "warning",
      });
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18); // Título
    doc.text(`Ideas ${status}`, 14, 20); // Posición
    doc.setFontSize(12); // Contenido

    // Filtrar ideas según el estado
    const filteredIdeas = ideas.filter((idea) => idea.status === status);

    console.log("Ideas filtradas:", filteredIdeas);

    // Columnas para las ideas
    const ideaTableColumn = [
      "ID",
      "Idea",
      "Estado",
      "Creado por",
      "Aprobado por",
      "Fecha de modificación del estado",
      "Fecha de creación",
      "Fecha de actualización",
      "Razón (si es Rechazada)",
    ];

    // Filas de datos para las ideas filtradas
    const ideaTableRows = filteredIdeas.map((idea) => [
      idea.id,
      idea.idea,
      idea.status,
      idea.created_by || "N/A",
      idea.approved_by || "N/A",
      idea.status_modified_at || "N/A",
      idea.created || "N/A",
      idea.updated || "N/A",
      idea.status === "RJ" ? idea.reason : "", // Mostrar razón si el estado es rechazado (RJ)
    ]);

    // Generar tabla en el PDF
    doc.autoTable({
      head: [ideaTableColumn],
      body: ideaTableRows,
      startY: 30, // Posición de inicio de la tabla
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

    // Guardar el PDF con un nombre específico
    doc.save(`Ideas_${status}.pdf`);
  };

  return (
    <div className="ideas-pdf-container">
      <button className="pdf-btn" onClick={() => generatePDF("AP")}>
        Exportar ideas aceptadas
      </button>
      <button className="pdf-btn" onClick={() => generatePDF("RJ")}>
        Exportar ideas rechazadas
      </button>
      <button className="pdf-btn" onClick={() => generatePDF("NA")}>
        Exportar ideas sin aprobar
      </button>
    </div>
  );
};

export default PdfBrainstorm;
