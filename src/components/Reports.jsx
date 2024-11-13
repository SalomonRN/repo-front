import React from "react";
import Header from "./header";
import { useState } from "react";
import "../css/reports.css";

// Importa los componentes de los botones ya existentes
import PdfProposal from "./PdfProposal";
import PdfCalendar from "./PdfCalendar";
import PdfBrainstorm from "./PdfBrainstorm";
import IgPdf from "./IgPdf";
import YtPdf from "./YtPdf";
import FbPdf from "./FbPdf";

const Reports = () => {
  const [menuHeight, setMenuHeight] = useState("0px");
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setMenuHeight(menuOpen ? "100px" : "500px");
  };

  return (
    <div
      className={`reports-container ${menuOpen ? "shifted" : ""}`}
      style={{ marginTop: menuHeight }}
    >
      <div className="header-container">
        <Header toggleMenu={toggleMenu} menuOpen={menuOpen} />
      </div>
      <h1 className="title">Generación de Reportes</h1>

      {/* Sección de Propuestas */}
      <div className="category-card">
        <h2>Propuestas</h2>
        <PdfProposal />{" "}
      </div>

      {/* Sección de Ideas */}
      <div className="category-card">
        <h2>Ideas</h2>
        <PdfBrainstorm />{" "}
      </div>

      {/* Sección de Eventos */}
      <div className="category-card">
        <h2>Eventos</h2>
        <PdfCalendar />{" "}
      </div>

      {/* Sección de Redes Sociales */}
      <div className="category-card">
        <h2>Redes Sociales</h2>
        <IgPdf />
        <YtPdf /> <FbPdf />
      </div>
    </div>
  );
};

export default Reports;
