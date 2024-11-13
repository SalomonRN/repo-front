import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Swal from "sweetalert2"; // Asegúrate de tener instalada la librería SweetAlert2
import "../css/igPdf.css";
import imagen from "../images/perfil.jpg";
import imagen2 from "../images/ig.jpg";

const IgPdf = () => {
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState(0);

  // Función para generar números aleatorios
  const getRandomNumber = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  // Generar valores aleatorios de likes y comentarios al cargar el componente
  useEffect(() => {
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

    doc.setFillColor(129, 52, 175);
    doc.rect(0, 0, 210, 297, "F");

    // Crear un div temporal oculto para renderizar el contenido
    const instagramPost = document.createElement("div");
    instagramPost.style.position = "absolute";
    instagramPost.style.top = "-9999px"; // Moverlo fuera de la vista
    instagramPost.style.width = "300px"; // Ajusta el tamaño del contenido para el PDF

    instagramPost.innerHTML = `
      <div style="border: 1px solid #ddd; padding: 10px; font-family: Arial, sans-serif;">
        <div style="display: flex; align-items: center; margin-bottom: 10px;">
          <img src="${imagen}" alt="Profile Picture" style="width: 40px; height: 50px; border-radius: 50%; margin-right: 10px;" />
          <div>
            <span style="font-weight: bold; display: block;">RedManager</span>
            <span style="color: #555;">Bogotá, Colombia</span>
          </div>
        </div>
        <div style="margin-bottom: 10px;">
          <img src="${imagen2}" alt="Post Content" style="width: 100%; border-radius: 10px;" />
        </div>
        <div style="display: flex; justify-content: space-between; color: #333;">
          <span>❤️ ${likes} Likes</span>
          <span>💬 ${comments} Comments</span>
        </div>
      </div>
    `;
    document.body.appendChild(instagramPost); // Añadir temporalmente al DOM

    // Convertir el div temporal en canvas
    const canvas = await html2canvas(instagramPost, {
      scale: 1,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const imgWidth = 110;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const xPos = (210 - imgWidth) / 2; // Centrado horizontalmente en A4 (210mm ancho)
    const yPos = (297 - imgHeight) / 2; // Centrado verticalmente en A4 (297mm alto)

    doc.addImage(imgData, "PNG", xPos, yPos, imgWidth, imgHeight);

    // Eliminar el div temporal
    document.body.removeChild(instagramPost);

    // Generar el PDF
    doc.save("PropuestaSocialMedia.pdf");
  };

  return (
    <div>
      <button className="pdf-btn" onClick={generatePDF}>
        Descargar Propuesta de IG en PDF
      </button>
    </div>
  );
};

export default IgPdf;
