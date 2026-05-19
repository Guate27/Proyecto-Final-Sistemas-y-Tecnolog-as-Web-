// src/App.jsx
import { useState, useEffect } from 'react'
import FormularioJuego from './components/FormularioJuego'
import ListaJuegos from './components/ListaJuegos'

function App() {

  // ====== ESTADO PRINCIPAL ======
  // useState con lazy initializer — lee localStorage UNA SOLA VEZ al arrancar
  const [juegos, setJuegos] = useState(() => {
    try {
      const guardado = localStorage.getItem('juegos')
      return guardado ? JSON.parse(guardado) : []
    } catch {
      return []
    }
  })

  // ====== SINCRONIZACIÓN CON LOCALSTORAGE ======
  // Cada vez que la lista de juegos cambie, la guardamos en localStorage
  useEffect(() => {
    localStorage.setItem('juegos', JSON.stringify(juegos))
  }, [juegos])

  // ====== FUNCIONES CRUD ======

  // CREAR — agrega un juego nuevo a la lista
  function agregarJuego(nuevoJuego) {
    setJuegos(juegosAnteriores => [...juegosAnteriores, nuevoJuego])
  }

  // ELIMINAR — marca el juego como inactivo (no lo borra, lo archiva)
  function eliminarJuego(id) {
    setJuegos(juegosAnteriores =>
      juegosAnteriores.map(j =>
        j.id === id ? { ...j, activo: false } : j
      )
    )
  }

  // ACTUALIZAR — cambia el estado de un juego (pendiente, jugando, etc.)
  function cambiarEstado(id, nuevoEstado) {
    setJuegos(juegosAnteriores =>
      juegosAnteriores.map(j =>
        j.id === id ? { ...j, estado: nuevoEstado, fechaActividad: new Date().toISOString() } : j
      )
    )
  }

  // Solo mostramos juegos activos
  const juegosActivos = juegos.filter(j => j.activo)

  // ====== INTERFAZ ======
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
      <h1>🎮 Mi Backlog Personal</h1>

      <FormularioJuego onAgregar={agregarJuego} />

      <ListaJuegos
        juegos={juegosActivos}
        onEliminar={eliminarJuego}
        onCambiarEstado={cambiarEstado}
      />
    </div>
  )
}

export default App