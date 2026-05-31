import { createContext, useContext, useEffect } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {

  const [tema, setTema] = useLocalStorage('tema', 'claro')

  useEffect(() => {
    document.body.setAttribute('data-theme', tema)
  }, [tema])

  function toggleTema() {
    setTema(temaActual => temaActual === 'claro' ? 'oscuro' : 'claro')
  }

  return (
    <ThemeContext.Provider value={{ tema, toggleTema }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTema() {
  return useContext(ThemeContext)
}