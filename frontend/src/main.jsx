// frontend/src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './context/ThemeContext'
import { StorageProvider } from './context/StorageProvider'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* ThemeProvider envuelve toda la app para que cualquier componente pueda acceder al tema */}
    <ThemeProvider>
      {/* StorageProvider envuelve toda la app para que cualquier componente pueda acceder a los datos */}
      <StorageProvider>
        <App />
      </StorageProvider>
    </ThemeProvider>
  </StrictMode>
)