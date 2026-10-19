import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pedidoService } from '../services/api';
import { useToast } from '../context/ToastContext';
import ConfirmModal from '../components/ConfirmModal';
import '../styles/AdminPedidos.css';

// Estados posibles de un pedido, en el orden en que avanzan
const ESTADOS = ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'];

const ETIQUETAS = {
  pendiente: 'Pendiente',
  pagado: 'Pagado',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

const formatearFecha = (fecha) => {
  if (!fecha) return '-';
  return new Date(fecha).toLocaleString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState('todos');
  // Pedido que tiene el detalle desplegado (null = ninguno)
  const [expandido, setExpandido] = useState(null);
  // Cambio a "cancelado" esperando confirmación: { pedido }
  const [cancelacionPendiente, setCancelacionPendiente] = useState(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    // Solo los administradores pueden ver esta pantalla
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (!usuario || usuario.roll !== 'admin') {
      showToast('Acceso denegado. Solo administradores.', 'error');
      navigate('/');
      return;
    }

    cargarPedidos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const cargarPedidos = async () => {
    try {
      const response = await pedidoService.listarTodos();
      setPedidos(response.data || []);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      showToast('No se pudieron cargar los pedidos', 'error');
    } finally {
      setCargando(false);
    }
  };

  const aplicarCambio = async (pedido, nuevoEstado) => {
    try {
      await pedidoService.cambiarEstado(pedido.id, nuevoEstado);
      showToast(
        `Pedido #${pedido.id} marcado como ${ETIQUETAS[nuevoEstado].toLowerCase()}`,
        'success'
      );
      await cargarPedidos();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      showToast('No se pudo cambiar el estado del pedido', 'error');
    }
  };

  const solicitarCambio = (pedido, nuevoEstado) => {
    if (nuevoEstado === pedido.estado) return;

    // Cancelar devuelve el stock, así que pedimos confirmación
    if (nuevoEstado === 'cancelado') {
      setCancelacionPendiente(pedido);
      return;
    }
    aplicarCambio(pedido, nuevoEstado);
  };

  const confirmarCancelacion = async () => {
    const pedido = cancelacionPendiente;
    setCancelacionPendiente(null);
    await aplicarCambio(pedido, 'cancelado');
  };

  const pedidosVisibles =
    filtro === 'todos' ? pedidos : pedidos.filter((p) => p.estado === filtro);

  const contar = (estado) => pedidos.filter((p) => p.estado === estado).length;

  return (
    <div className="ap-page">
      <div className="ap-header">
        <h1>📦 Pedidos</h1>
        <button className="ap-btn-volver" onClick={() => navigate('/admin')}>
          ← Volver al panel
        </button>
      </div>

      <div className="ap-contenido">
        <div className="ap-filtros">
          <button
            className={`ap-filtro ${filtro === 'todos' ? 'ap-filtro-activo' : ''}`}
            onClick={() => setFiltro('todos')}
          >
            Todos ({pedidos.length})
          </button>
          {ESTADOS.map((estado) => (
            <button
              key={estado}
              className={`ap-filtro ${filtro === estado ? 'ap-filtro-activo' : ''}`}
              onClick={() => setFiltro(estado)}
            >
              {ETIQUETAS[estado]} ({contar(estado)})
            </button>
          ))}
        </div>

        {cargando ? (
          <p className="ap-mensaje">Cargando pedidos...</p>
        ) : pedidosVisibles.length === 0 ? (
          <p className="ap-mensaje">No hay pedidos en esta categoría.</p>
        ) : (
          <div className="ap-tabla-wrap">
            <table className="ap-tabla">
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Cambiar estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {pedidosVisibles.map((pedido) => (
                  <React.Fragment key={pedido.id}>
                    <tr>
                      <td>#{pedido.id}</td>
                      <td>{formatearFecha(pedido.fecha)}</td>
                      <td>{pedido.usuario?.username || '-'}</td>
                      <td>${pedido.total?.toLocaleString() || '0'} COP</td>
                      <td>
                        <span className={`ap-estado ap-estado-${pedido.estado}`}>
                          {ETIQUETAS[pedido.estado] || pedido.estado}
                        </span>
                      </td>
                      <td>
                        <select
                          className="ap-select"
                          value={pedido.estado}
                          disabled={pedido.estado === 'cancelado'}
                          onChange={(e) => solicitarCambio(pedido, e.target.value)}
                        >
                          {ESTADOS.map((estado) => (
                            <option
                              key={estado}
                              value={estado}
                              disabled={pedido.estado === 'entregado' && estado === 'cancelado'}
                            >
                              {ETIQUETAS[estado]}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <button
                          className="ap-btn-detalle"
                          onClick={() => setExpandido(expandido === pedido.id ? null : pedido.id)}
                        >
                          {expandido === pedido.id ? 'Ocultar' : 'Ver detalle'}
                        </button>
                      </td>
                    </tr>

                    {expandido === pedido.id && (
                      <tr className="ap-fila-detalle">
                        <td colSpan="7">
                          <ul className="ap-lista-detalle">
                            {(pedido.detalles || []).map((d) => (
                              <li key={d.id}>
                                <strong>{d.producto?.nombre || 'Producto'}</strong>
                                {' — '}
                                {d.cantidad} × ${d.precioUnitario?.toLocaleString() || '0'}
                                {' = '}
                                ${d.subtotal?.toLocaleString() || '0'} COP
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        visible={cancelacionPendiente !== null}
        titulo="Cancelar pedido"
        mensaje={`¿Cancelar el pedido #${cancelacionPendiente?.id}? Los productos volverán al inventario y el pedido no se podrá modificar después.`}
        onConfirm={confirmarCancelacion}
        onCancel={() => setCancelacionPendiente(null)}
      />
    </div>
  );
}

export default AdminPedidos;