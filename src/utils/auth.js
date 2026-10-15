// Nombre del evento personalizado que avisa "la sesión cambió"
// (login o logout), para que el Navbar se entere al instante,
// igual que hicimos con el carrito.
export const EVENTO_SESION = 'sesionActualizada';

// Lee el usuario actualmente logueado desde localStorage.
// Devuelve null si no hay nadie logueado.
export const obtenerUsuario = () => {
  const data = localStorage.getItem('usuario');
  return data ? JSON.parse(data) : null;
};

// Guarda el usuario tras un login exitoso y avisa a toda la app.
export const guardarUsuario = (usuario) => {
  localStorage.setItem('usuario', JSON.stringify(usuario));
  window.dispatchEvent(new Event(EVENTO_SESION));
};

// Cierra la sesión: borra el usuario guardado y avisa a toda la app.
export const cerrarSesion = () => {
  localStorage.removeItem('usuario');
  window.dispatchEvent(new Event(EVENTO_SESION));
};