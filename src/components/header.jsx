import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../css/header.css";
import Swal from "sweetalert2";
import URL from "./url";

const Header = ({ toggleMenu, menuOpen }) => {
  const navigate = useNavigate();
  const { logout, isAdmin, username } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [pendingEvents, setPendingEvents] = useState([]);

  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleBrainstormingRedirect = () => {
    if (isAdmin) {
      navigate("/brainstorming");
    } else {
      navigate("/brainstormingCm");
    }
  };

  const handleProposalsRedirect = () => {
    if (isAdmin) {
      navigate("/proposals");
    } else {
      navigate("/proposals_cm");
    }
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  useEffect(() => {
    if (!token) {
      Swal.fire({
        title: "Error",
        text: `Token no disponible. Por favor, inicia sesión nuevamente`,
        icon: "error",
      });
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    if (token) {
      const fetchPendingEvents = async () => {
        try {
          const response = await fetch(`${URL}/project_management/notify/`, {
            headers: {
              Authorization: `Token ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setPendingEvents(data);
          } else {
            console.error("Error al obtener los eventos:", response.status);
          }
        } catch (error) {
          console.error("Error en la solicitud:", error);
        }
      };

      fetchPendingEvents();
    }
  }, [token]);

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
  };

  const handleEventClick = () => {
    navigate("/calendar");
  };

  return (
    <div className="header">
      <div className="left-section">
        <button className="bell-btn" onClick={toggleNotifications}>
          🔔
          {pendingEvents.length > 0 && (
            <span className="notification-count">{pendingEvents.length}</span>
          )}
        </button>
        {notificationsOpen && (
          <div className="notifications-dropdown">
            <h4 className="noti-h4">Notificaciones</h4>
            {pendingEvents.length > 0 ? (
              pendingEvents.map((event) => (
                <div
                  key={event.id}
                  className="notification-item"
                  onClick={handleEventClick}
                >
                  Hay un evento sin realizar: {event.title} - {event.date}
                </div>
              ))
            ) : (
              <p>No hay eventos pendientes</p>
            )}
          </div>
        )}
      </div>

      <button className="hamburger" onClick={toggleMenu}>
        ☰
      </button>
      <div className={`menu ${menuOpen ? "open" : ""}`}>
        <center>
          {isAdmin && (
            <button className="opc" onClick={() => navigate("/link_account")}>
              Vincular cuentas
            </button>
          )}
          <button className="opc" onClick={() => navigate("/")}>
            Home
          </button>
          <button className="opc" onClick={handleBrainstormingRedirect}>
            Lluvia de ideas
          </button>
          <button className="opc" onClick={handleProposalsRedirect}>
            Propuestas
          </button>
          <button className="opc" onClick={() => navigate("/proposals_form")}>
            Formulario de Propuestas
          </button>
          <button className="opc" onClick={() => navigate("/calendar")}>
            Calendario
          </button>
          {isAdmin && (
            <button className="opc" onClick={() => navigate("/reports-pdf")}>
              Reportes
            </button>
          )}
          <button className="opc" onClick={() => navigate("/about")}>
            About
          </button>
          {/*<button className="opc" onClick={() => navigate('/link_account')}>Ir a Vinvular cuentas</button>*/}

          {isLoggedIn && (
            <div className="user-menu-container">
              <button className="user-btn" onClick={toggleUserMenu}>
                {isAdmin ? "👑" : "🛠️"} {username}
              </button>
              {userMenuOpen && (
                <div className="user-dropdown">
                  <button className="dropdown-option">
                    {isAdmin ? "Administrador/a" : "CM"}
                  </button>
                  <button className="dropdown-option" onClick={handleLogout}>
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          )}
        </center>
      </div>
    </div>
  );
};

export default Header;
