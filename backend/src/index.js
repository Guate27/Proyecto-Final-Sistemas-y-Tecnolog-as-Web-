// backend/src/index.js
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const itemsRouter = require('./routes/items')

const app = express()
const PORT = process.env.PORT || 3001

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
}))
app.use(express.json())

// Rutas
app.use('/api/items', itemsRouter)

// Ruta de verificación de funcionamiento del servidor
app.get('/health', (req, res) => {
  res.json({ status: 'ok', mensaje: 'Backend de Mi Backlog Personal funcionando' })
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`)
})