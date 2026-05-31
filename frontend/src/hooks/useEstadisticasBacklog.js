import { useMemo } from 'react'

/**
 * Hook de dominio que calcula estadísticas del backlog de videojuegos.
 * @param {Array} lista - Lista de juegos del backlog
 * @returns {{ total: number, completados: number, jugando: number, pendientes: number, abandonados: number, horasTotales: number, porcentajeCompletado: number }}
 */
function useEstadisticasBacklog(lista) {

  const stats = useMemo(() => {
    const activos = lista.filter(j => j.activo)

    const total = activos.length
    const completados = activos.filter(j => j.estado === 'completado').length
    const jugando = activos.filter(j => j.estado === 'jugando').length
    const pendientes = activos.filter(j => j.estado === 'pendiente').length
    const abandonados = activos.filter(j => j.estado === 'abandonado').length

    const horasTotales = activos.reduce(
      (suma, j) => suma + (j.atributos?.horasTotales || 0),
      0
    )

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