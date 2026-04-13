const supabase = require('../config/supabase')
const { calcularScoring, generarAmortizacion, generarEscenarios } = require('../services/credito.service')

const crearSolicitud = async (req, res) => {
  try {
    const { producto_id, monto_solicitado, plazo_meses } = req.body
    const usuario_id = req.user.id

    if (!producto_id || !monto_solicitado || !plazo_meses)
      return res.status(400).json({ error: 'producto_id, monto_solicitado y plazo_meses son requeridos' })

    const [{ data: producto, error: errProd }, { data: usuario, error: errUser }] = await Promise.all([
      supabase.from('productos_credito').select('*').eq('id', producto_id).single(),
      supabase.from('usuarios').select('*').eq('id', usuario_id).single()
    ])

    if (errProd || !producto) return res.status(404).json({ error: 'Producto no encontrado' })
    if (errUser || !usuario) return res.status(404).json({ error: 'Perfil de usuario no encontrado' })
    if (!producto.activo) return res.status(400).json({ error: 'Producto no disponible' })

    if (monto_solicitado < producto.monto_min || monto_solicitado > producto.monto_max)
      return res.status(400).json({
        error: `Monto debe estar entre $${Number(producto.monto_min).toLocaleString('es-CO')} y $${Number(producto.monto_max).toLocaleString('es-CO')}`
      })

    if (plazo_meses < producto.plazo_min_meses || plazo_meses > producto.plazo_max_meses)
      return res.status(400).json({
        error: `Plazo debe estar entre ${producto.plazo_min_meses} y ${producto.plazo_max_meses} meses`
      })

    const scoring = calcularScoring(usuario, monto_solicitado, plazo_meses, producto.tasa_interes_anual)

    const { data: solicitud, error: errSol } = await supabase
      .from('solicitudes_credito')
      .insert({
        usuario_id, producto_id, monto_solicitado, plazo_meses,
        estado: scoring.estado,
        score_riesgo: scoring.score,
        nivel_riesgo: scoring.nivel,
        justificacion: scoring.justificacion
      })
      .select().single()
    if (errSol) throw errSol

    await supabase.from('analisis_riesgo').insert({
      solicitud_id: solicitud.id,
      capacidad_pago: scoring.capacidadPago,
      relacion_deuda_ingreso: scoring.relacionDeudaIngreso,
      puntuacion_historial: usuario.historial_pago_score,
      cuota_calculada: scoring.cuotaCalculada,
      total_a_pagar: scoring.totalAPagar,
      total_intereses: scoring.totalIntereses,
      tasa_mensual: scoring.tasaMensual,
      reglas_aplicadas: scoring.reglas
    })

    const amortizacion = generarAmortizacion(monto_solicitado, producto.tasa_interes_anual, plazo_meses)
    await supabase.from('tabla_amortizacion')
      .insert(amortizacion.map(f => ({ ...f, solicitud_id: solicitud.id })))

    const escenarios = generarEscenarios(monto_solicitado, producto.tasa_interes_anual, plazo_meses)
    await supabase.from('escenarios_comparativos')
      .insert(escenarios.map(e => ({ ...e, solicitud_id: solicitud.id })))

    res.status(201).json({
      solicitud,
      scoring,
      amortizacion_preview: amortizacion.slice(0, 3)
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const obtenerMisSolicitudes = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('solicitudes_credito')
      .select(`
        id, monto_solicitado, plazo_meses, estado,
        score_riesgo, nivel_riesgo, created_at,
        productos_credito(nombre, tipo),
        analisis_riesgo(cuota_calculada, total_intereses)
      `)
      .eq('usuario_id', req.user.id)
      .order('created_at', { ascending: false })
    if (error) throw error
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const obtenerDetalleSolicitud = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('solicitudes_credito')
      .select(`
        *,
        productos_credito(*),
        analisis_riesgo(*),
        tabla_amortizacion(*),
        escenarios_comparativos(*)
      `)
      .eq('id', req.params.id)
      .eq('usuario_id', req.user.id)
      .single()
    if (error) return res.status(404).json({ error: 'Solicitud no encontrada' })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { crearSolicitud, obtenerMisSolicitudes, obtenerDetalleSolicitud }
