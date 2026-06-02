import { useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

// Componente del perfil del usuario que muestra un saludo dinámico
// El nombre se guarda en LocalStorage usando el hook useLocalStorage
function PerfilUsuario() {

  // Nombre del usuario guardado entre sesiones
  const [nombre, setNombre] = useLocalStorage('nombreUsuario', '')

  // Controla si el campo de edición está visible o no
  const [editando, setEditando] = useState(false)

  // Valor temporal del input mientras se edita
  const [valorTemp, setValorTemp] = useState(nombre)

  // Guarda el nombre nuevo y cierra el modo edición
  function guardarNombre() {
    setNombre(valorTemp.trim())
    setEditando(false)
  }

  // Selecciona el saludo según la hora del día
  function obtenerSaludo() {
    const hora = new Date().getHours()
    if (hora < 12) return 'Buenos días'
    if (hora < 19) return 'Buenas tardes'
    return 'Buenas noches'
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 12px',
      background: 'var(--color-superficie)',
      border: '1px solid var(--color-borde)',
      borderRadius: '8px',
    }}>

      {/* Vista normal: muestra el saludo con el nombre del usuario */}
      {!editando && (
        <>
          <span style={{ fontSize: '14px', color: 'var(--color-texto)' }}>
            👋 {obtenerSaludo()}, <strong>{nombre || 'jugador anónimo'}</strong>
          </span>
          <button
            onClick={() => { setValorTemp(nombre); setEditando(true) }}
            style={{
              padding: '2px 8px',
              fontSize: '12px',
              background: 'transparent',
              color: 'var(--color-acento)',
              border: '1px solid var(--color-borde)',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            ✏️
          </button>
        </>
      )}

      {/* Modo edición: muestra el input y los botones de acción */}
      {editando && (
        <>
          <input
            type="text"
            value={valorTemp}
            onChange={(e) => setValorTemp(e.target.value)}
            placeholder="Tu nombre"
            autoFocus
            onKeyDown={(e) => { if (e.key === 'Enter') guardarNombre() }}
            style={{
              padding: '4px 8px',
              background: 'var(--color-fondo)',
              color: 'var(--color-texto)',
              border: '1px solid var(--color-borde)',
              borderRadius: '4px',
              width: '140px',
            }}
          />
          <button
            onClick={guardarNombre}
            style={{
              padding: '4px 8px',
              fontSize: '12px',
              background: 'var(--color-acento)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            ✓
          </button>
        </>
      )}

    </div>
  )
}

export default PerfilUsuario