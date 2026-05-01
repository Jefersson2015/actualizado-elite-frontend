import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// INTERCEPTOR: Adjunta datos del usuario logueado a cada petición
api.interceptors.request.use(
  (config) => {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      const userParsed = JSON.parse(usuario);
      // Enviamos el ID del usuario en un header personalizado
      config.headers['X-User-Id'] = userParsed.id;
      // Opcional: Si en el futuro usas JWT, aquí iría:
      // config.headers.Authorization = `Bearer ${userParsed.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//====== SERVICIOS =============

export const productoService = {
  listarTodos: () => api.get('/productos'),
  crear: (producto) => api.post('/productos', producto),
  eliminar: (id) => api.delete(`/productos/${id}`),
};

export const usuarioService = {
  registrar: (usuario) => api.post('/usuarios', usuario),
  login: (credentials) => api.post('/usuarios/login', credentials),
};

export const pedidoService = {
  crear: (pedido) => api.post('/pedidos', pedido),
  listarTodos: () => api.get('/pedidos'),
  buscarPorId: (id) => api.get(`/pedidos/${id}`),
};

export default api;