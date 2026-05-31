import { useReducer, useEffect, useRef, useCallback, useMemo } from 'react'
import { useStorage } from './context/StorageProvider'
import { useTema } from './context/ThemeContext'
import { itemsReducer, initialState } from './reducers/itemsReducer'
import { crearJuego } from './utils/juegos'
import FormularioJuego from './components/FormularioJuego'
import ListaJuegos from './components/ListaJuegos'
import Filtros from './components/Filtros'
import Dashboard from './components/Dashboard'

function App() {
  const { obtenerItems, guardarItem, eliminarItem, cargando, error, modo, setModo } = useStorage()
  const { tema, toggleTema } = useTema()

  const [state, dispatch] = useReducer(itemsReducer, initialState)
  const { lista, filtroCategoria, filtroEstado, busqueda } = state

  const inputRef = useRef(null)
  const intervaloRef = useRef(null)
  const ultimoJuegoRef = useRef(null)

  const [tiempoSesion, setTiempoSesion] = useReducer((s) => s + 1, 0)

  useEffect(() => {
    async function cargarJuegos() {
      const data = await obtenerItems()
      dispatch({ type: 'HIDRATAR', payload: data })
    }
    cargarJuegos()
  }, [obtenerItems, modo])

  useEffect(() => {
    intervaloRef.current = setInterval(() => {
      setTiempoSesion()
    }, 1000)
    return () => clearInterval(intervaloRef.current)
  }, [])

  // Lista filtrada con useMemo — solo recalcula si cambian lista o filtros
  const listaFiltrada = useMemo(() => {
  return lista.filter(item => {
    if (!item.activo) return false
    if (filtroCategoria !== 'todas' && item.categoriaId !== filtroCategoria) return false
    if (filtroEstado !== 'todos' && item.estado !== filtroEstado) return false
    if (busqueda && !item.nombre.toLowerCase().includes(busqueda.toLowerCase())) return false
    return true
  })
  }, [lista, filtroCategoria, filtroEstado, busqueda])

  const agregarJuego = useCallback(async (nuevoJuego) => {
    await guardarItem(nuevoJuego)
    dispatch({ type: 'AGREGAR', payload: nuevoJuego })
    inputRef.current?.focus()
    setTimeout(() => {
      ultimoJuegoRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }, [guardarItem])

  const eliminarJuego = useCallback(async (id) => {
    await eliminarItem(id)
    dispatch({ type: 'ELIMINAR', payload: id })
  }, [eliminarItem])

  const cambiarEstado = useCallback((id, estado) => {
    dispatch({ type: 'CAMBIAR_ESTADO', payload: { id, estado } })
  }, [])

  useEffect(() => {
    function manejarAtajo(e) {
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault()
        inputRef.current?.focus()
      }
      if (e.key === 't' || e.key === 'T') {
        const enInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)
        if (!enInput) toggleTema()
      }
    }
    window.addEventListener('keydown', manejarAtajo)
    return () => window.removeEventListener('keydown', manejarAtajo)
  }, [toggleTema])

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0 }}>🎮 Mi Backlog Personal</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: 'var(--color-texto-secundario)' }}>
            ⏱️ Sesión: {tiempoSesion}s
          </span>
          <button
            onClick={() => setModo(modo === 'local' ? 'api' : 'local')}
            style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--color-borde)', background: modo === 'api' ? 'var(--color-acento)' : 'var(--color-superficie)', color: modo === 'api' ? 'white' : 'var(--color-texto)', cursor: 'pointer' }}
          >
            {modo === 'api' ? '🌐 API' : '💾 Local'}
          </button>
          <button
            onClick={toggleTema}
            style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--color-borde)', background: 'var(--color-superficie)', color: 'var(--color-texto)', cursor: 'pointer' }}
          >
            {tema === 'claro' ? '🌙 Oscuro' : '☀️ Claro'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: 'var(--color-peligro)', color: 'white', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
          ⚠️ {error}
        </div>
      )}

      {cargando && <p style={{ color: 'var(--color-texto-secundario)' }}>Cargando...</p>}

      {/* Dashboard con gráficas — solo recibe listaFiltrada */}
      <Dashboard listaFiltrada={listaFiltrada} />

      <FormularioJuego onAgregar={agregarJuego} inputRef={inputRef} />

      <Filtros
        filtroCategoria={filtroCategoria}
        filtroEstado={filtroEstado}
        busqueda={busqueda}
        dispatch={dispatch}
      />

      <ListaJuegos
        juegos={listaFiltrada}
        onEliminar={eliminarJuego}
        onCambiarEstado={cambiarEstado}
        ultimoJuegoRef={ultimoJuegoRef}
      />

    </div>
  )
}

export default App