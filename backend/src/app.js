const express = require('express')
const cors    = require('cors')
require('dotenv').config()

const app = express()
const logger = require('./middleware/logger')

const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(logger)

app.use('/api/auth',        require('./routes/auth.routes'))
app.use('/api/productos',   require('./routes/productos.routes'))
app.use('/api/solicitudes', require('./routes/solicitudes.routes'))
app.use('/api/admin',       require('./routes/admin.routes'))

app.get('/', (req, res) => {
  res.json({ mensaje: 'API Simulador de Créditos funcionando ✓', version: '1.0' })
})

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() })
})

app.use((req, res) => {
  res.status(404).json({ error: `Ruta ${req.method} ${req.path} no encontrada` })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Error interno del servidor', detalle: err.message })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`))
