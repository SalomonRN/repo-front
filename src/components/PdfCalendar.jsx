import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import Swal from "sweetalert2";
import URL from "./url";

const PdfCalendar = () => {
  const [events, setEvents] = useState([]);

  // Función para obtener eventos desde el backend
  const fetchEvents = async () => {
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

      const response = await axios.get(`${URL}/project_management/events`, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Eventos recibidos:", response.data);
      setEvents(response.data);
    } catch (error) {
      console.error(
        "Error al obtener los eventos: ",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Función para generar PDF según el estado del evento (completado o sin completar)
  const generatePDF = (status) => {
    if (!events || events.length === 0) {
      Swal.fire({
        title: "Advertencia",
        text: "No hay eventos para exportar.",
        icon: "warning",
      });
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Eventos ${status ? "Completados" : "Sin Completar"}`, 14, 20);
    doc.setFontSize(12);

    // Filtrar eventos según el estado
    const filteredEvents = events.filter((event) => event.status === status);

    console.log("Eventos filtrados:", filteredEvents);

    // Columnas para los eventos
    const eventTableColumn = [
      "Título",
      "Descripción",
      "Color",
      "Fecha",
      "Estado",
      "Aceptado por",
      "Creado por",
      "Fecha de creación",
      "Fecha de actualización",
    ];

    // Filas de datos para los eventos filtrados
    const eventTableRows = filteredEvents.map((event) => [
      event.title,
      event.description,
      event.color,
      event.date || "N/A",
      event.status ? "Completado" : "Pendiente",
      event.accepted_by || "N/A",
      event.created_by || "N/A",
      event.created || "N/A",
      event.updated || "N/A",
    ]);

    // Generar tabla en el PDF
    doc.autoTable({
      head: [eventTableColumn],
      body: eventTableRows,
      startY: 30,
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

    // Guardar el PDF
    doc.save(`Eventos_${status ? "Completados" : "Sin_Completar"}.pdf`);
  };

  return (
    <div className="events-pdf-container">
      <button className="pdf-btn" onClick={() => generatePDF(true)}>
        Exportar eventos completados
      </button>
      <button className="pdf-btn" onClick={() => generatePDF(false)}>
        Exportar eventos sin completar
      </button>
    </div>
  );
};

export default PdfCalendar;
