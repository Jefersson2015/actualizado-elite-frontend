import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usuarioService } from '../services/api';
import '../styles/Auth.css';

function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await usuarioService.login(credentials);
    
    if (response.data) {
      // Guardar usuario en localStorage
      localStorage.setItem('usuario', JSON.stringify(response.data));
      
      // 🔧 CORRECCIÓN: Cambiar 'rol' por 'roll' (coincide con Java)
      if (response.data.roll === 'admin') {  // ✅ Antes: response.data.rol
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      alert('Credenciales inválidas');
    }
  } catch (error) {
    console.error('Error login:', error);
    alert('Error al iniciar sesión');
  }
};

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Email"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Contraseña"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              required
            />
          </div>
          <button type="submit" className="btn-submit">Ingresar</button>
        </form>
        <p className="auth-link">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;