import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Elite Shoes</h3>
          <p>Los mejores sneakers al mejor precio.</p>
        </div>
        <div className="footer-section">
          <h3>Enlaces</h3>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/catalogo">Catálogo</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contacto</h3>
          <p>elite@email.com</p>
          <p>+57 300 0000000</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 Elite Shoes - Proyecto SENA</p>
      </div>
    </footer>
  );
}

export default Footer;