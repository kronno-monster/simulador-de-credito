export const emailValido = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export const validarRegistro = ({ email, password, nombre_completo, ingresos_mensuales }) => {
  const errores = {}
  if (!nombre_completo || nombre_completo.trim().length < 2)
    errores.nombre_completo = 'Nombre requerido (mínimo 2 caracteres)'
  if (!email || !emailValido(email))
    errores.email = 'Email inválido'
  if (!password || password.length < 6)
    errores.password = 'Mínimo 6 caracteres'
  if (!ingresos_mensuales || Number(ingresos_mensuales) <= 0)
    errores.ingresos_mensuales = 'Ingresa un valor mayor a 0'
  return errores
}

export const validarLogin = ({ email, password }) => {
  const errores = {}
  if (!email || !emailValido(email)) errores.email = 'Email inválido'
  if (!password) errores.password = 'Contraseña requerida'
  return errores
}

export const validarSolicitud = ({ producto_id, monto_solicitado, plazo_meses }) => {
  const errores = {}
  if (!producto_id) errores.producto_id = 'Selecciona un producto'
  if (!monto_solicitado || Number(monto_solicitado) <= 0)
    errores.monto_solicitado = 'Ingresa un monto válido'
  if (!plazo_meses || Number(plazo_meses) < 1)
    errores.plazo_meses = 'Plazo inválido'
  return errores
}

export const hayErrores = (errores) => Object.keys(errores).length > 0
