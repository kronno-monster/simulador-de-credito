const router = require('express').Router()
const { verificarToken } = require('../middleware/auth')
const { registro, login, obtenerPerfil, actualizarPerfil } = require('../controllers/auth.controller')
const { validarRegistro, validarLogin } = require('../middleware/validation')

router.post('/registro', validarRegistro, registro)
router.post('/login',    validarLogin, login)
router.get('/perfil',    verificarToken, obtenerPerfil)
router.patch('/perfil',  verificarToken, actualizarPerfil)

module.exports = router
