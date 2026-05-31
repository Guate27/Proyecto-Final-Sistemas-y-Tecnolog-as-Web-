import { createContext, useContext, useState, useCallback } from 'react'
import useFetch from '../hooks/useFetch'

export const StorageContext = createContext()

export function StorageProvider({ children }) {
  const [modo, setModoState] = useState(() =>
    localStorage.getItem('modo') || 'local'
  )
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

  // useFetch se activa automáticamente cuando modo es 'api'
  // Si modo es 'local', le pasamos null y el hook no hace nada
  const { data: itemsApi, loading: cargandoApi, error: errorApi } = useFetch(
    modo === 'api' ? `${API_URL}/api/items` : null
  )

  function setModo(nuevoModo) {
    setModoState(nuevoModo)
    localStorage.setItem('modo', nuevoModo)
  }

  // Ahora obtenerItems usa los datos que useFetch ya trajo
  const obtenerItems = useCallback(async () => {
    if (modo === 'api') {
      if (errorApi) { setError(errorApi); return [] }
      return itemsApi || []
    } else {
      const data = localStorage.getItem('juegos')
      return data ? JSON.parse(data) : []
    }
  }, [modo, itemsApi, errorApi])

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

  return (
    <StorageContext.Provider value={{
      modo, setModo,
      cargando: cargando || cargandoApi,
      error: error || errorApi,
      obtenerItems, guardarItem, eliminarItem,
    }}>
      {children}
    </StorageContext.Provider>
  )
}

export function useStorage() {
  return useContext(StorageContext)
}