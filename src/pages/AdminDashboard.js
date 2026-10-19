import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productoService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { cerrarSesion as cerrarSesionGlobal } from '../utils/auth';
import ConfirmModal from '../components/ConfirmModal';
import '../styles/AdminDashboard.css';

function AdminDashboard() {
  const [productos, setProductos] = useState([]);
  // Producto que el admin quiere eliminar (null = ninguno, el modal está oculto)
  const [productoAEliminar, setProductoAEliminar] = useState(null);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const cargarProductos = async () => {
    try {
      const response = await productoService.listarTodos();
      setProductos(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Paso 1: el admin da clic en "Eliminar" -> solo se abre el modal
  const solicitarEliminar = (producto) => {
    setProductoAEliminar(producto);
  };

  // Paso 2a: el admin confirma -> ahora sí se elimina
  const confirmarEliminar = async () => {
    try {
      await productoService.eliminar(productoAEliminar.id);
      showToast('Producto eliminado', 'success');
      cargarProductos();
    } catch (error) {
      showToast('Error al eliminar', 'error');
    } finally {
      setProductoAEliminar(null);
    }
  };

  // Paso 2b: el admin cancela -> se cierra el modal y no pasa nada
  const cancelarEliminar = () => {
    setProductoAEliminar(null);
  };

  const cerrarSesion = () => {
    cerrarSesionGlobal();
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
          <button onClick={() => navigate('/admin/pedidos')} className="btn-pedidos">
            📦 Ver pedidos
          </button>
        </div>

        <div className="productos-admin">
          <h2>Productos ({productos.length})</h2>
          <table className="tabla-productos">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Categoría</th>
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
                  <td>{producto.categoria}</td>
                  <td>${producto.precio?.toLocaleString() || '0'} COP</td>
                  <td>{producto.stock}</td>
                  <td>
                    <div className="acciones-admin">
                      <button
                        onClick={() => navigate(`/editar-producto/${producto.id}`)}
                        className="btn-editar"
                      >
                        Editar
                      </button>
                      <button onClick={() => solicitarEliminar(producto)} className="btn-eliminar">
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        visible={productoAEliminar !== null}
        titulo="Eliminar producto"
        mensaje={`¿Seguro que deseas eliminar "${productoAEliminar?.nombre}"? Esta acción no se puede deshacer.`}
        onConfirm={confirmarEliminar}
        onCancel={cancelarEliminar}
      />
    </div>
  );
}

export default AdminDashboard;