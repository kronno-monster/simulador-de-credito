import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { obtenerReporteAdmin, actualizarEstado } from '../services/api'

const COLORES = { aprobado: '#22C97B', condicionado: '#F0A025', rechazado: '#F05252' }

export default function Admin() {
  const [solicitudes, setSolicitudes] = useState([])
  const [stats, setStats]             = useState(null)
  const [cargando, setCargando]       = useState(true)
  const [error, setError]             = useState(null)
  const [filtro, setFiltro]           = useState('todos')
  const [procesando, setProcesando]   = useState(null)
  const navigate = useNavigate()

  const cargar = () => {
    setCargando(true)
    obtenerReporteAdmin()
      .then(res => {
        setSolicitudes(res.data.solicitudes || [])
        setStats(res.data.stats)
      })
      .catch(() => setError('No se pudieron cargar las solicitudes'))
      .finally(() => setCargando(false))
  }

  useEffect(() => { cargar() }, [])

  const cambiarEstado = async (id, nuevoEstado) => {
    setProcesando(id)
    try {
      await actualizarEstado(id, nuevoEstado)
      setSolicitudes(prev => prev.map(s => s.id === id ? { ...s, estado: nuevoEstado } : s))
    } catch {
      alert('Error al actualizar el estado')
    } finally {
      setProcesando(null)
    }
  }

  const filtradas = filtro === 'todos'
    ? solicitudes
    : solicitudes.filter(s => s.estado === filtro)

  if (cargando) return (
    <p style={{ textAlign: 'center', marginTop: 60, color: '#8A9CC4' }}>Cargando...</p>
  )

  if (error) return (
    <div style={{ maxWidth: 560, margin: '60px auto', padding: '0 16px', textAlign: 'center' }}>
      <div className="card">
        <p style={{ color: '#F05252', marginBottom: 8 }}>⚠️ {error}</p>
        <p style={{ color: '#8A9CC4', fontSize: 13 }}>Verifica que tengas permisos de administrador</p>
      </div>
      <button className="btn-secondary" style={{ marginTop: 16 }} onClick={() => navigate('/')}>
        ← Volver
      </button>
    </div>
  )

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 16px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ marginBottom: 4 }}>Panel de administrador</h2>
          <p style={{ color: '#8A9CC4', fontSize: 14 }}>Gestiona las solicitudes de crédito</p>
        </div>
        <button className="btn-secondary" style={{ width: 'auto', padding: '8px 16px' }} onClick={cargar}>
          🔄 Actualizar
        </button>
      </div>

      {/* Métricas */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Total',         valor: stats.total_solicitudes, color: '#D4A843' },
            { label: 'Aprobadas',     valor: stats.aprobadas,         color: '#22C97B' },
            { label: 'Condicionadas', valor: stats.condicionadas,     color: '#F0A025' },
            { label: 'Rechazadas',    valor: stats.rechazadas,        color: '#F05252' },
          ].map(m => (
            <div key={m.label} style={{
              background: '#19243D', border: '1px solid #2A3858',
              borderRadius: 10, padding: 16, textAlign: 'center'
            }}>
              <p style={{ fontSize: 28, fontWeight: 700, color: m.color }}>{m.valor}</p>
              <p style={{ fontSize: 12, color: '#8A9CC4', marginTop: 4 }}>{m.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {[
          { val: 'todos',       label: 'Todos' },
          { val: 'condicionado', label: '⏳ Condicionados' },
          { val: 'aprobado',    label: '✅ Aprobados' },
          { val: 'rechazado',   label: '❌ Rechazados' },
        ].map(f => (
          <button key={f.val} onClick={() => setFiltro(f.val)} style={{
            padding: '6px 16px', borderRadius: 8, cursor: 'pointer',
            fontSize: 13, border: '1px solid #2A3858',
            background: filtro === f.val ? '#D4A843' : 'transparent',
            color: filtro === f.val ? '#0B1120' : '#8A9CC4',
            transition: 'all 0.2s',
          }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Lista de solicitudes */}
      {filtradas.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: '#8A9CC4', padding: 40 }}>
          No hay solicitudes en esta categoría
        </div>
      ) : (
        filtradas.map(s => (
          <div key={s.id} className="card" style={{ marginBottom: 16 }}>

            {/* Info usuario + estado */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: 16 }}>
                  {s.usuarios?.nombre_completo ?? 'Usuario'}
                </p>
                <p style={{ color: '#8A9CC4', fontSize: 13, marginTop: 2 }}>
                  {s.productos_credito?.nombre} · ${Number(s.monto_solicitado).toLocaleString('es-CO')} · {s.plazo_meses} meses
                </p>
                <p style={{ color: '#8A9CC4', fontSize: 12, marginTop: 2 }}>
                  Score: {s.score_riesgo} · {s.created_at ? new Date(s.created_at).toLocaleDateString('es-CO') : ''}
                </p>
              </div>
              <span style={{
                color: COLORES[s.estado] ?? '#8A9CC4',
                background: (COLORES[s.estado] ?? '#8A9CC4') + '22',
                borderRadius: 6, padding: '6px 14px',
                fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap',
              }}>
                {s.estado}
              </span>
            </div>

            {/* Datos extra */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
              {[
                { label: 'Cuota mensual',   valor: `$${Number(s.analisis_riesgo?.cuota_calculada ?? 0).toLocaleString('es-CO')}` },
                { label: 'Total intereses', valor: `$${Number(s.analisis_riesgo?.total_intereses ?? 0).toLocaleString('es-CO')}` },
                { label: 'Ingreso usuario', valor: `$${Number(s.usuarios?.ingresos_mensuales ?? 0).toLocaleString('es-CO')}` },
              ].map(d => (
                <div key={d.label} style={{ background: '#0B1120', borderRadius: 8, padding: '10px 14px' }}>
                  <p style={{ fontSize: 11, color: '#8A9CC4', marginBottom: 4 }}>{d.label}</p>
                  <p style={{ fontWeight: 600 }}>{d.valor}</p>
                </div>
              ))}
            </div>

            {/* Botones de acción */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                disabled={s.estado === 'aprobado' || procesando === s.id}
                onClick={() => cambiarEstado(s.id, 'aprobado')}
                style={{
                  flex: 1, padding: 10, borderRadius: 8, border: 'none',
                  fontWeight: 600, fontSize: 14,
                  cursor: s.estado === 'aprobado' ? 'not-allowed' : 'pointer',
                  background: s.estado === 'aprobado' ? '#1A3A2A' : '#22C97B',
                  color: s.estado === 'aprobado' ? '#22C97B' : '#0B1120',
                  opacity: procesando === s.id ? 0.6 : 1,
                }}>
                {procesando === s.id ? '...' : '✅ Aprobar'}
              </button>

              <button
                disabled={s.estado === 'condicionado' || procesando === s.id}
                onClick={() => cambiarEstado(s.id, 'condicionado')}
                style={{
                  flex: 1, padding: 10, borderRadius: 8,
                  fontWeight: 600, fontSize: 14,
                  cursor: s.estado === 'condicionado' ? 'not-allowed' : 'pointer',
                  background: 'transparent',
                  border: `1px solid ${s.estado === 'condicionado' ? '#2A3858' : '#F0A025'}`,
                  color: s.estado === 'condicionado' ? '#2A3858' : '#F0A025',
                  opacity: procesando === s.id ? 0.6 : 1,
                }}>
                {procesando === s.id ? '...' : '⏳ Condicionar'}
              </button>

              <button
                disabled={s.estado === 'rechazado' || procesando === s.id}
                onClick={() => cambiarEstado(s.id, 'rechazado')}
                style={{
                  flex: 1, padding: 10, borderRadius: 8, border: 'none',
                  fontWeight: 600, fontSize: 14,
                  cursor: s.estado === 'rechazado' ? 'not-allowed' : 'pointer',
                  background: s.estado === 'rechazado' ? '#3A1A1A' : '#F05252',
                  color: s.estado === 'rechazado' ? '#F05252' : '#fff',
                  opacity: procesando === s.id ? 0.6 : 1,
                }}>
                {procesando === s.id ? '...' : '❌ Rechazar'}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
