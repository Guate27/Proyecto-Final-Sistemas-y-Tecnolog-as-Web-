import { useState } from 'react'
import { CATEGORIAS } from '../utils/categorias'
import { crearJuego } from '../utils/juegos'

// Formulario para que el usuario agregue un nuevo juego al backlog
function FormularioJuego({ onAgregar, inputRef }) {

  // Estados locales para cada campo del formulario
  const [nombre, setNombre] = useState('')
  const [categoriaId, setCategoriaId] = useState('rpg')
  const [plataforma, setPlataforma] = useState('')
  const [horas, setHoras] = useState(0)
  const [imagen, setImagen] = useState('')

  // Se ejecuta al enviar el formulario
  function manejarEnvio(e) {
    e.preventDefault()

    // Valida que el nombre tenga al menos 3 caracteres
    if (nombre.trim().length < 3) {
      alert('El nombre debe tener al menos 3 caracteres')
      return
    }

    // Valida que las horas no sean negativas
    if (horas < 0) {
      alert('Las horas jugadas no pueden ser negativas')
      return
    }

    // Crea el objeto juego con los datos del formulario
    const nuevoJuego = crearJuego({ nombre, categoriaId, plataforma, horas: Number(horas), imagen: imagen.trim() })
    onAgregar(nuevoJuego)

    // Limpia el formulario después de agregar el juego
    setNombre('')
    setPlataforma('')
    setCategoriaId('rpg')
    setHoras(0)
    setImagen('')
  }

  return (
    <form
      onSubmit={manejarEnvio}
      style={{ marginBottom: '24px', padding: '16px', border: '1px solid var(--color-borde)', borderRadius: '8px', background: 'var(--color-superficie)' }}
    >
      <h2 style={{ margin: '0 0 16px', color: 'var(--color-texto)' }}>➕ Agregar Juego</h2>

      {/* Campo: nombre del juego */}
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

      {/* Campo: categoría del juego */}
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

      {/* Campo: plataforma donde se juega */}
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

      {/* Campo: horas jugadas iniciales */}
      <div style={{ marginBottom: '12px' }}>
        <label style={{ color: 'var(--color-texto)' }}>Horas jugadas: </label>
        <input
          type="number"
          min="0"
          value={horas}
          onChange={(e) => setHoras(e.target.value)}
          placeholder="0"
          style={{ marginLeft: '8px', padding: '4px 8px', background: 'var(--color-fondo)', color: 'var(--color-texto)', border: '1px solid var(--color-borde)', borderRadius: '4px', width: '80px' }}
        />
      </div>

      {/* Campo: URL de la imagen del juego (opcional) */}
      <div style={{ marginBottom: '12px' }}>
        <label style={{ color: 'var(--color-texto)' }}>URL de la imagen: </label>
        <input
          type="url"
          value={imagen}
          onChange={(e) => setImagen(e.target.value)}
          placeholder="https://ejemplo.com/imagen.jpg"
          style={{ marginLeft: '8px', padding: '4px 8px', background: 'var(--color-fondo)', color: 'var(--color-texto)', border: '1px solid var(--color-borde)', borderRadius: '4px', width: '300px' }}
        />
      </div>

      {/* Botón para enviar el formulario */}
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