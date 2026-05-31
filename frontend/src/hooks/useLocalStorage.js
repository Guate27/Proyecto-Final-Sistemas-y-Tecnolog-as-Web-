import { useState, useEffect } from 'react'

/**
 * Hook para sincronizar un valor con localStorage automáticamente.
 * @param {string} clave - La clave con la que se guarda en localStorage
 * @param {*} valorInicial - El valor por defecto si no hay nada guardado
 * @returns {[*, function]} - [valor actual, función para actualizarlo]
 */
function useLocalStorage(clave, valorInicial) {

  const [valor, setValor] = useState(() => {
    const guardado = localStorage.getItem(clave)
    if (!guardado) return valorInicial
    try {
      return JSON.parse(guardado)
    } catch {
      return guardado // Si no es JSON válido, lo usamos como texto simple
    }
  })

  useEffect(() => {
    localStorage.setItem(clave, JSON.stringify(valor))
  }, [clave, valor])

  return [valor, setValor]
}

export default useLocalStorage