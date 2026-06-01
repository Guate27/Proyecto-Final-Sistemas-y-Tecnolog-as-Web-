import { useState } from 'react'
import { CATEGORIAS } from '../utils/categorias'

// Modal que permite al usuario editar los datos de un juego existente
// Recibe el juego a editar, la función para guardar cambios y la función para cerrar
function ModalEditarJuego({ juego, onGuardar, onCerrar }) {

  // Estados locales llenados previamente con los datos actuales del juego
  const [nombre, setNombre] = useState(juego.nombre)
  const [categoriaId, setCategoriaId] = useState(juego.categoriaId)
  const [plataforma, setPlataforma] = useState(juego.atributos?.plataforma || '')
  const [horas, setHoras] = useState(juego.atributos?.horasTotales || 0)
  const [imagen, setImagen] = useState(juego.imagen || '')

  // Guarda el juego con los datos editados 
  function manejarGuardar(e) {
    e.preventDefault()

    // Valida que el nombre no quede vacío o muy corto
    if (nombre.trim().length < 3) {
      alert('El nombre debe tener al menos 3 caracteres')
      return
    }

    // Valida que las horas no sean negativas
    if (horas < 0) {
      alert('Las horas jugadas no pueden ser negativas')
      return
    }

    // Construye un oobjeto con la información del juego actualizado conservando los campos no editables
    const juegoActualizado = {
      ...juego,
      nombre: nombre.trim(),
      categoriaId,
      imagen: imagen.trim(),
      atributos: {
        ...juego.atributos,
        plataforma,
        horasTotales: Number(horas),
      },
      fechaActividad: new Date().toISOString(),
    }

    onGuardar(juegoActualizado)
    onCerrar()
  }

  return (
    // Fondo oscuro que cubre toda la pantalla
    <div
      onClick={onCerrar}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      {/* Ventana del modal con stopPropagation para que no se cierre al hacer clic dentro */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--color-superficie)',
          color: 'var(--color-texto)',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid var(--color-borde)',
          width: '90%',
          maxWidth: '450px',
        }}
      >
        <h2 style={{ margin: '0 0 16px' }}>✏️ Editar Juego</h2>

        <form onSubmit={manejarGuardar}>

          {/* Campo: nombre del juego */}
          <div style={{ marginBottom: '12px' }}>
            <label>Nombre del juego: </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              style={{ width: '100%', padding: '6px 8px', background: 'var(--color-fondo)', color: 'var(--color-texto)', border: '1px solid var(--color-borde)', borderRadius: '4px', marginTop: '4px' }}
            />
          </div>

          {/* Campo: categoría del juego */}
          <div style={{ marginBottom: '12px' }}>
            <label>Categoría: </label>
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              style={{ width: '100%', padding: '6px 8px', background: 'var(--color-fondo)', color: 'var(--color-texto)', border: '1px solid var(--color-borde)', borderRadius: '4px', marginTop: '4px' }}
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
            <label>Plataforma: </label>
            <input
              type="text"
              value={plataforma}
              onChange={(e) => setPlataforma(e.target.value)}
              placeholder="Ej: PC, PS5, Switch"
              style={{ width: '100%', padding: '6px 8px', background: 'var(--color-fondo)', color: 'var(--color-texto)', border: '1px solid var(--color-borde)', borderRadius: '4px', marginTop: '4px' }}
            />
          </div>

          {/* Campo: horas jugadas */}
          <div style={{ marginBottom: '20px' }}>
            <label>Horas jugadas: </label>
            <input
              type="number"
              min="0"
              value={horas}
              onChange={(e) => setHoras(e.target.value)}
              style={{ width: '100%', padding: '6px 8px', background: 'var(--color-fondo)', color: 'var(--color-texto)', border: '1px solid var(--color-borde)', borderRadius: '4px', marginTop: '4px' }}
            />
          </div>
          {/* Campo: URL de la imagen del juego */}
          <div style={{ marginBottom: '20px' }}>
            <label>URL de la imagen: </label>
            <input
              type="url"
              value={imagen}
              onChange={(e) => setImagen(e.target.value)}
              placeholder="https://ejemplo.com/imagen.jpg"
              style={{ width: '100%', padding: '6px 8px', background: 'var(--color-fondo)', color: 'var(--color-texto)', border: '1px solid var(--color-borde)', borderRadius: '4px', marginTop: '4px' }}
            />
          </div>

          {/* Botones de acción */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button
              type="button"
              onClick={onCerrar}
              style={{ padding: '8px 16px', background: 'var(--color-fondo)', color: 'var(--color-texto)', border: '1px solid var(--color-borde)', borderRadius: '4px', cursor: 'pointer' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{ padding: '8px 16px', background: 'var(--color-acento)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              💾 Guardar cambios
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default ModalEditarJuego