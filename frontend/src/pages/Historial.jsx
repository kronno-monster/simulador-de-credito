import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { obtenerMisSolicitudes } from '../services/api'

const COLORES = { aprobado: '#22C97B', condicionado: '#F0A025', rechazado: '#F05252' }

export default function Historial() {
  const [solicitudes, setSolicitudes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    obtenerMisSolicitudes()
      .then(res => setSolicitudes(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError('No se pudo cargar el historial'))
      .finally(() => setCargando(false))
  }, [])

  if (cargando) return (
    <p style={{ textAlign: 'center', marginTop: 60, color: '#8A9CC4' }}>Cargando...</p>
  )

  if (error) return (
    <div style={{ maxWidth: 560, margin: '60px auto', padding: '0 16px', textAlign: 'center' }}>
      <div className="card">
        <p style={{ color: '#F05252', marginBottom: 8 }}>⚠️ {error}</p>
        <p style={{ color: '#8A9CC4', fontSize: 13 }}>Verifica que el backend esté corriendo en localhost:3001</p>
      </div>
      <button className="btn-secondary" style={{ marginTop: 16 }} onClick={() => navigate('/')}>
        ← Volver
      </button>
    </div>
  )

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '32px 16px' }}>
      <h2 style={{ marginBottom: 24 }}>Mis solicitudes</h2>

      {solicitudes.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: '#8A9CC4', padding: 40 }}>
          <p style={{ marginBottom: 16 }}>No tienes solicitudes aún.</p>
          <button className="btn-primary" onClick={() => navigate('/')}>
            Crear primera solicitud
          </button>
        </div>
      ) : (
        solicitudes.map(s => (
          <div key={s.id} className="card" style={{
            marginBottom: 12, display: 'flex',
            justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <p style={{ fontWeight: 600 }}>
                {s.productos_credito?.nombre ?? 'Crédito'} —
                ${Number(s.monto_solicitado).toLocaleString('es-CO')}
              </p>
              <p style={{ color: '#8A9CC4', fontSize: 13, marginTop: 4 }}>
                {s.created_at ? new Date(s.created_at).toLocaleDateString('es-CO') : ''}
                {' · '}{s.plazo_meses} meses
                {' · '}Score: {s.score_riesgo}
              </p>
              <p style={{ color: '#8A9CC4', fontSize: 12, marginTop: 2 }}>
                Cuota: ${Number(s.analisis_riesgo?.cuota_calculada ?? 0).toLocaleString('es-CO')}/mes
              </p>
            </div>
            <span style={{
              color: COLORES[s.estado] ?? '#8A9CC4',
              background: (COLORES[s.estado] ?? '#8A9CC4') + '22',
              borderRadius: 6, padding: '4px 12px',
              fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap',
            }}>
              {s.estado}
            </span>
          </div>
        ))
      )}
    </div>
  )
}
