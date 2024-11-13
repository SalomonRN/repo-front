import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Swal from "sweetalert2"; // Asegúrate de tener instalada la librería SweetAlert2
import "../css/igPdf.css";
import imagen from "../images/perfil.jpg"; // Imagen de perfil
import imagen2 from "../images/yt.jpg"; // Imagen de la miniatura del video

const YtPdf = () => {
  const [views, setViews] = useState(0);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState(0);

  // Función para generar números aleatorios
  const getRandomNumber = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  // Generar valores aleatorios de vistas, likes y comentarios al cargar el componente
  useEffect(() => {
    setViews(getRandomNumber(1000, 100000));
    setLikes(getRandomNumber(100, 1000));
    setComments(getRandomNumber(10, 100));
  }, []);

  // Función para generar el PDF
  const generatePDF = async () => {
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

    const doc = new jsPDF("p", "mm", "a4");

    doc.setFillColor(40, 40, 40); // Fondo blanco
    doc.rect(0, 0, 210, 297, "F"); // Fondo de toda la página

    // Crear un div temporal oculto para renderizar el contenido
    const youtubeShorts = document.createElement("div");
    youtubeShorts.style.position = "absolute";
    youtubeShorts.style.top = "-9999px"; // Moverlo fuera de la vista
    youtubeShorts.style.width = "300px"; // Ajusta el tamaño del contenido para el PDF

    youtubeShorts.innerHTML = `
      <div style="border: 1px solid #ddd; padding: 15px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #ffffff; border-radius: 10px;">
        <div style="display: flex; align-items: center; margin-bottom: 15px;">
          <img src="${imagen}" alt="Profile Picture" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 15px;" />
          <div>
            <span style="font-weight: bold; display: block;">RedManager</span>
            <span style="color: #555;">Hace 2 horas</span>
          </div>
        </div>
        <div style="margin-bottom: 15px;">
          <img src="${imagen2}" alt="Video Thumbnail" style="width: 100%; height: auto; border-radius: 10px;" />
        </div>
        <div style="display: flex; justify-content: space-between; color: #333;">
          <span>👁️ ${views} Vistas</span>
          <span>👍 ${likes} Me gusta</span>
          <span>💬 ${comments} Comentarios</span>
        </div>
        <div style="margin-top: 10px; font-size: 13px; color: #777;">
          <span>Subido por <strong>RedManager</strong></span>
        </div>
      </div>
    `;
    document.body.appendChild(youtubeShorts); // Añadir temporalmente al DOM

    // Convertir el div temporal en canvas
    const canvas = await html2canvas(youtubeShorts, {
      scale: 1,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const imgWidth = 120;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const xPos = (210 - imgWidth) / 2; // Centrado horizontalmente en A4 (210mm ancho)
    const yPos = (297 - imgHeight) / 2; // Centrado verticalmente en A4 (297mm alto)

    doc.addImage(imgData, "PNG", xPos, yPos, imgWidth, imgHeight);

    // Eliminar el div temporal
    document.body.removeChild(youtubeShorts);

    // Generar el PDF
    doc.save("PropuestaShorts.pdf");
  };

  return (
    <div>
      {/* Solo mostrar el botón para generar PDF en la pantalla */}
      <button className="pdf-btn" onClick={generatePDF}>
        Descargar Propuesta de YT en PDF
      </button>
    </div>
  );
};

export default YtPdf;
