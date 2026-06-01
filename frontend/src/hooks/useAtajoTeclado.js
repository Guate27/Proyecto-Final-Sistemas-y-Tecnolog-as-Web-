import { useEffect } from 'react'

// Hook personalizado para escuchar atajos de teclado en cualquier componente
// Recibe la tecla a escuchar, la función a ejecutar y opciones adicionales
function useAtajoTeclado(tecla, callback, opciones = {}) {

  // Si no se pasan opciones, por defecto no requiere Ctrl e ignora los inputs
  const { ctrl = false, ignorarInputs = true } = opciones

  useEffect(() => {
    function manejarTecla(e) {
      // Si el atajo requiere Ctrl pero no está presionado, no hacer nada
      if (ctrl && !e.ctrlKey) return

      // Si el atajo NO requiere Ctrl pero está presionado, no hacer nada
      if (!ctrl && e.ctrlKey) return

      // Compara la tecla sin importar mayúsculas o minúsculas
      if (e.key.toLowerCase() !== tecla.toLowerCase()) return

      // Si el usuario está escribiendo en un input, no activar el atajo
      if (ignorarInputs && !ctrl) {
        const enInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)
        if (enInput) return
      }

      // Si el atajo usa Ctrl, evita que el navegador ejecute su acción por defecto
      if (ctrl) e.preventDefault()

      callback(e)
    }

    // Agrega el listener al cargar el componente
    window.addEventListener('keydown', manejarTecla)

    // Quita el listener cuando el componente se rompe
    return () => window.removeEventListener('keydown', manejarTecla)

  }, [tecla, callback, ctrl, ignorarInputs])
}

export default useAtajoTeclado