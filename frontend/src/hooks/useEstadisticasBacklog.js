import { useMemo } from 'react'

// Hook personalizado para calcular las estadísticas del backlog de juegos
// Devuelve totales, conteos por estado, horas jugadas y porcentaje de progreso
function useEstadisticasBacklog(lista) {

  // useMemo evita recalcular las estadísticas en cada render
  // Solo se vuelven a calcular cuando la lista de juegos cambia
  const stats = useMemo(() => {

    // Filtra solo los juegos activos (los eliminados no se cuentan)
    const activos = lista.filter(j => j.activo)

    // Conteos por estado
    const total = activos.length
    const completados = activos.filter(j => j.estado === 'completado').length
    const jugando = activos.filter(j => j.estado === 'jugando').length
    const pendientes = activos.filter(j => j.estado === 'pendiente').length
    const abandonados = activos.filter(j => j.estado === 'abandonado').length

    // Suma todas las horas jugadas usando reduce
    // La parte con el ?. y el || 0 evitan errores si algún juego no tiene atributos definidos
    const horasTotales = activos.reduce(
      (suma, j) => suma + (j.atributos?.horasTotales || 0),
      0
    )

    // Calcula el porcentaje de juegos completados respecto al total
    // Si no hay juegos devuelve 0 para evitar dividir entre cero
    const porcentajeCompletado = total === 0
      ? 0
      : Math.round((completados / total) * 100)

    return {
      total,
      completados,
      jugando,
      pendientes,
      abandonados,
      horasTotales,
      porcentajeCompletado,
    }
  }, [lista])

  return stats
}

export default useEstadisticasBacklog