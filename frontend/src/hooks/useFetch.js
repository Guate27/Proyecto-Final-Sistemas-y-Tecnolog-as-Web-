import { useState, useEffect } from 'react'

// Hook personalizado para hacer solicitudes HTTP de forma sencilla
// Maneja automáticamente los estados de carga, error y datos
function useFetch(url) {

  // Los tres estados de una solicitud HTTP
  const [data, setData] = useState(null)        // los datos recibidos
  const [loading, setLoading] = useState(true)  // indica si la petición está en proceso
  const [error, setError] = useState(null)      // mensaje de error si algo falla

  useEffect(() => {
    // Si no hay URL no hacemos ninguna petición
    if (!url) {
      setLoading(false)
      return
    }

    // AbortController permite cancelar la petición si el componente se rompe antes de que termine
    const controller = new AbortController()

    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(url, { signal: controller.signal })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        setData(json)
      } catch (err) {
        // Si el error es por cancelación, lo ignoramos (no es un error real)
        if (err.name !== 'AbortError') {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Cuando el componente se rompe, se cancela la petición pendiente
    return () => controller.abort()

  }, [url])

  return { data, loading, error }
}

export default useFetch