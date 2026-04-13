const router = require('express').Router()
const { listarProductos } = require('../controllers/productos.controller')

router.get('/', listarProductos)

module.exports = router
