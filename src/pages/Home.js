import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productoService } from '../services/api';
import hombreImg from '../images/hombre/nike-p6000-hombre.jpeg'
import damaImg from '../images/dama/nike-p6000-dama.jpeg'
import infantilImg from '../images/infantil/niñe-p6000-infantil.jpeg'
import '../styles/Home.css';
import ProductoCard from '../components/ProductoCard';


function Home() {
  // Estado para almacenar la lista de productos
  const [productos, setProductos] = useState([]);
  // Estado para controlar la carga de datos
  const [loading, setLoading] = useState(true);

  /**
   * Efecto que se ejecuta al montar el componente
   * Carga los productos desde el backend
   */
  useEffect(() => {
    cargarProductos();
  }, []);

   /**
   * Función asíncrona para cargar productos desde la API
   * @async
   * @function cargarProductos
   */
  const cargarProductos = async () => {
    try {
      const response = await productoService.listarTodos();
      setProductos(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  return (
    <div className="home">
      {/* Sección Hero - Banner principal */}
      <section className="hero">
        <h1>Nueva colección</h1>
        <p>Encuentra los mejores sneakers</p>
      </section>

      {/* Sección de Categorías */}
      <section className="categorias">
        <div className="container">
          <p className="section-label">Explora</p>
          <h2>Categorías</h2>
            <div className="categorias-grid"> 
            {/* Categoría Hombre */}
              <Link to="/hombre" className="categoria-card">
  <img src={hombreImg} alt="Calzado hombre" />
  <div className="overlay"><span>HOMBRE</span></div>
</Link>
            {/* Categoría Dama */}
<Link to="/dama" className="categoria-card">
  <img src={damaImg} alt="Calzado dama" />
  <div className="overlay"><span>DAMA</span></div>
</Link>
            {/* Categoría Infantil */}
<Link to="/infantil" className="categoria-card">
  <img src={infantilImg} alt="Calzado infantil" />
  <div className="overlay"><span>INFANTIL</span></div>
  </Link>
            </div>
        </div>
      </section>

      {/* Sección de Productos Destacados */}
      <section className="productos-destacados">
        <div className="container">
          <h2>Productos destacados</h2>
          
          {/* Si está cargando, muestra mensaje */}
          {loading ? (
            <p>Cargando productos...</p>
          ) : (
            <div className="productos-grid">
            {/* Validar si hay productos disponibles */}
              {productos && productos.length > 0 ? (
                productos.map((producto, index) => (
                  <ProductoCard key={producto?.id || index} producto={producto} />
                ))
              ) : (
                <p>No hay productos disponibles</p>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;