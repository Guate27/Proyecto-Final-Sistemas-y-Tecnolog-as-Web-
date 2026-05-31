import { useReducer, useEffect, useRef, useCallback, useMemo } from 'react'
import { useStorage } from './context/StorageProvider'
import { useTema } from './context/ThemeContext'
import { itemsReducer, initialState } from './reducers/itemsReducer'
import { crearJuego } from './utils/juegos'
import useAtajoTeclado from './hooks/useAtajoTeclado'
import useEstadisticasBacklog from './hooks/useEstadisticasBacklog'
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

  // Estadísticas calculadas con nuestro hook de dominio
  const stats = useEstadisticasBacklog(lista)

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

  // Atajos de teclado usando nuestro custom hook
  useAtajoTeclado('k', () => inputRef.current?.focus(), { ctrl: true })
  useAtajoTeclado('t', toggleTema)

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

      {/* Estadísticas del backlog usando hook de dominio */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <div style={{ background: 'var(--color-superficie)', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-borde)' }}>
          <div style={{ fontSize: '12px', color: 'var(--color-texto-secundario)' }}>📚 Total</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.total}</div>
        </div>
        <div style={{ background: 'var(--color-superficie)', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-borde)' }}>
          <div style={{ fontSize: '12px', color: 'var(--color-texto-secundario)' }}>✅ Completados</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.completados}</div>
        </div>
        <div style={{ background: 'var(--color-superficie)', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-borde)' }}>
          <div style={{ fontSize: '12px', color: 'var(--color-texto-secundario)' }}>🎮 Jugando</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.jugando}</div>
        </div>
        <div style={{ background: 'var(--color-superficie)', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-borde)' }}>
          <div style={{ fontSize: '12px', color: 'var(--color-texto-secundario)' }}>⏱️ Horas</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.horasTotales}</div>
        </div>
        <div style={{ background: 'var(--color-superficie)', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-borde)' }}>
          <div style={{ fontSize: '12px', color: 'var(--color-texto-secundario)' }}>📊 Progreso</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.porcentajeCompletado}%</div>
        </div>
      </div>

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