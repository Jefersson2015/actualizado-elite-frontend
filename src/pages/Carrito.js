import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getCarrito, 
  eliminarDelCarrito, 
  vaciarCarrito, 
  calcularTotal 
} from '../services/carritoService';
import { pedidoService } from '../services/api';
import ConfirmModal from '../components/ConfirmModal';
import '../styles/Carrito.css';

function Carrito() {
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const navigate = useNavigate();

  // Cargar carrito al iniciar
  useEffect(() => {
    cargarCarrito();
  }, []);

  const cargarCarrito = () => {
    const carritoActual = getCarrito();
    setCarrito(carritoActual);
    setTotal(calcularTotal());
  };

  const handleEliminar = (id) => {
    const carritoActualizado = eliminarDelCarrito(id);
    setCarrito(carritoActualizado);
    setTotal(calcularTotal());
  };

  const handleVaciar = () => {
    // En vez de bloquear con el confirm() nativo del navegador,
    // mostramos nuestro propio modal de confirmación
    setMostrarConfirmacion(true);
  };

  const confirmarVaciar = () => {
    vaciarCarrito();
    setCarrito([]);
    setTotal(0);
    setMostrarConfirmacion(false);
  };

  const cancelarVaciar = () => {
    setMostrarConfirmacion(false);
  };

  const handleComprar = async () => {
    if (carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    // Verificar si hay usuario logueado
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    
    if (!usuario) {
      alert('Debes iniciar sesión para realizar un pedido');
      navigate('/login');
      return;
    }

    try {
      // Preparar los datos para enviar al backend
      const pedidoData = {
        idUsuario: usuario.id,  // El ID del usuario logueado
        total: total,           // Total calculado
        items: carrito.map(item => ({
          idProducto: item.id,
          cantidad: item.cantidad
        }))
      };

      // Enviar pedido al backend
      const response = await pedidoService.crear(pedidoData);
      
      // Si todo sale bien
      alert(`✅ ¡Pedido creado exitosamente!\nID: ${response.data.id}\nTotal: $${total.toLocaleString()} COP`);
      
      // Vaciar carrito
      vaciarCarrito();
      setCarrito([]);
      setTotal(0);
      
      // Redirigir al inicio
      navigate('/');
      
    } catch (error) {
      console.error('Error al crear pedido:', error);
      alert('❌ Error al crear el pedido. Verifica que el backend esté corriendo.');
    }
  };

  return (
    <div className="carrito-container">
      <div className="carrito-header">
        <h1>🛒 Carrito de Compras</h1>
        <button onClick={() => navigate('/')} className="btn-seguir">
          ← Seguir Comprando
        </button>
      </div>

      {carrito.length === 0 ? (
        <div className="carrito-vacio">
          <p>🛍️ Tu carrito está vacío</p>
          <button onClick={() => navigate('/')} className="btn-comprar">
            Ir a Tienda
          </button>
        </div>
      ) : (
        <div className="carrito-content">
          <div className="carrito-items">
            <h2>Productos ({carrito.length})</h2>
            {carrito.map(item => (
              <div key={item.id} className="carrito-item">
                <img 
                  src={`https://via.placeholder.com/100x100?text=${encodeURIComponent(item.nombre)}`} 
                  alt={item.nombre}
                  className="item-imagen"
                />
                <div className="item-info">
                  <h3>{item.nombre}</h3>
                  <p className="item-precio">${item.precio?.toLocaleString()} COP</p>
                  <p className="item-cantidad">Cantidad: {item.cantidad}</p>
                  <p className="item-subtotal">
                    Subtotal: ${(item.precio * item.cantidad)?.toLocaleString()} COP
                  </p>
                </div>
                <button 
                  onClick={() => handleEliminar(item.id)}
                  className="btn-eliminar-item"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>

          <div className="carrito-resumen">
            <h2>Resumen del Pedido</h2>
            <div className="resumen-fila">
              <span>Subtotal:</span>
              <span>${total.toLocaleString()} COP</span>
            </div>
            <div className="resumen-fila">
              <span>Envío:</span>
              <span>Gratis</span>
            </div>
            <div className="resumen-total">
              <span>Total:</span>
              <span>${total.toLocaleString()} COP</span>
            </div>
            <button onClick={handleComprar} className="btn-comprar">
              Realizar Pedido
            </button>
            <button onClick={handleVaciar} className="btn-vaciar">
              Vaciar Carrito
            </button>
          </div>
        </div>
      )}

      <ConfirmModal
        visible={mostrarConfirmacion}
        titulo="Vaciar carrito"
        mensaje="¿Seguro que deseas vaciar el carrito? Esta acción no se puede deshacer."
        onConfirm={confirmarVaciar}
        onCancel={cancelarVaciar}
      />
    </div>
  );
}

export default Carrito;