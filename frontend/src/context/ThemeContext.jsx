import { createContext, useContext, useEffect } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

// Contexto global que controla el tema visual de toda la aplicación
const ThemeContext = createContext()

export function ThemeProvider({ children }) {

  // Guarda el tema en LocalStorage para que persista al recargar la página, por defecto arranca en tema 'claro' si no hay nada guardado
  const [tema, setTema] = useLocalStorage('tema', 'claro')

  // Aplica el tema al atributo data-theme del body
  // Esto hace que el CSS use las variables del tema correspondiente
  useEffect(() => {
    document.body.setAttribute('data-theme', tema)
  }, [tema])

  // Alterna entre tema claro y oscuro al hacer clic en el botón o atajo T
  function toggleTema() {
    setTema(temaActual => temaActual === 'claro' ? 'oscuro' : 'claro')
  }

  return (
    <ThemeContext.Provider value={{ tema, toggleTema }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Hook personalizado para consumir el ThemeContext desde cualquier componente
export function useTema() {
  return useContext(ThemeContext)
}