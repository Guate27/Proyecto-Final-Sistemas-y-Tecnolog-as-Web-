import { createContext, useContext, useState, useEffect } from 'react'

// Contexto global para gestionar el tema visual de la aplicación
const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  // Inicializa el tema desde localStorage, por defecto 'claro'
  const [tema, setTema] = useState(() => {
    return localStorage.getItem('tema') || 'claro'
  })

  // Aplica el tema al atributo data-theme del body y lo persiste en localStorage
  useEffect(() => {
    document.body.setAttribute('data-theme', tema)
    localStorage.setItem('tema', tema)
  }, [tema])

  // Alterna entre tema claro y oscuro
  function toggleTema() {
    setTema(temaActual => temaActual === 'claro' ? 'oscuro' : 'claro')
  }

  return (
    <ThemeContext.Provider value={{ tema, toggleTema }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Hook personalizado para consumir el ThemeContext en cualquier componente
export function useTema() {
  return useContext(ThemeContext)
}
