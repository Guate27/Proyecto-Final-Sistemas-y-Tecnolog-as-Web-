import { useState, useEffect } from 'react'

/**
 * Hook para realizar peticiones HTTP con manejo de estados automático.
 * @param {string} url - La URL a la que se le hará la petición
 * @returns {{ data: *, loading: boolean, error: string|null }} - Estados de la petición
 */
function useFetch(url) {

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Si no hay URL, no hacemos nada
    if (!url) {
      setLoading(false)
      return
    }

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
        if (err.name !== 'AbortError') {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    return () => controller.abort()

  }, [url])

  return { data, loading, error }
}

export default useFetch