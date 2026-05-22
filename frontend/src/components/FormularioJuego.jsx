import { useState } from 'react'
import { CATEGORIAS } from '../utils/categorias'
import { crearJuego } from '../utils/juegos'

function FormularioJuego({ onAgregar, inputRef }) {
  const [nombre, setNombre] = useState('')
  const [categoriaId, setCategoriaId] = useState('rpg')
  const [plataforma, setPlataforma] = useState('')
  const [genero, setGenero] = useState('')

  function manejarEnvio(e) {
    e.preventDefault()

    if (nombre.trim().length < 3) {
      alert('El nombre debe tener al menos 3 caracteres')
      return
    }

    const nuevoJuego = crearJuego({ nombre, categoriaId, plataforma, genero })
    onAgregar(nuevoJuego)

    // Limpia el formulario después de agregar
    setNombre('')
    setPlataforma('')
    setGenero('')
    setCategoriaId('rpg')
  }

  return (
    <form
      onSubmit={manejarEnvio}
      style={{ marginBottom: '24px', padding: '16px', border: '1px solid var(--color-borde)', borderRadius: '8px', background: 'var(--color-superficie)' }}
    >
      <h2 style={{ margin: '0 0 16px', color: 'var(--color-texto)' }}>➕ Agregar Juego</h2>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ color: 'var(--color-texto)' }}>Nombre del juego: </label>
        <input
          ref={inputRef}
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej: The Witcher 3"
          style={{ marginLeft: '8px', padding: '4px 8px', background: 'var(--color-fondo)', color: 'var(--color-texto)', border: '1px solid var(--color-borde)', borderRadius: '4px' }}
        />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ color: 'var(--color-texto)' }}>Categoría: </label>
        <select
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value)}
          style={{ marginLeft: '8px', padding: '4px 8px', background: 'var(--color-fondo)', color: 'var(--color-texto)', border: '1px solid var(--color-borde)', borderRadius: '4px' }}
        >
          {CATEGORIAS.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.emoji} {cat.nombre}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ color: 'var(--color-texto)' }}>Plataforma: </label>
        <input
          type="text"
          value={plataforma}
          onChange={(e) => setPlataforma(e.target.value)}
          placeholder="Ej: PC, PS5, Switch"
          style={{ marginLeft: '8px', padding: '4px 8px', background: 'var(--color-fondo)', color: 'var(--color-texto)', border: '1px solid var(--color-borde)', borderRadius: '4px' }}
        />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ color: 'var(--color-texto)' }}>Género: </label>
        <input
          type="text"
          value={genero}
          onChange={(e) => setGenero(e.target.value)}
          placeholder="Ej: RPG, Acción"
          style={{ marginLeft: '8px', padding: '4px 8px', background: 'var(--color-fondo)', color: 'var(--color-texto)', border: '1px solid var(--color-borde)', borderRadius: '4px' }}
        />
      </div>

      <button
        type="submit"
        style={{ padding: '8px 16px', background: 'var(--color-acento)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        🎮 Agregar al Backlog
      </button>
    </form>
  )
}

export default FormularioJuego