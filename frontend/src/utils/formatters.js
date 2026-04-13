/**
 * Formatea un número como moneda colombiana
 */
export const formatCOP = (valor) =>
  `$${Number(valor || 0).toLocaleString('es-CO')}`

/**
 * Formatea una fecha ISO a formato local colombiano
 */
export const formatFecha = (isoString) =>
  isoString ? new Date(isoString).toLocaleDateString('es-CO') : '—'

/**
 * Retorna el color según el estado de una solicitud
 */
export const colorEstado = (estado) => ({
  aprobado:    '#22C97B',
  condicionado: '#F0A025',
  rechazado:   '#F05252',
}[estado] ?? '#8A9CC4')

/**
 * Retorna el emoji según el nivel de riesgo
 */
export const emojiRiesgo = (nivel) => ({
  bajo:     '🟢',
  medio:    '🟡',
  alto:     '🟠',
  muy_alto: '🔴',
}[nivel] ?? '⚪')
