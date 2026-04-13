import axios from 'axios'

const API = axios.create({ baseURL: 'http://localhost:3001/api' })

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auth
export const registrarse           = (datos) => API.post('/auth/registro', datos)
export const iniciarSesion         = (datos) => API.post('/auth/login', datos)
export const obtenerPerfil         = ()       => API.get('/auth/perfil')

// Productos
export const obtenerProductos      = ()       => API.get('/productos')

// Solicitudes
export const crearSolicitud        = (datos)  => API.post('/solicitudes', datos)
export const obtenerMisSolicitudes = ()       => API.get('/solicitudes')
export const obtenerDetalle        = (id)     => API.get(`/solicitudes/${id}`)

// Admin
export const obtenerReporteAdmin   = (params) => API.get('/admin/reporte', { params })
export const actualizarEstado      = (id, estado) => API.put(`/admin/solicitudes/${id}`, { estado })
