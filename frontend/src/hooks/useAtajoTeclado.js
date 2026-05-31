import { useEffect } from 'react'

/**
 * Hook para escuchar atajos de teclado con limpieza automática.
 * @param {string} tecla - La tecla que dispara el atajo (ej: 'n', 't')
 * @param {function} callback - Función que se ejecuta al presionar la tecla
 * @param {{ ctrl?: boolean, ignorarInputs?: boolean }} opciones - Modificadores opcionales
 */
function useAtajoTeclado(tecla, callback, opciones = {}) {
  const { ctrl = false, ignorarInputs = true } = opciones

  useEffect(() => {
    function manejarTecla(e) {
      // Si requiere Ctrl pero no está presionado, ignorar
      if (ctrl && !e.ctrlKey) return
      // Si NO requiere Ctrl pero está presionado, ignorar
      if (!ctrl && e.ctrlKey) return

      // Comparar la tecla (insensible a mayúsculas)
      if (e.key.toLowerCase() !== tecla.toLowerCase()) return

      // Si estamos escribiendo en un input, ignorar (a menos que sea con Ctrl)
      if (ignorarInputs && !ctrl) {
        const enInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)
        if (enInput) return
      }

      if (ctrl) e.preventDefault()
      callback(e)
    }

    window.addEventListener('keydown', manejarTecla)
    return () => window.removeEventListener('keydown', manejarTecla)

  }, [tecla, callback, ctrl, ignorarInputs])
}

export default useAtajoTeclado