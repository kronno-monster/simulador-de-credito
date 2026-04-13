const supabase = require('../config/supabase')

const reporteSolicitudes = async (req, res) => {
  try {
    const { estado, nivel_riesgo, desde, hasta } = req.query

    let query = supabase
      .from('solicitudes_credito')
      .select(`
        *,
        usuarios(nombre_completo, ingresos_mensuales),
        productos_credito(nombre, tipo),
        analisis_riesgo(cuota_calculada, total_intereses, relacion_deuda_ingreso)
      `)
      .order('created_at', { ascending: false })

    if (estado)       query = query.eq('estado', estado)
    if (nivel_riesgo) query = query.eq('nivel_riesgo', nivel_riesgo)
    if (desde)        query = query.gte('created_at', desde)
    if (hasta)        query = query.lte('created_at', hasta)

    const { data, error } = await query
    if (error) throw error

    const stats = {
      total_solicitudes: data.length,
      aprobadas:    data.filter(s => s.estado === 'aprobado').length,
      rechazadas:   data.filter(s => s.estado === 'rechazado').length,
      condicionadas: data.filter(s => s.estado === 'condicionado').length,
      monto_total:  data.reduce((acc, s) => acc + Number(s.monto_solicitado), 0),
      score_promedio: data.length
        ? parseFloat((data.reduce((acc, s) => acc + Number(s.score_riesgo), 0) / data.length).toFixed(1))
        : 0
    }

    res.json({ stats, solicitudes: data })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const actualizarEstadoSolicitud = async (req, res) => {
  try {
    const { id } = req.params
    const { estado } = req.body

    const estadosValidos = ['aprobado', 'rechazado', 'condicionado', 'pendiente']
    if (!estadosValidos.includes(estado))
      return res.status(400).json({ error: 'Estado inválido' })

    const { data, error } = await supabase
      .from('solicitudes_credito')
      .update({ estado, updated_at: new Date() })
      .eq('id', id)
      .select().single()
    if (error) throw error
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { reporteSolicitudes, actualizarEstadoSolicitud }
