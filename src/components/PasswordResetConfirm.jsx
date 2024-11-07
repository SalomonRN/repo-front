import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/passwordReset.css';
import URL from './url';

const PasswordResetConfirm = () => {
  const { userId, token } = useParams(); // Obtiene userId y token de la URL
  const navigate = useNavigate();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handlePasswordReset = async (e) => {
    
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    const formdata = new FormData();
    
    formdata.append('user_id', userId)
    formdata.append('token', token)
    formdata.append('new_password', newPassword)

    try {
      const response = await fetch(`${URL}/auth/password-reset-confirm/`, {
        method: 'POST',
        body: formdata
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error('Error al restablecer la contraseña');
      }

      navigate('/login'); // Redirige al login después de cambiar la contraseña
    } catch (err) {
      setError(err.message);
    }
  };
//handlePasswordReset
  return (
    <div className='psw-container'>
      <h2>MENSAJITO</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
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
    </div>
  );
};

export default PasswordResetConfirm;
