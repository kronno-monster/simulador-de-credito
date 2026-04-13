const router = require('express').Router()
const { verificarToken, soloAdmin } = require('../middleware/auth')
const { reporteSolicitudes, actualizarEstadoSolicitud } = require('../controllers/admin.controller')

router.use(verificarToken, soloAdmin)
router.get('/reporte',         reporteSolicitudes)
router.put('/solicitudes/:id', actualizarEstadoSolicitud)

module.exports = router
