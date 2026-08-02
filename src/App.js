/**
 * @file App.js
 * @description Componente principal de la aplicación React
 * Configura las rutas de navegación usando React Router
 * @author Jefferson, ana maria sanchez, ricardo florez, isables corrales
 * @version 1.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Carrito from './pages/Carrito';
import AdminDashboard from './pages/AdminDashboard';
import CrearProducto from './pages/CrearProducto';
import Categoria from './pages/Categoria';
import { ToastProvider } from './context/ToastContext';
import Toast from './components/Toast';
import './styles/App.css';
/**
 * Componente principal App
 * Contiene toda la estructura de rutas de la aplicación
 * @returns {JSX.Element} La estructura completa de la aplicación
 */

function App() {
  return (
    <ToastProvider>
    <Router>
      <div className="App">
        {/* Notificación tipo toast, visible en toda la app, no bloquea la pantalla */}
        <Toast />
        {/* Barra de navegación visible en todas las páginas */}
        <Navbar />

         {/* Definición de rutas de la aplicación */}
        <Routes>
          {/* Ruta principal - Página de inicio */}
          <Route path="/" element={<Home />} />
          {/* Rutas de autenticación */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Ruta del carrito de compras */}
          <Route path="/carrito" element={<Carrito />} />
          {/* Ruta del panel de administrador */}
          <Route path="/admin" element={<AdminDashboard />} />
          {/* Ruta para crear productos (solo admin) */}
          <Route path="/crear-producto" element={<CrearProducto />} />
          {/* Rutas de categorías de productos */}
          <Route path="/:categoria" element={<Categoria />} />
        </Routes>
        <Footer />
      </div>
    </Router>
    </ToastProvider>
  );
}

export default App;