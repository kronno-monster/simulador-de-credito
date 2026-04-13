const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validarRegistro = (req, res, next) => {
  const { email, password, nombre_completo, ingresos_mensuales } = req.body
  if (!email || !emailRegex.test(email))
    return res.status(400).json({ error: 'Email inválido' })
  if (!password || password.length < 6)
    return res.status(400).json({ error: 'La contraseña debe tener mínimo 6 caracteres' })
  if (!nombre_completo || nombre_completo.trim().length < 2)
    return res.status(400).json({ error: 'Nombre completo requerido' })
  if (!ingresos_mensuales || Number(ingresos_mensuales) <= 0)
    return res.status(400).json({ error: 'Los ingresos deben ser mayores a 0' })
  next()
}

const validarLogin = (req, res, next) => {
  const { email, password } = req.body
  if (!email || !emailRegex.test(email))
    return res.status(400).json({ error: 'Email inválido' })
  if (!password)
    return res.status(400).json({ error: 'Contraseña requerida' })
  next()
}

const validarSolicitud = (req, res, next) => {
  const { producto_id, monto_solicitado, plazo_meses } = req.body
  if (!producto_id || isNaN(Number(producto_id)))
    return res.status(400).json({ error: 'producto_id inválido' })
  if (!monto_solicitado || Number(monto_solicitado) <= 0)
    return res.status(400).json({ error: 'Monto debe ser mayor a 0' })
  if (!plazo_meses || Number(plazo_meses) < 1)
    return res.status(400).json({ error: 'Plazo inválido' })
  next()
}

module.exports = { validarRegistro, validarLogin, validarSolicitud }
