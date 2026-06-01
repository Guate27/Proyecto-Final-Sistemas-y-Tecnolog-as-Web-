// backend/src/routes/items.js
const express = require('express')
const router = express.Router()
const db = require('../db/database')

// GET /api/items — devuelve todos los juegos activos
router.get('/', (req, res) => {
  try {
    const rows = db.prepare(
      'SELECT * FROM items WHERE activo = 1 ORDER BY fechaRegistro ASC'
    ).all()
    res.json(rows.map(r => ({
      ...r,
      activo: Boolean(r.activo),
      atributos: JSON.parse(r.atributos || '{}'),
    })))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/items/:id — devuelve un juego por su id
router.get('/:id', (req, res) => {
  try {
    const row = db.prepare(
      'SELECT * FROM items WHERE id = ? AND activo = 1'
    ).get(req.params.id)
    if (!row) return res.status(404).json({ error: 'Juego no encontrado' })
    res.json({ ...row, activo: Boolean(row.activo), atributos: JSON.parse(row.atributos || '{}') })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/items — crea un juego nuevo
router.post('/', (req, res) => {
  const { nombre, categoriaId, estado = 'pendiente', atributos = {}, imagen = '' } = req.body
  if (!nombre || nombre.trim().length < 3)
    return res.status(400).json({ error: 'El nombre debe tener al menos 3 caracteres' })
  try {
    const nuevo = {
      id: crypto.randomUUID(),
      nombre: nombre.trim(),
      categoriaId,
      estado,
      puntuacion: null,
      fechaRegistro: new Date().toISOString(),
      fechaActividad: new Date().toISOString(),
      notas: req.body.notas || '',
      imagen,
      atributos: JSON.stringify(atributos),
      activo: 1,
    }
    db.prepare(`
      INSERT INTO items 
        (id, nombre, categoriaId, estado, puntuacion, fechaRegistro, fechaActividad, notas, imagen, atributos, activo)
      VALUES 
        (@id, @nombre, @categoriaId, @estado, @puntuacion, @fechaRegistro, @fechaActividad, @notas, @imagen, @atributos, @activo)
    `).run(nuevo)
    res.status(201).json({ ...nuevo, activo: true, atributos })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/items/:id — actualiza un juego
router.put('/:id', (req, res) => {
  const { nombre, estado, puntuacion, notas, atributos, imagen } = req.body
  try {
    const info = db.prepare(`
      UPDATE items SET
        nombre = COALESCE(@nombre, nombre),
        estado = COALESCE(@estado, estado),
        puntuacion = COALESCE(@puntuacion, puntuacion),
        notas = COALESCE(@notas, notas),
        imagen = COALESCE(@imagen, imagen),
        atributos = COALESCE(@atributos, atributos),
        fechaActividad = @fechaActividad
      WHERE id = @id
    `).run({
      id: req.params.id,
      nombre: nombre || null,
      estado: estado || null,
      puntuacion: puntuacion || null,
      notas: notas || null,
      imagen: imagen !== undefined ? imagen : null,
      atributos: atributos ? JSON.stringify(atributos) : null,
      fechaActividad: new Date().toISOString(),
    })
    if (info.changes === 0) return res.status(404).json({ error: 'Juego no encontrado' })
    res.json({ mensaje: 'Juego actualizado correctamente' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/items/:id — archiva un juego 
router.delete('/:id', (req, res) => {
  try {
    const info = db.prepare(
      'UPDATE items SET activo = 0 WHERE id = ?'
    ).run(req.params.id)
    if (info.changes === 0) return res.status(404).json({ error: 'Juego no encontrado' })
    res.json({ mensaje: 'Juego archivado correctamente' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/items/:id/registro — registra actividad diaria
router.post('/:id/registro', (req, res) => {
  const { fecha, valor, notas = '' } = req.body
  if (!valor || valor <= 0) return res.status(400).json({ error: 'El valor debe ser mayor a 0' })
  try {
    const registro = {
      id: crypto.randomUUID(),
      itemId: req.params.id,
      fecha: fecha || new Date().toISOString().split('T')[0],
      valor,
      notas,
    }
    db.prepare(`
      INSERT INTO registros (id, itemId, fecha, valor, notas)
      VALUES (@id, @itemId, @fecha, @valor, @notas)
    `).run(registro)
    res.status(201).json(registro)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router