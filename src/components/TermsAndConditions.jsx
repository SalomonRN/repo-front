import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import URL from "./url";
import "../css/terms.css";

function TermsAndConditions() {
  const [termsStatus, setTermsStatus] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      Swal.fire({
        title: "Error",
        text: "No tienes token de acceso. Inicia sesión primero.",
        icon: "error",
      });
      console.error("No se encontró el token de autenticación");
      navigate("/login");
      return;
    }

    fetch(`${URL}/auth/terms-status/`, {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la respuesta de la API");
        }
        return response.json();
      })
      .then((data) => {
        setTermsStatus(data.termsStatus);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al verificar estado de términos:", error);
        Swal.fire({
          title: "Error",
          text: "Hubo un problema al verificar los términos. Intenta nuevamente.",
          icon: "error",
        });
        setLoading(false);
      });
  }, [navigate]);

  const handleAccept = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      Swal.fire({
        title: "Error",
        text: "No tienes token de acceso. Inicia sesión primero.",
        icon: "error",
      });
      console.error("No se encontró el token de autenticación");
      return;
    }

    if (isChecked) {
      const formData = new FormData();
      formData.append("termsStatus", "accepted");

      fetch(`${URL}/auth/terms-status/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al actualizar estado de términos");
          }
          return response.json();
        })
        .then(() => {
          setTermsStatus("accepted");
          localStorage.setItem("termsStatus", "accepted");
          console.log("terms: accepted");
          Swal.fire({
            icon: "success",
            title: "Acceso Permitido",
            text: "En breve serás redirigido a la aplicación",
            timer: 3000,
            timerProgressBar: true,
            didClose: () => {
              navigate("/");
            },
          });
        })
        .catch((error) =>
          console.error("Error al actualizar estado de términos:", error)
        );
    }
  };

  if (termsStatus === "stateless") {
    return (
      <div className="terms-container">
        <div className="terms_conditions">
          <h1>Términos y Condiciones de Uso de RedManager</h1>
          <div className="terms-section">
            <h3>1. Introducción</h3>
            <p>
              Al acceder a esta aplicación, usted acepta cumplir con los
              términos y condiciones establecidos en este documento. Estos
              Términos y Condiciones están diseñados para asegurar el uso
              responsable de la plataforma y proteger tanto a la empresa como a
              los usuarios de potenciales riesgos legales. Si usted no está de
              acuerdo con estos términos, no podrá acceder a la aplicación.
            </p>
          </div>
          <div className="terms-section">
            <h3>2. Uso aceptable de la aplicacción</h3>
            <p>
              La aplicación está destinada a fines empresariales y no
              personales, para gestionar, revisar y publicar contenido en
              representación de la empresa. Todo uso debe ser profesional y
              respetuoso de las políticas y directrices de la compañía.
              <br />
              El Usuario se compromete a:
            </p>
            <ul>
              <li>
                Utilizar la aplicación exclusivamente para los fines
                autorizados.
              </li>
              <li>No compartir sus credenciales de acceso con terceros</li>
              <li>
                Mantener la confidencialidad de la información sensible a la que
                tenga acceso
              </li>
              <li>
                Notificar de inmediato cualquier uso no autorizado de su cuenta
                o cualquier brecha de seguridad
              </li>
            </ul>
          </div>
          <div className="terms-section">
            <h3>3. Contenido prohibido</h3>
            <p>
              El Usuario se compromete a no publicar, compartir o distribuir a
              través de la plataforma ningún contenido que:
            </p>
            <ul>
              <li>
                Sea considerado sensible, confidencial o inapropiado para su
                difusión pública.
              </li>
              <li>
                Contenga información falsa, engañosa o destinada a causar
                confusión.
              </li>
              <li>
                Sea ofensivo, difamatorio, obsceno, acosador, abusivo, o que
                pueda incitar a la violencia.
              </li>
              <li>
                Infrinja los derechos de propiedad intelectual, como derechos de
                autor, marcas comerciales o secretos comerciales, de terceros.
              </li>
              <li>
                Vulnere los derechos de privacidad o cualquier otra normativa de
                protección de datos aplicable.
              </li>
              <li>
                Sea discriminatorio, ya sea por razones de raza, religión,
                género, orientación sexual, edad o discapacidad.
              </li>
            </ul>
          </div>
          <div className="terms-section">
            <h3>4. Política de privacidad y protección de datos</h3>
            <p>
              El Usuario entiende que el acceso a esta aplicación implica el
              tratamiento de ciertos datos personales, y se compromete a cumplir
              con la normativa vigente en materia de protección de datos.
              Asimismo, se compromete a no recopilar, compartir ni utilizar
              datos personales de los usuarios para fines no autorizados o
              ajenos a la actividad de la aplicación.
            </p>
          </div>
          <div className="terms-section">
            <h3>5. Propiedad Intelectual</h3>
            <p>
              Todo el contenido publicado a través de esta aplicación es
              propiedad de la empresa, incluyendo, sin limitación, textos,
              imágenes, gráficos y software. El Usuario no podrá reproducir,
              modificar, distribuir, o realizar cualquier otro uso de dicho
              contenido sin la autorización expresa de la empresa.
            </p>
          </div>
          <div className="terms-section">
            <h3>6. Responsabilidad del Usuario</h3>
            <p>
              El Usuario acepta que cualquier acción realizada desde su cuenta
              es de su exclusiva responsabilidad. La empresa se reserva el
              derecho de tomar medidas disciplinarias, incluyendo la suspensión
              de acceso a la plataforma o la rescisión de la relación
              contractual, en caso de incumplimiento de estos términos.
            </p>
          </div>
          <div className="terms-section">
            <h3>7. Modificación de los términos y condiciones</h3>
            <p>
              La empresa se reserva el derecho de actualizar o modificar estos
              Términos y Condiciones en cualquier momento. Las modificaciones se
              comunicarán al Usuario, quien deberá aceptarlas para continuar
              usando la aplicación.
            </p>
          </div>
          <div className="terms-section">
            <h3>8. Aceptacion y vigencia</h3>
            <p>
              Al hacer clic en "Aceptar", el Usuario declara haber leído y
              comprendido estos Términos y Condiciones, y se compromete a
              cumplir con ellos en su totalidad. En caso de no aceptarlos, el
              Usuario no podrá hacer uso de la aplicación hasta que acepte estos
              términos.
            </p>
          </div>
          <p className="note">
            <b>Última actualización:</b>
            <i>[11/11/2024]</i>
          </p>
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
          />{" "}
          Acepto los términos y condiciones
          <button onClick={handleAccept} disabled={!isChecked}>
            Aceptar
          </button>
        </div>
      </div>
    );
  } else if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Cargando...</div>
      </div>
    );
  } else {
    return (
      <div className="error-container">
        <div className="error-text">
          Hubo un problema al cargar los términos.
        </div>
      </div>
    );
  }
}
export default TermsAndConditions;
