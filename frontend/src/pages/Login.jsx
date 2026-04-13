import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { iniciarSesion, obtenerPerfil } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(false)

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setCargando(true)
    try {
      const res = await iniciarSesion(form)
      // Guardar token primero para que el interceptor lo use
      localStorage.setItem('token', res.data.token)
      // Pedir perfil completo (incluye roles)
      const perfilRes = await obtenerPerfil()
      login(res.data.token, perfilRes.data)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '60px auto', padding: '0 16px' }}>
      <div className="card">
        <h2 style={{ marginBottom: 4 }}>Iniciar sesión</h2>
        <p style={{ color: '#8A9CC4', fontSize: 13, marginBottom: 24 }}>
          Accede a tu simulador de créditos
        </p>

        {error && (
          <div style={{
            background: '#F0525222', border: '1px solid #F05252',
            borderRadius: 8, padding: '10px 14px',
            color: '#F05252', fontSize: 13, marginBottom: 16,
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label>Correo electrónico</label>
          <input className="input" name="email" type="email"
            value={form.email} onChange={set} required placeholder="tu@email.com" />

          <label>Contraseña</label>
          <input className="input" name="password" type="password"
            value={form.password} onChange={set} required placeholder="••••••••" />

          <button className="btn-primary" type="submit" disabled={cargando}>
            {cargando ? 'Ingresando...' : 'Ingresar →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#8A9CC4' }}>
          ¿No tienes cuenta?{' '}
          <Link to="/registro" style={{ color: '#D4A843', textDecoration: 'none' }}>
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  )
}
