import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCantidadItems } from '../services/carritoService';
import { obtenerUsuario, cerrarSesion, EVENTO_SESION } from '../utils/auth';
import '../styles/Navbar.css';
function Navbar() {
  const [cantidadCarrito, setCantidadCarrito] = useState(0);
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  // Actualizar contador del carrito cuando cambie
  useEffect(() => {
    const actualizarContador = () => {
      setCantidadCarrito(getCantidadItems());
    };
    
    actualizarContador();
    
    // Escuchar cambios en localStorage (solo detecta cambios desde OTRA pestaña)
    window.addEventListener('storage', actualizarContador);
    // Escuchar nuestro evento propio (detecta cambios en ESTA misma pestaña)
    window.addEventListener('carritoActualizado', actualizarContador);

    return () => {
      window.removeEventListener('storage', actualizarContador);
      window.removeEventListener('carritoActualizado', actualizarContador);
    };
  }, []);

  // Mantener el estado del usuario sincronizado con localStorage
  useEffect(() => {
    const actualizarUsuario = () => {
      setUsuario(obtenerUsuario());
    };

    actualizarUsuario();

    // 'storage' detecta cambios desde otra pestaña;
    // EVENTO_SESION detecta cambios en esta misma pestaña (login/logout)
    window.addEventListener('storage', actualizarUsuario);
    window.addEventListener(EVENTO_SESION, actualizarUsuario);

    return () => {
      window.removeEventListener('storage', actualizarUsuario);
      window.removeEventListener(EVENTO_SESION, actualizarUsuario);
    };
  }, []);

  const handleCerrarSesion = () => {
    cerrarSesion();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">Elite Shoes</Link>
        
        <ul className="navbar-menu">
          <li><Link to="/" className="navbar-link">Inicio</Link></li>
          <li><Link to="/catalogo" className="navbar-link">Catálogo</Link></li>
          <li><Link to="/ofertas" className="navbar-link">Ofertas</Link></li>
        </ul>
        
        <div className="navbar-buttons">
          {/* Icono del carrito con contador */}
          <Link to="/carrito" className="btn-carrito-nav">
            🛒 Carrito
            {cantidadCarrito > 0 && (
              <span className="carrito-badge">{cantidadCarrito}</span>
            )}
          </Link>
          {usuario ? (
            <div className="navbar-sesion">
              <span className="navbar-saludo">
                Hola, {usuario.userName}
              </span>
              {usuario.roll === 'admin' && (
                <Link to="/admin" className="btn-login">Panel Admin</Link>
              )}
              <button onClick={handleCerrarSesion} className="btn-login btn-cerrar-sesion">
                Cerrar sesión
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-login">Login</Link>
              <Link to="/register" className="btn-register">Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;