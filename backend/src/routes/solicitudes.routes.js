const router = require('express').Router()
const { verificarToken } = require('../middleware/auth')
const { crearSolicitud, obtenerMisSolicitudes, obtenerDetalleSolicitud } = require('../controllers/solicitudes.controller')
const { validarSolicitud } = require('../middleware/validation')

router.use(verificarToken)
router.post('/',   validarSolicitud, crearSolicitud)
router.get('/',    obtenerMisSolicitudes)
router.get('/:id', obtenerDetalleSolicitud)

module.exports = router
