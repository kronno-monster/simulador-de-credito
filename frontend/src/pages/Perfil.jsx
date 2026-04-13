import { useState, useEffect } from 'react'
import { obtenerPerfil } from '../services/api'
import { useNotification } from '../context/NotificationContext'
import axios from 'axios'

export default function Perfil() {
  const [perfil, setPerfil] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [form, setForm] = useState({})
  const { exito, error: notifError } = useNotification()

  useEffect(() => {
    obtenerPerfil()
      .then(res => {
        setPerfil(res.data)
        setForm({
          ingresos_mensuales: res.data.ingresos_mensuales,
          deudas_actuales: res.data.deudas_actuales,
          historial_pago_score: res.data.historial_pago_score,
          telefono: res.data.telefono || '',
        })
      })
      .catch(() => notifError('No se pudo cargar el perfil'))
      .finally(() => setCargando(false))
  }, [])

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const guardar = async (e) => {
    e.preventDefault()
    setGuardando(true)
    try {
      const token = localStorage.getItem('token')
      await axios.patch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/auth/perfil`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      exito('Perfil actualizado correctamente')
    } catch {
      notifError('Error al guardar los cambios')
    } finally {
      setGuardando(false)
    }
  }

  if (cargando) return <p style={{ textAlign: 'center', marginTop: 60, color: '#8A9CC4' }}>Cargando...</p>

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '32px 16px' }}>
      <h2 style={{ marginBottom: 4 }}>Mi perfil</h2>
      <p style={{ color: '#8A9CC4', fontSize: 14, marginBottom: 24 }}>
        {perfil?.nombre_completo} · {perfil?.roles?.nombre}
      </p>

      <form onSubmit={guardar}>
        <div className="card" style={{ marginBottom: 16 }}>
          <p style={{ color: '#D4A843', fontWeight: 600, marginBottom: 16 }}>💰 Información financiera</p>

          <label>Ingresos mensuales ($)</label>
          <input className="input" name="ingresos_mensuales" type="number"
            value={form.ingresos_mensuales} onChange={set} required />

          <label>Deudas actuales ($)</label>
          <input className="input" name="deudas_actuales" type="number"
            value={form.deudas_actuales} onChange={set} />

          <label>Score historial de pagos (0–100)</label>
          <input className="input" name="historial_pago_score" type="number"
            min="0" max="100" value={form.historial_pago_score} onChange={set} />

          <label>Teléfono</label>
          <input className="input" name="telefono" type="tel"
            value={form.telefono} onChange={set} placeholder="Ej: 3001234567" />
        </div>

        <button className="btn-primary" type="submit" disabled={guardando}>
          {guardando ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  )
}
