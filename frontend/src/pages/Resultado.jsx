import { useLocation, useNavigate } from 'react-router-dom'
import { formatCOP, colorEstado } from '../utils/formatters'

const ETIQUETAS = { aprobado: '✅ Crédito Aprobado', condicionado: '⏳ Aprobado con Condiciones', rechazado: '❌ Crédito Rechazado' }

export default function Resultado() {
  const { state } = useLocation()
  const navigate  = useNavigate()

  if (!state?.resultado) { navigate('/'); return null }

  const { solicitud, scoring } = state.resultado
  const color = colorEstado(solicitud.estado)

  const fila = (label, valor) => (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      padding: '10px 0', borderBottom: '1px solid #2A3858'
    }}>
      <span style={{ color: '#8A9CC4', fontSize: 14 }}>{label}</span>
      <span style={{ fontWeight: 600 }}>{valor}</span>
    </div>
  )

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '32px 16px' }}>

      {/* Score principal */}
      <div className="card" style={{ textAlign: 'center', marginBottom: 16, borderColor: color }}>
        <p style={{ fontSize: 52, fontWeight: 700, color, marginBottom: 4 }}>
          {scoring.score}
          <span style={{ fontSize: 20, color: '#8A9CC4' }}>/100</span>
        </p>
        <h2 style={{ color, fontSize: 22, marginBottom: 8 }}>
          {ETIQUETAS[solicitud.estado]}
        </h2>
        <p style={{ color: '#8A9CC4', fontSize: 13 }}>{solicitud.justificacion}</p>
      </div>

      {/* Detalle financiero */}
      <div className="card" style={{ marginBottom: 16 }}>
        <p style={{ color: '#D4A843', fontWeight: 600, marginBottom: 12 }}>💰 Detalle financiero</p>
        {fila('Monto solicitado', formatCOP(solicitud.monto_solicitado))}
        {fila('Plazo', solicitud.plazo_meses + ' meses')}
        {fila('Cuota mensual', formatCOP(scoring.cuotaCalculada))}
        {fila('Total a pagar', formatCOP(scoring.totalAPagar))}
        {fila('Total intereses', formatCOP(scoring.totalIntereses))}
      </div>

      {/* Reglas aplicadas */}
      {scoring.reglas?.length > 0 && (
        <div className="card" style={{ marginBottom: 16 }}>
          <p style={{ color: '#D4A843', fontWeight: 600, marginBottom: 12 }}>📊 Análisis de riesgo</p>
          {scoring.reglas.map((r, i) => (
            <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid #2A3858', fontSize: 13 }}>
              <span style={{ color: r.tipo === 'penalizacion' ? '#F05252' : '#22C97B' }}>
                {r.tipo === 'penalizacion' ? '▼' : '▲'} {r.puntos > 0 ? '+' : ''}{r.puntos} pts
              </span>
              <span style={{ color: '#8A9CC4', marginLeft: 8 }}>{r.detalle}</span>
            </div>
          ))}
        </div>
      )}

      <button className="btn-primary" onClick={() => navigate('/historial')}>
        Ver mis solicitudes →
      </button>
      <button className="btn-secondary" onClick={() => navigate('/')}>
        Nueva solicitud
      </button>
    </div>
  )
}
