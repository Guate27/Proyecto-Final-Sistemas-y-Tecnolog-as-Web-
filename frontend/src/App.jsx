import { useState, useEffect, useRef, useCallback } from 'react'
import { useStorage } from './context/StorageProvider'
import { useTema } from './context/ThemeContext'
import FormularioJuego from './components/FormularioJuego'
import ListaJuegos from './components/ListaJuegos'

function App() {
  const { obtenerItems, guardarItem, eliminarItem, cargando, error } = useStorage()
  const { tema, toggleTema } = useTema()
  const [juegos, setJuegos] = useState([])

  // useRef para enfocar el input después de agregar un juego
  const inputRef = useRef(null)

  // Carga los juegos al montar el componente
  useEffect(() => {
    async function cargarJuegos() {
      const data = await obtenerItems()
      setJuegos(data)
    }
    cargarJuegos()
  }, [obtenerItems])

  // Agrega un juego nuevo al sistema
  const agregarJuego = useCallback(async (nuevoJuego) => {
    await guardarItem(nuevoJuego)
    const data = await obtenerItems()
    setJuegos(data)
    // Enfoca el input después de agregar
    inputRef.current?.focus()
  }, [guardarItem, obtenerItems])

  // Archiva un juego (activo = false)
  const eliminarJuego = useCallback(async (id) => {
    await eliminarItem(id)
    const data = await obtenerItems()
    setJuegos(data)
  }, [eliminarItem, obtenerItems])

  // Cambia el estado de un juego (pendiente, jugando, completado, abandonado)
  const cambiarEstado = useCallback((id, nuevoEstado) => {
    setJuegos(juegosAnteriores =>
      juegosAnteriores.map(j =>
        j.id === id ? { ...j, estado: nuevoEstado } : j
      )
    )
  }, [])

  // Atajo de teclado Ctrl+N para enfocar el input de agregar
  useEffect(() => {
    function manejarAtajo(e) {
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault()
        inputRef.current?.focus()
      }
      // Atajo T para cambiar tema
      if (e.key === 't' || e.key === 'T') {
        const enInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)
        if (!enInput) toggleTema()
      }
    }
    window.addEventListener('keydown', manejarAtajo)
    // Cleanup: remueve el listener cuando el componente se desmonta
    return () => window.removeEventListener('keydown', manejarAtajo)
  }, [toggleTema])

  const juegosActivos = juegos.filter(j => j.activo)

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>

      {/* Encabezado con botón de tema */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0 }}>🎮 Mi Backlog Personal</h1>
        <button
          onClick={toggleTema}
          style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--color-borde)', background: 'var(--color-superficie)', color: 'var(--color-texto)', cursor: 'pointer' }}
        >
          {tema === 'claro' ? '🌙 Oscuro' : '☀️ Claro'}
        </button>
      </div>

      {/* Mensaje de error si algo falla */}
      {error && (
        <div style={{ background: 'var(--color-peligro)', color: 'white', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Mensaje de carga */}
      {cargando && <p style={{ color: 'var(--color-texto-secundario)' }}>Cargando...</p>}

      <FormularioJuego onAgregar={agregarJuego} inputRef={inputRef} />

      <ListaJuegos
        juegos={juegosActivos}
        onEliminar={eliminarJuego}
        onCambiarEstado={cambiarEstado}
      />

    </div>
  )
}

export default App