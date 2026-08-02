import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCantidadItems } from '../services/carritoService';
import '../styles/Navbar.css';
function Navbar() {
  const [cantidadCarrito, setCantidadCarrito] = useState(0);

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
          <Link to="/login" className="btn-login">Login</Link>
          <Link to="/register" className="btn-register">Registrarse</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;