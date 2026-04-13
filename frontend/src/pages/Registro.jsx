import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registrarse, iniciarSesion, obtenerPerfil } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Registro() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({
    nombre_completo: '', email: '', password: '',
    ingresos_mensuales: '', deudas_actuales: '',
    historial_pago_score: 50
  })
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(false)

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setCargando(true)
    try {
      await registrarse({
        ...form,
        ingresos_mensuales:   Number(form.ingresos_mensuales),
        deudas_actuales:      Number(form.deudas_actuales),
        historial_pago_score: Number(form.historial_pago_score)
      })
      // Login automático después del registro
      const loginRes = await iniciarSesion({ email: form.email, password: form.password })
      localStorage.setItem('token', loginRes.data.token)
      const perfilRes = await obtenerPerfil()
      login(loginRes.data.token, perfilRes.data)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrarse')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', padding: '0 16px' }}>
      <div className="card">
        <h2 style={{ marginBottom: 4 }}>Crear cuenta</h2>
        <p style={{ color: '#8A9CC4', fontSize: 13, marginBottom: 24 }}>
          Completa tus datos para registrarte
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
          <label>Nombre completo</label>
          <input className="input" name="nombre_completo"
            value={form.nombre_completo} onChange={set} required placeholder="Tu nombre completo" />

          <label>Correo electrónico</label>
          <input className="input" name="email" type="email"
            value={form.email} onChange={set} required placeholder="tu@email.com" />

          <label>Contraseña</label>
          <input className="input" name="password" type="password"
            value={form.password} onChange={set} required placeholder="Mínimo 6 caracteres" />

          <label>Ingresos mensuales ($)</label>
          <input className="input" name="ingresos_mensuales" type="number"
            value={form.ingresos_mensuales} onChange={set} required placeholder="Ej: 3000000" />

          <label>Deudas mensuales actuales ($)</label>
          <input className="input" name="deudas_actuales" type="number"
            value={form.deudas_actuales} onChange={set} placeholder="Ej: 500000 (0 si no tienes)" />

          <label>Historial de pago: {form.historial_pago_score}/100</label>
          <input className="input" type="range" name="historial_pago_score"
            min="0" max="100" value={form.historial_pago_score} onChange={set}
            style={{ padding: 0, cursor: 'pointer' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#8A9CC4', marginTop: -12, marginBottom: 16 }}>
            <span>0 — Malo</span>
            <span>50 — Regular</span>
            <span>100 — Excelente</span>
          </div>

          <button className="btn-primary" type="submit" disabled={cargando}>
            {cargando ? 'Creando cuenta...' : 'Crear cuenta →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#8A9CC4' }}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" style={{ color: '#D4A843', textDecoration: 'none' }}>
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
