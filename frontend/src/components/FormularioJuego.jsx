import { useState } from 'react'
import { CATEGORIAS } from '../utils/categorias'
import { crearJuego } from '../utils/juegos'

function FormularioJuego({ onAgregar }) {
  // Cada campo del formulario tiene su propio estado incial
  const [nombre, setNombre] = useState('')
  const [categoriaId, setCategoriaId] = useState('rpg')
  const [plataforma, setPlataforma] = useState('')
  const [genero, setGenero] = useState('')

  function manejarEnvio(e) {
    e.preventDefault() // evita que la página se recargue al enviar el formulario

    // Validación básica
    if (nombre.trim().length < 3) {
      alert('El nombre debe tener al menos 3 caracteres')
      return
    }

    // Creamos el juego con la función crearJuego
    const nuevoJuego = crearJuego({ nombre, categoriaId, plataforma, genero })

    // Avisamos al componente padre que hay un juego nuevo
    onAgregar(nuevoJuego)

    // Limpiamos el formulario
    setNombre('')
    setPlataforma('')
    setGenero('')
    setCategoriaId('rpg')
  }

  return (
    <form onSubmit={manejarEnvio} style={{ marginBottom: '24px', padding: '16px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>➕ Agregar Juego</h2>

      <div style={{ marginBottom: '12px' }}>
        <label>Nombre del juego: </label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej: The Witcher 3"
          style={{ marginLeft: '8px', padding: '4px 8px' }}
        />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label>Categoría: </label>
        <select
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value)}
          style={{ marginLeft: '8px', padding: '4px 8px' }}
        >
          {CATEGORIAS.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.emoji} {cat.nombre}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label>Plataforma: </label>
        <input
          type="text"
          value={plataforma}
          onChange={(e) => setPlataforma(e.target.value)}
          placeholder="Ej: PC, PS5, Switch"
          style={{ marginLeft: '8px', padding: '4px 8px' }}
        />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label>Género: </label>
        <input
          type="text"
          value={genero}
          onChange={(e) => setGenero(e.target.value)}
          placeholder="Ej: RPG, Acción"
          style={{ marginLeft: '8px', padding: '4px 8px' }}
        />
      </div>

      <button type="submit" style={{ padding: '8px 16px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        🎮 Agregar al Backlog
      </button>
    </form>
  )
}

export default FormularioJuego