// frontend/src/context/StorageProvider.jsx
import { createContext, useContext, useState, useCallback } from 'react'

// Contexto global para abstraer el origen de los datos
export const StorageContext = createContext()

export function StorageProvider({ children }) {
  // Inicializa el modo desde localStorage, por defecto 'local'
  const [modo, setModoState] = useState(() =>
    localStorage.getItem('modo') || 'local'
  )
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

  // Persiste el modo seleccionado en localStorage
  function setModo(nuevoModo) {
    setModoState(nuevoModo)
    localStorage.setItem('modo', nuevoModo)
  }

  // Obtiene todos los juegos activos según el modo actual
  const obtenerItems = useCallback(async () => {
    setCargando(true)
    setError(null)
    try {
      if (modo === 'api') {
        const res = await fetch(`${API_URL}/api/items`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return await res.json()
      } else {
        const data = localStorage.getItem('juegos')
        return data ? JSON.parse(data) : []
      }
    } catch (err) {
      setError(err.message)
      return []
    } finally {
      setCargando(false)
    }
  }, [modo])

  // Guarda un juego nuevo o actualiza uno existente según el modo actual
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

  // Archiva un juego (activo = false) según el modo actual
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
      modo, setModo, cargando, error,
      obtenerItems, guardarItem, eliminarItem,
    }}>
      {children}
    </StorageContext.Provider>
  )
}

// Hook personalizado para consumir el StorageContext en cualquier componente
export function useStorage() {
  return useContext(StorageContext)
}