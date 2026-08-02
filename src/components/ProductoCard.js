import React from 'react';
import { agregarAlCarrito } from '../services/carritoService';
import { useToast } from '../context/ToastContext';
import '../styles/ProductoCard.css';

// Función para obtener la URL de la imagen
const obtenerUrlImagen = (producto) => {
  // 1. Si el producto tiene imagen subida, usarla
  if (producto.imagen) {
    // Si ya es URL completa, dejarla. Si es ruta relativa (/uploads/...), agregar el host del backend
    return producto.imagen.startsWith('http')
      ? producto.imagen
      : `http://localhost:8080${producto.imagen}`;
  }

  // 2. Fallback: Generar imagen por nombre si no hay imagen subida
  const nombre = producto.nombre || '';
  const nombreLower = nombre.toLowerCase();

  if (nombreLower.includes('nike')) {
    return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=250&fit=crop';
  }
  if (nombreLower.includes('adidas')) {
    return 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=300&h=250&fit=crop';
  }
  if (nombreLower.includes('puma')) {
    return 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=300&h=250&fit=crop';
  }
  if (nombreLower.includes('reebok')) {
    return 'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=300&h=250&fit=crop';
  }
  if (nombreLower.includes('jordan')) {
    return 'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?w=300&h=250&fit=crop';
  }
  if (nombreLower.includes('vans')) {
    return 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=300&h=250&fit=crop';
  }
  if (nombreLower.includes('converse')) {
    return 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=300&h=250&fit=crop';
  }

  // Imagen por defecto si no coincide con ninguna marca
  return 'https://via.placeholder.com/300x250?text=Producto';
};

function ProductoCard({ producto }) {
  const { showToast } = useToast();

  // Validación defensiva
  if (!producto) {
    return null;
  }

  const handleAgregarCarrito = () => {
    agregarAlCarrito(producto);
    showToast(`${producto.nombre || 'Producto'} agregado al carrito`, 'success');
  };

  return (
    <div className="producto-card">
      <img 
        src={obtenerUrlImagen(producto)} 
        alt={producto.nombre || 'Producto'}
        className="producto-imagen"
        onError={(e) => {
          // Si la imagen falla, cargar placeholder
          e.target.src = 'https://via.placeholder.com/300x250?text=Producto';
        }}
      />
      <div className="producto-info">
        <h3 className="producto-nombre">{producto.nombre || 'Sin nombre'}</h3>
        
        <p className="producto-precio">
          ${producto.precio ? producto.precio.toLocaleString() : '0'} COP
        </p>
        
        <p className="producto-stock">Stock: {producto.stock || 0}</p>
        
        <div className="producto-buttons">
          <button className="btn-ver">Ver producto</button>
          <button className="btn-carrito" onClick={handleAgregarCarrito}>
             Agregar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductoCard;