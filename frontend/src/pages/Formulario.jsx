import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { obtenerProductos, crearSolicitud } from '../services/api'

export default function Formulario() {
  const navigate = useNavigate()
  const [productos, setProductos] = useState([])
  const [form, setForm] = useState({ producto_id: '', monto_solicitado: '', plazo_meses: 24 })
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    obtenerProductos().then(res => setProductos(res.data)).catch(() => {})
  }, [])

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setCargando(true)
    try {
      const res = await crearSolicitud({
        producto_id:      parseInt(form.producto_id),
        monto_solicitado: parseFloat(form.monto_solicitado),
        plazo_meses:      parseInt(form.plazo_meses)
      })
      navigate('/resultado', { state: { resultado: res.data } })
    } catch (err) {
      setError(err.response?.data?.error || 'Error al procesar la solicitud')
    } finally {
      setCargando(false)
    }
  }

  const productoSeleccionado = productos.find(p => p.id === parseInt(form.producto_id))

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '32px 16px' }}>
      <h2 style={{ marginBottom: 4 }}>Nueva solicitud</h2>
      <p style={{ color: '#8A9CC4', marginBottom: 24, fontSize: 14 }}>
        Simula tu crédito y obtén una respuesta inmediata
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
        <div className="card" style={{ marginBottom: 16 }}>
          <p style={{ color: '#D4A843', fontWeight: 600, marginBottom: 16 }}>📋 Tipo de crédito</p>

          <label>Producto</label>
          <select className="input" name="producto_id" value={form.producto_id} onChange={set} required>
            <option value="">Selecciona un producto</option>
            {productos.map(p => (
              <option key={p.id} value={p.id}>
                {p.nombre} — {p.tasa_interes_anual}% anual
              </option>
            ))}
          </select>

          {productoSeleccionado && (
            <div style={{
              background: '#0B1120', borderRadius: 8,
              padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#8A9CC4'
            }}>
              <span>Monto: </span>
              <span style={{ color: '#E8EEFF' }}>
                ${Number(productoSeleccionado.monto_min).toLocaleString('es-CO')} —
                ${Number(productoSeleccionado.monto_max).toLocaleString('es-CO')}
              </span>
              <span style={{ marginLeft: 16 }}>Plazo: </span>
              <span style={{ color: '#E8EEFF' }}>
                {productoSeleccionado.plazo_min_meses} — {productoSeleccionado.plazo_max_meses} meses
              </span>
            </div>
          )}

          <label>Monto solicitado ($)</label>
          <input className="input" name="monto_solicitado" type="number"
            value={form.monto_solicitado} onChange={set} required placeholder="Ej: 10000000" />

          <label>Plazo: {form.plazo_meses} meses</label>
          <input className="input" type="range" name="plazo_meses"
            min="6" max="120" step="6"
            value={form.plazo_meses} onChange={set}
            style={{ padding: 0, cursor: 'pointer' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#8A9CC4', marginTop: -12, marginBottom: 16 }}>
            <span>6 meses</span>
            <span>120 meses</span>
          </div>
        </div>

        <button className="btn-primary" type="submit" disabled={cargando}>
          {cargando ? 'Calculando...' : 'Analizar solicitud →'}
        </button>
      </form>
    </div>
  )
}
