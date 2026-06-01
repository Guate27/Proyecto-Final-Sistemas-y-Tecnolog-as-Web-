import { useState, useEffect } from 'react'

// Hook personalizado para guardar y leer datos automáticamente desde LocalStorage
// Se usa igual que useState pero los datos persisten al recargar la página
function useLocalStorage(clave, valorInicial) {

  // Inicializa el valor leyendo lo que ya esté guardado en LocalStorage, si no hay nada guardado, usa el valor por defecto
  const [valor, setValor] = useState(() => {
    const guardado = localStorage.getItem(clave)
    if (!guardado) return valorInicial
    try {
      return JSON.parse(guardado)   // intenta convertir el texto a su formato original
    } catch {
      return guardado               // si no es JSON válido, lo usa como texto simple
    }
  })

  // Cada vez que el valor cambia, lo guarda automáticamente en LocalStorage
  useEffect(() => {
    localStorage.setItem(clave, JSON.stringify(valor))
  }, [clave, valor])

  // Devuelve el valor y el setter igual que useState
  return [valor, setValor]
}

export default useLocalStorage