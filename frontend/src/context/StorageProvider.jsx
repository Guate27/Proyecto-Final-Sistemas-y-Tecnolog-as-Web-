import { createContext, useContext, useState, useCallback } from 'react'
import useFetch from '../hooks/useFetch'

// Contexto global que controla de dónde se obtienen los datos de la app
// Permite que cualquier componente acceda a los juegos sin saber de dónde vienen
export const StorageContext = createContext()

export function StorageProvider({ children }) {

  //Lee el modo que estaba guardado en LocalStorage la última vez
  // Si no hay nada, arranca en modo 'local' por defecto
  const [modo, setModoState] = useState(() =>
    localStorage.getItem('modo') || 'local'
  )

  // Estados para mostrar indicadores de carga y mensajes de error
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)

  // URL del backend que se puede configurar desde variables de entorno
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

  // useFetch se activa cuando el modo es 'api'
  // En modo 'local' se le pasa null para que no haga ninguna petición
  const { data: itemsApi, loading: cargandoApi, error: errorApi } = useFetch(
    modo === 'api' ? `${API_URL}/api/items` : null
  )

  // Cambia el modo y lo guarda en LocalStorage para que persista al recargar
  function setModo(nuevoModo) {
    setModoState(nuevoModo)
    localStorage.setItem('modo', nuevoModo)
  }

  // Obtiene los juegos según el modo activo
  // En modo API usa los datos ya traídos por useFetch
  // En modo local los lee directamente del LocalStorage
  const obtenerItems = useCallback(async () => {
    if (modo === 'api') {
      if (errorApi) { setError(errorApi); return [] }
      return itemsApi || []
    } else {
      const data = localStorage.getItem('juegos')
      return data ? JSON.parse(data) : []
    }
  }, [modo, itemsApi, errorApi])

  // Guarda un juego nuevo según el modo activo
  // En modo API hace POST al backend, en modo local lo agrega al array de LocalStorage
  const guardarItem = useCallback(async (juego) => {
    setCargando(true)
    setError(null)
    try {
      if (modo === 'api') {
        const res = await fetch(`${API_URL}/api/items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(juego),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return await res.json()
      } else {
        const data = localStorage.getItem('juegos')
        const juegos = data ? JSON.parse(data) : []
        const nuevosJuegos = [...juegos, juego]
        localStorage.setItem('juegos', JSON.stringify(nuevosJuegos))
        return juego
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }, [modo])

  // Actualiza un juego existente según el modo activo
  // En modo API hace PUT, en modo local reemplaza el objeto dentro del array
  const actualizarItem = useCallback(async (juego) => {
    setCargando(true)
    setError(null)
    try {
      if (modo === 'api') {
        const res = await fetch(`${API_URL}/api/items/${juego.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(juego),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return await res.json()
      } else {
        const data = localStorage.getItem('juegos')
        const juegos = data ? JSON.parse(data) : []
        const actualizados = juegos.map(j =>
          j.id === juego.id ? juego : j
        )
        localStorage.setItem('juegos', JSON.stringify(actualizados))
        return juego
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }, [modo])

  // Elimina (archiva) un juego según el modo activo
  // En modo API hace DELETE, en modo local pone activo en false
  const eliminarItem = useCallback(async (id) => {
    setCargando(true)
    setError(null)
    try {
      if (modo === 'api') {
        const res = await fetch(`${API_URL}/api/items/${id}`, {
          method: 'DELETE',
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
      } else {
        const data = localStorage.getItem('juegos')
        const juegos = data ? JSON.parse(data) : []
        const actualizados = juegos.map(j =>
          j.id === id ? { ...j, activo: false } : j
        )
        localStorage.setItem('juegos', JSON.stringify(actualizados))
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }, [modo])

  // Expone todo el contexto para que cualquier componente pueda consumirlo
  return (
    <StorageContext.Provider value={{
      modo, setModo,
      cargando: cargando || cargandoApi,
      error: error || errorApi,
      obtenerItems, guardarItem, actualizarItem, eliminarItem,
    }}>
      {children}
    </StorageContext.Provider>
  )
}

// Hook personalizado para consumir el StorageContext desde cualquier componente
export function useStorage() {
  return useContext(StorageContext)
}