import React, { useState, useEffect } from 'react';
import { productoService } from '../services/api';
import ProductoCard from '../components/ProductoCard';
import '../styles/Catalogo.css';

// Opciones del filtro. "todos" muestra todo el catálogo.
const FILTROS = [
  { valor: 'todos', etiqueta: 'Todos' },
  { valor: 'hombre', etiqueta: 'Hombre' },
  { valor: 'dama', etiqueta: 'Dama' },
  { valor: 'infantil', etiqueta: 'Infantil' },
];

function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [filtro, setFiltro] = useState('todos');

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const response = await productoService.listarTodos();
        setProductos(response.data || []);
      } catch (err) {
        console.error('Error al cargar el catálogo:', err);
        setError(true);
      } finally {
        setCargando(false);
      }
    };
    cargarProductos();
  }, []);

  // Aplicar el filtro seleccionado (sin volver a pedir datos al backend)
  const productosVisibles =
    filtro === 'todos'
      ? productos
      : productos.filter(
          (p) => p.categoria?.toLowerCase() === filtro
        );

  return (
    <div className="catalogo-page">
      <section className="catalogo-header">
        <h1>Catálogo</h1>
        <p>Encuentra los mejores sneakers al mejor precio</p>
      </section>

      <section className="catalogo-contenido">
        <div className="catalogo-container">
          <div className="catalogo-filtros">
            {FILTROS.map((f) => (
              <button
                key={f.valor}
                type="button"
                className={`filtro-btn ${filtro === f.valor ? 'filtro-btn-activo' : ''}`}
                onClick={() => setFiltro(f.valor)}
              >
                {f.etiqueta}
              </button>
            ))}
          </div>

          {cargando ? (
            <p className="catalogo-mensaje">Cargando productos...</p>
          ) : error ? (
            <p className="catalogo-mensaje">
              No pudimos cargar el catálogo. Intenta de nuevo en unos minutos.
            </p>
          ) : productosVisibles.length > 0 ? (
            <>
              <p className="catalogo-conteo">
                {productosVisibles.length}{' '}
                {productosVisibles.length === 1 ? 'producto' : 'productos'}
              </p>
              <div className="catalogo-grid">
                {productosVisibles.map((producto, index) => (
                  <ProductoCard key={producto?.id || index} producto={producto} />
                ))}
              </div>
            </>
          ) : (
            <p className="catalogo-mensaje">
              👟 No hay productos disponibles en esta categoría
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export default Catalogo;