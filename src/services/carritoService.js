// Servicio para manejar el carrito de compras
// Usamos localStorage para guardar el carrito temporalmente

// Clave para guardar en localStorage
const CART_KEY = 'elite_carrito';

// Nombre del evento personalizado que avisa "el carrito cambió"
const EVENTO_CARRITO = 'carritoActualizado';

// Avisa a toda la app (incluyendo el Navbar) que el carrito cambió,
// sin necesidad de refrescar la página.
const avisarCambio = () => {
  window.dispatchEvent(new Event(EVENTO_CARRITO));
};

// Obtener carrito actual
export const getCarrito = () => {
  const carrito = localStorage.getItem(CART_KEY);
  return carrito ? JSON.parse(carrito) : [];
};

// Agregar producto al carrito
export const agregarAlCarrito = (producto) => {
  const carrito = getCarrito();
  
  // Verificar si el producto ya está en el carrito
  const existe = carrito.find(item => item.id === producto.id);
  
  if (existe) {
    // Si ya existe, aumentar la cantidad
    existe.cantidad += 1;
  } else {
    // Si no existe, agregarlo con cantidad 1
    carrito.push({ ...producto, cantidad: 1 });
  }
  
  // Guardar en localStorage
  localStorage.setItem(CART_KEY, JSON.stringify(carrito));
  avisarCambio();
  
  // Retornar el carrito actualizado
  return getCarrito();
};

// Eliminar producto del carrito
export const eliminarDelCarrito = (id) => {
  const carrito = getCarrito();
  const carritoActualizado = carrito.filter(item => item.id !== id);
  localStorage.setItem(CART_KEY, JSON.stringify(carritoActualizado));
  avisarCambio();
  return carritoActualizado;
};

// Vaciar carrito completo
export const vaciarCarrito = () => {
  localStorage.removeItem(CART_KEY);
  avisarCambio();
  return [];
};

// Calcular total del carrito
export const calcularTotal = () => {
  const carrito = getCarrito();
  return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
};

// Obtener cantidad de items en el carrito
export const getCantidadItems = () => {
  const carrito = getCarrito();
  return carrito.reduce((total, item) => total + item.cantidad, 0);
};