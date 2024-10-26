import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/passwordReset.css';
import URL from './url';

const PasswordReset = () => {
  const { userId, token } = useParams(); // Obtiene userId y token de la URL
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${URL}/auth/reset-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar el correo');
      }

      setIsEmailSent(true);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    try {
      const response = await fetch(`${URL}/auth/password-reset-confirm/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          token: token,
          new_password: newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al restablecer la contraseña');
      }

      navigate('/login'); // Redirige al login después de cambiar la contraseña
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className='psw-container'>
      <h2>{isEmailSent ? 'Restablecer Contraseña' : 'Solicitar Restablecimiento de Contraseña'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!isEmailSent ? (
        <form onSubmit={handleEmailSubmit}>
          <label>
            Correo Electrónico:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <button type="submit">Enviar Correo</button>
        </form>
      ) : (
        <form onSubmit={handlePasswordReset}>
          <label>
            Nueva Contraseña:
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </label>
          <label>
            Confirmar Contraseña:
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit">Restablecer Contraseña</button>
        </form>
      )}
    </div>
  );
};

export default PasswordReset;
