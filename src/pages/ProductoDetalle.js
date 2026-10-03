import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productoService } from '../services/api';
import { agregarAlCarrito } from '../services/carritoService';
import { useToast } from '../context/ToastContext';
import '../styles/ProductoDetalle.css';

// Misma función de imagen que usa ProductoCard, para mantener consistencia
const obtenerUrlImagen = (producto) => {
  if (producto?.imagen) {
    return producto.imagen.startsWith('http')
      ? producto.imagen
      : `http://localhost:8080${producto.imagen}`;
  }
  return 'https://via.placeholder.com/500x400?text=Producto';
};

function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [tallaSeleccionada, setTallaSeleccionada] = useState(null);

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        const response = await productoService.obtenerPorId(id);
        setProducto(response.data);
      } catch (error) {
        console.error('Error al cargar el producto:', error);
        setProducto(null);
      } finally {
        setCargando(false);
      }
    };
    cargarProducto();
  }, [id]);

  // Convierte el texto "38, 39, 40" en una lista: ["38", "39", "40"]
  const tallasDisponibles = (producto?.tallas || '')
    .split(',')
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  const handleAgregarCarrito = () => {
    // Si el producto tiene tallas y no ha elegido ninguna, se le pide que elija
    if (tallasDisponibles.length > 0 && !tallaSeleccionada) {
      showToast('Selecciona una talla antes de agregar', 'error');
      return;
    }
    agregarAlCarrito({ ...producto, talla: tallaSeleccionada });
    showToast(`${producto.nombre} agregado al carrito`, 'success');
  };

  if (cargando) {
    return (
      <div className="detalle-container detalle-cargando">
        <p>Cargando producto...</p>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="detalle-container detalle-vacio">
        <h2>No encontramos este producto</h2>
        <p>Puede que ya no esté disponible.</p>
        <Link to="/" className="btn-volver">Volver al inicio</Link>
      </div>
    );
  }

  return (
    <div className="detalle-container">
      <button className="btn-volver-link" onClick={() => navigate(-1)}>
        ← Volver
      </button>

      <div className="detalle-card">
        <div className="detalle-imagen-wrap">
          <img
            src={obtenerUrlImagen(producto)}
            alt={producto.nombre}
            className="detalle-imagen"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/500x400?text=Producto';
            }}
          />
        </div>

        <div className="detalle-info">
          <h1 className="detalle-nombre">{producto.nombre}</h1>
          <p className="detalle-precio">
            ${producto.precio ? producto.precio.toLocaleString() : '0'} COP
          </p>

          <p className="detalle-descripcion">
            {producto.descripcion || 'Sin descripción disponible.'}
          </p>

          {tallasDisponibles.length > 0 && (
            <div className="detalle-tallas">
              <span className="detalle-tallas-label">Talla:</span>
              <div className="detalle-tallas-lista">
                {tallasDisponibles.map((talla) => (
                  <button
                    key={talla}
                    type="button"
                    className={`talla-pill ${tallaSeleccionada === talla ? 'talla-pill-activa' : ''}`}
                    onClick={() => setTallaSeleccionada(talla)}
                  >
                    {talla}
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="detalle-stock">
            {producto.stock > 0
              ? `${producto.stock} disponibles`
              : 'Sin stock disponible'}
          </p>

          <button
            className="btn-agregar-detalle"
            onClick={handleAgregarCarrito}
            disabled={!producto.stock}
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductoDetalle;