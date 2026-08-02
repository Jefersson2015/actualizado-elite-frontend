import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productoService } from '../services/api';
import { useToast } from '../context/ToastContext';
import '../styles/AdminDashboard.css';

function AdminDashboard() {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
  // Verificar si es admin
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  
  if (!usuario || usuario.roll !== 'admin') {
    showToast('Acceso denegado. Solo administradores.', 'error');
    navigate('/');
    return;
  }
  
  cargarProductos();
}, [navigate]);

  const cargarProductos = async () => {
    try {
      const response = await productoService.listarTodos();
      setProductos(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const eliminarProducto = async (id) => {
    // eslint-disable-next-line no-restricted-globals
if (confirm('¿Seguro que desea eliminar este producto?')) {
      try {
        await productoService.eliminar(id);
        showToast('Producto eliminado', 'success');
        cargarProductos();
      } catch (error) {
        showToast('Error al eliminar', 'error');
      }
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>👤 Panel de Administrador</h1>
        <button onClick={cerrarSesion} className="btn-logout">Cerrar Sesión</button>
      </div>

      <div className="admin-content">
        <div className="admin-actions">
          <button onClick={() => navigate('/crear-producto')} className="btn-agregar">
            + Agregar Producto
          </button>
        </div>

        <div className="productos-admin">
          <h2>Productos ({productos.length})</h2>
          <table className="tabla-productos">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(producto => (
                <tr key={producto.id}>
                  <td>{producto.id}</td>
                  <td>{producto.nombre}</td>
                  <td>${producto.precio?.toLocaleString() || '0'} COP</td>
                  <td>{producto.stock}</td>
                  <td>
                    <button onClick={() => eliminarProducto(producto.id)} className="btn-eliminar">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;