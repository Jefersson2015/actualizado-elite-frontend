import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productoService } from '../services/api';
import api from '../services/api';
import '../styles/CrearProducto.css';

// Esta misma pantalla sirve para CREAR (ruta /crear-producto)
// y para EDITAR (ruta /editar-producto/:id).
function CrearProducto() {
  const { id } = useParams();
  const modoEdicion = Boolean(id);

  const [producto, setProducto] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoria: 'hombre',
    tallas: ''
  });

  const [imagenActual, setImagenActual] = useState(null);
  const [archivoImagen, setArchivoImagen] = useState(null);
  const [previewImagen, setPreviewImagen] = useState(null);
  const [cargando, setCargando] = useState(modoEdicion);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // En modo edición: traer el producto y llenar el formulario
  useEffect(() => {
    if (!modoEdicion) return;

    const cargarProducto = async () => {
      try {
        const response = await productoService.obtenerPorId(id);
        const p = response.data;
        setProducto({
          nombre: p.nombre || '',
          descripcion: p.descripcion || '',
          precio: p.precio ?? '',
          stock: p.stock ?? '',
          categoria: p.categoria || 'hombre',
          tallas: p.tallas || ''
        });
        setImagenActual(p.imagen || null);
      } catch (err) {
        console.error('Error al cargar el producto:', err);
        setError('No se pudo cargar el producto');
      } finally {
        setCargando(false);
      }
    };

    cargarProducto();
  }, [id, modoEdicion]);

  const handleChange = (e) => {
    setProducto({
      ...producto,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArchivoImagen(file);
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImagen(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // URL completa de la imagen que ya tiene el producto
  const urlImagenActual = imagenActual
    ? (imagenActual.startsWith('http') ? imagenActual : `http://localhost:8080${imagenActual}`)
    : null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productoData = {
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: parseFloat(producto.precio),
      stock: parseInt(producto.stock),
      categoria: producto.categoria,
      tallas: producto.tallas
    };

    // IMPORTANTE: el backend reemplaza el producto completo al actualizar.
    // Si no reenviamos la imagen actual, el producto se quedaría sin foto.
    if (modoEdicion) {
      productoData.imagen = imagenActual;
    }

    try {
      // 1. Crear o actualizar el producto
      const response = modoEdicion
        ? await productoService.actualizar(id, productoData)
        : await productoService.crear(productoData);
      const productoGuardado = response.data;

      // 2. Si eligió una imagen nueva, subirla
      if (archivoImagen) {
        const formData = new FormData();
        formData.append('imagen', archivoImagen);

        await api.post(`/productos/${productoGuardado.id}/imagen`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      setMensaje(modoEdicion ? '¡Producto actualizado exitosamente!' : '¡Producto creado exitosamente!');
      setError('');

      if (!modoEdicion) {
        setProducto({ nombre: '', descripcion: '', precio: '', stock: '', categoria: 'hombre', tallas: '' });
        setArchivoImagen(null);
        setPreviewImagen(null);
      }

      setTimeout(() => {
        navigate('/admin');
      }, 1500);
    } catch (error) {
      console.error('Error:', error);
      setError(modoEdicion ? 'Error al actualizar el producto' : 'Error al crear el producto');
    }
  };

  if (cargando) {
    return (
      <div className="crear-producto-container">
        <p>Cargando producto...</p>
      </div>
    );
  }

  return (
    <div className="crear-producto-container">
      <div className="crear-producto-card">
        <h2>{modoEdicion ? 'Editar Producto' : 'Agregar Producto'}</h2>

        {mensaje && <div className="mensaje-exito">{mensaje}</div>}
        {error && <div className="mensaje-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              placeholder="Ej: Zapatillas Nike"
              value={producto.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              name="descripcion"
              placeholder="Descripción del producto"
              value={producto.descripcion}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Categoría</label>
            <select
              name="categoria"
              value={producto.categoria}
              onChange={handleChange}
              required
            >
              <option value="hombre">Hombre</option>
              <option value="dama">Dama</option>
              <option value="infantil">Infantil</option>
            </select>
          </div>
          <div className="form-group">
            <label>{modoEdicion ? 'Cambiar imagen (opcional)' : 'Imagen del Producto'}</label>
            <input
              type="file"
              name="imagen"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input"
            />

            {(previewImagen || urlImagenActual) && (
              <div className="imagen-preview">
                <img src={previewImagen || urlImagenActual} alt="Preview" />
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Precio (COP)</label>
            <input
              type="number"
              name="precio"
              placeholder="Ej: 250000"
              value={producto.precio}
              onChange={handleChange}
              required
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Stock</label>
            <input
              type="number"
              name="stock"
              placeholder="Ej: 50"
              value={producto.stock}
              onChange={handleChange}
              required
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Tallas disponibles</label>
            <input
              type="text"
              name="tallas"
              placeholder="Ej: 38, 39, 40, 41, 42"
              value={producto.tallas}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn-guardar">
            {modoEdicion ? 'Guardar cambios' : 'Guardar'}
          </button>
          <button type="button" className="btn-cancelar" onClick={() => navigate('/admin')}>
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}

export default CrearProducto;