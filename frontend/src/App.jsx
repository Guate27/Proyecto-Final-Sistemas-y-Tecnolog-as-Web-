import { useReducer, useEffect, useRef, useCallback, useMemo } from 'react'
import { useStorage } from './context/StorageProvider'
import { useTema } from './context/ThemeContext'
import { itemsReducer, initialState } from './reducers/itemsReducer'
import { crearJuego } from './utils/juegos'
import useAtajoTeclado from './hooks/useAtajoTeclado'
import useEstadisticasBacklog from './hooks/useEstadisticasBacklog'
import FormularioJuego from './components/FormularioJuego'
import ListaJuegosKanban from './components/ListaJuegos'
import Filtros from './components/Filtros'
import Dashboard from './components/Dashboard'

function App() {
  // Funciones para manejar el almacenamiento (API o LocalStorage)
  const { obtenerItems, guardarItem, actualizarItem, eliminarItem, cargando, error, modo, setModo } = useStorage()

  // Manejo del tema claro/oscuro
  const { tema, toggleTema } = useTema()

  // Estado global de la app con useReducer
  const [state, dispatch] = useReducer(itemsReducer, initialState)
  const { lista, filtroCategoria, filtroEstado, busqueda } = state

  // Referencias a elementos del DOM
  const inputRef = useRef(null)              // referencia al input para enfocarlo con Ctrl+K
  const intervaloRef = useRef(null)          // guarda el ID del setInterval para limpiarlo después
  const ultimoJuegoRef = useRef(null)        // referencia al último juego agregado para hacer scroll

  // Contador de tiempo de sesión (usa un mini reducer para sumar 1 cada segundo)
  const [tiempoSesion, setTiempoSesion] = useReducer((s) => s + 1, 0)

  // Carga los juegos desde el storage al iniciar o al cambiar de modo
  useEffect(() => {
    async function cargarJuegos() {
      const data = await obtenerItems()
      dispatch({ type: 'HIDRATAR', payload: data })
    }
    cargarJuegos()
  }, [obtenerItems, modo])

  // Inicia el contador de sesión cuando se crea el componente
  useEffect(() => {
    intervaloRef.current = setInterval(() => {
      setTiempoSesion()
    }, 1000)
        // Limpia el intervalo cuando el componente se desmonta para que no siga ejecutándose
    return () => clearInterval(intervaloRef.current)
  }, [])

  // Filtra la lista de juegos según los filtros activos
  // Solo se recalcula cuando cambian la lista o algún filtro
  const listaFiltrada = useMemo(() => {
    return lista.filter(item => {
      if (!item.activo) return false                                                              // descarta juegos archivados
      if (filtroCategoria !== 'todas' && item.categoriaId !== filtroCategoria) return false       // filtro por categoría
      if (filtroEstado !== 'todos' && item.estado !== filtroEstado) return false                  // filtro por estado
      if (busqueda && !item.nombre.toLowerCase().includes(busqueda.toLowerCase())) return false   // filtro por texto
      return true
    })
  }, [lista, filtroCategoria, filtroEstado, busqueda])

  // Calcula las estadísticas del backlog usando mi hook personalizado
  const stats = useEstadisticasBacklog(lista)

  // Agrega un juego nuevo al backlog
  const agregarJuego = useCallback(async (nuevoJuego) => {
    await guardarItem(nuevoJuego)
    dispatch({ type: 'AGREGAR', payload: nuevoJuego })
    inputRef.current?.focus()   // vuelve a poner el cursor en el input
  // Hace scroll automático hasta el juego que se acaba de agregar
    setTimeout(() => {
      ultimoJuegoRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }, [guardarItem])

  // Elimina un juego del backlog
  const eliminarJuego = useCallback(async (id) => {
    await eliminarItem(id)
    dispatch({ type: 'ELIMINAR', payload: id })
  }, [eliminarItem])

  // Cambia el estado de un juego (pendiente, jugando, completado, abandonado)
  // También actualiza la fechaActividad para que el juego suba al inicio del orden
  const cambiarEstado = useCallback(async (id, estado) => {
    const juegoActual = lista.find(j => j.id === id)
    if (!juegoActual) return

    const juegoActualizado = {
      ...juegoActual,
      estado,
      fechaActividad: new Date().toISOString()   // marca el momento exacto de la interacción
    }

    await actualizarItem(juegoActualizado)       // guarda el cambio en el storage
    dispatch({ type: 'CAMBIAR_ESTADO', payload: { id, estado } })
  }, [lista, actualizarItem])

  // Atajos de teclado: Ctrl+K para poner el cursor en e input, T para cambiar el tema
  useAtajoTeclado('k', () => inputRef.current?.focus(), { ctrl: true })
  useAtajoTeclado('t', toggleTema)

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>

      {/* Header con el título y los botones de modo y tema */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0 }}>🎮 Mi Backlog Personal</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: 'var(--color-texto-secundario)' }}>
            ⏱️ Sesión: {tiempoSesion}s
          </span>
          {/* Botón para alternar entre modo Local y modo API */}
          <button
            onClick={() => setModo(modo === 'local' ? 'api' : 'local')}
            style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--color-borde)', background: modo === 'api' ? 'var(--color-acento)' : 'var(--color-superficie)', color: modo === 'api' ? 'white' : 'var(--color-texto)', cursor: 'pointer' }}
          >
            {modo === 'api' ? '🌐 API' : '💾 Local'}
          </button>
          {/* Botón para alternar el tema claro/oscuro */}
          <button
            onClick={toggleTema}
            style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--color-borde)', background: 'var(--color-superficie)', color: 'var(--color-texto)', cursor: 'pointer' }}
          >
            {tema === 'claro' ? '🌙 Oscuro' : '☀️ Claro'}
          </button>
        </div>
      </div>

      {/* Muestra mensaje de error si algo falló */}
      {error && (
        <div style={{ background: 'var(--color-peligro)', color: 'white', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Mensaje de carga */}
      {cargando && <p style={{ color: 'var(--color-texto-secundario)' }}>Cargando...</p>}

      {/* Tarjetas con las estadísticas generales del backlog */}
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

      {/* Dashboard con las gráficas del backlog */}
      <Dashboard listaFiltrada={listaFiltrada} />

      {/* Formulario para agregar juegos nuevos */}
      <FormularioJuego onAgregar={agregarJuego} inputRef={inputRef} />

      {/* Sección de filtros (categoría, estado, búsqueda) */}
      <Filtros
        filtroCategoria={filtroCategoria}
        filtroEstado={filtroEstado}
        busqueda={busqueda}
        dispatch={dispatch}
      />

      {/* Lista de juegos en formato de tarjetas con grilla de 4 columnas */}
      <ListaJuegosKanban
        juegos={listaFiltrada}
        onEliminar={eliminarJuego}
        onCambiarEstado={cambiarEstado}
        ultimoJuegoRef={ultimoJuegoRef}
      />

    </div>
  )
}

export default App