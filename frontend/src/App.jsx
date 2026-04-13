import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar     from './components/Navbar'
import Formulario from './pages/Formulario'
import Resultado  from './pages/Resultado'
import Historial  from './pages/Historial'
import Login      from './pages/Login'
import Registro   from './pages/Registro'
import Admin      from './pages/Admin'

function RutaPrivada({ children }) {
  const { estaLogueado } = useAuth()
  return estaLogueado ? children : <Navigate to="/login" />
}

function RutaAdmin({ children }) {
  const { estaLogueado, usuario } = useAuth()
  if (!estaLogueado) return <Navigate to="/login" />
  if (usuario?.roles?.nombre !== 'admin') return <Navigate to="/" />
  return children
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login"    element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/" element={
          <RutaPrivada><Formulario /></RutaPrivada>
        } />
        <Route path="/resultado" element={
          <RutaPrivada><Resultado /></RutaPrivada>
        } />
        <Route path="/historial" element={
          <RutaPrivada><Historial /></RutaPrivada>
        } />
        <Route path="/admin" element={
          <RutaAdmin><Admin /></RutaAdmin>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
