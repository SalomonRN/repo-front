import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/proposalsList.css';
import Header from './header';
import URL from "./url";

const ProposalsList = () => {
    const [proposals, setProposals] = useState([]);
    const navigate = useNavigate();
    const [menuHeight, setMenuHeight] = useState('0px');
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
        setMenuHeight(menuOpen ? '0px' : '300px');
    };



    useEffect(() => {
        // Función asincrónica para obtener las propuestas de la API con token de autenticación
        const fetchProposals = async () => {
            try {
                // Obtener el token del localStorage
                const token = localStorage.getItem('token');

                if (!token) {
                    console.error('No se encontró el token de autenticación');
                    return;
                }

                const response = await axios.get(`${URL}/content_proposal/`, {
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                setProposals(response.data); // Actualiza el estado de 'proposals' con las propuestas obtenidas

            } catch (error) {
                console.error('Error al obtener las propuestas: ', error.response?.data || error.message);
            }
        };

        fetchProposals();
    }, []); // [] -> El hook de efecto solo se ejecuta una vez (al montar el componente)

    const handleClick = (id) => {
        navigate(`/content_proposal/${id}`);
    };

    return (
        <div className={`proposals-list ${menuOpen ? 'shifted' : ''}`} style={{ marginTop: menuHeight }}>
            <div className="header-container">
                <Header toggleMenu={toggleMenu} menuOpen={menuOpen} />
            </div>
            <h1>Propuestas</h1>
            <ul>
                {/* Lista para mostrar las propuestas */}
                {proposals.length === 0 ? (
                    <p className="msj_empty">No hay propuestas disponibles por el momento :c</p>
                ) : (
                    <ul>
                        {proposals.map(proposal => (
                            <li className="proposals" key={proposal.id} onClick={() => handleClick(proposal.id)}>
                                Nombre: {proposal.title} <br />
                                Descripción: {proposal.copy} <br />
                                Hecha por: {proposal.proposed_by}
                            </li>
                        ))}
                    </ul>
                )}
            </ul>
        </div>
    );
}

export default ProposalsList;
