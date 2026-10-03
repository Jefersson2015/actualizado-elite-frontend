import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productoService } from '../services/api';
import api from '../services/api';
import '../styles/CrearProducto.css';

function CrearProducto() {
  const [producto, setProducto] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoria: 'hombre',
    tallas: ''
  });
  
  const [archivoImagen, setArchivoImagen] = useState(null);
  const [previewImagen, setPreviewImagen] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

    try {
      // 1. Crear el producto primero
      const response = await productoService.crear(productoData);
      const productoCreado = response.data;
      
      // 2. Si hay imagen, subirla
      if (archivoImagen) {
        const formData = new FormData();
        formData.append('imagen', archivoImagen);
        
        await api.post(`/productos/${productoCreado.id}/imagen`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      setMensaje('¡Producto creado exitosamente!');
      setError('');
      setProducto({ nombre: '', descripcion: '', precio: '', stock: '', categoria: 'hombre', tallas: '' });
      setArchivoImagen(null);
      setPreviewImagen(null);
      
      setTimeout(() => {
        navigate('/admin');
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
      setError('Error al crear el producto');
    }
  };

  return (
    <div className="crear-producto-container">
      <div className="crear-producto-card">
        <h2>Agregar Producto</h2>
        
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
            <label>Imagen del Producto</label>
            <input
              type="file"
              name="imagen"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input"
            />
            
            {previewImagen && (
              <div className="imagen-preview">
                <img src={previewImagen} alt="Preview" />
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

          <button type="submit" className="btn-guardar">Guardar</button>
          <button type="button" className="btn-cancelar" onClick={() => navigate('/admin')}>
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}

export default CrearProducto;