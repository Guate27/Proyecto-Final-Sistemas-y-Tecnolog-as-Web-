// Gráfica 3 : BarChart que muestra la cantidad de juegos por estado
import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'

const COLORES_ESTADO = {
  pendiente: '#f59e0b',
  jugando: '#3b82f6',
  completado: '#10b981',
  abandonado: '#ef4444',
}

function GraficaEstados({ listaFiltrada }) {

  // Calcula la cantidad de juegos por estado con useMemo
  const datos = useMemo(() => {
    const estados = ['pendiente', 'jugando', 'completado', 'abandonado']
    return estados.map(estado => ({
      estado: estado.charAt(0).toUpperCase() + estado.slice(1),
      cantidad: listaFiltrada.filter(item => item.estado === estado).length,
      color: COLORES_ESTADO[estado]
    }))
  }, [listaFiltrada])

  return (
    <div style={{ background: 'var(--color-superficie)', borderRadius: '8px', padding: '16px', border: '1px solid var(--color-borde)' }}>
      <h3 style={{ margin: '0 0 16px', color: 'var(--color-texto)' }}>📊 Juegos por estado</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={datos}>
          <XAxis dataKey="estado" tick={{ fill: 'var(--color-texto-secundario)', fontSize: 11 }} />
          <YAxis allowDecimals={false} tick={{ fill: 'var(--color-texto-secundario)', fontSize: 11 }} />
          <Tooltip
            contentStyle={{ background: 'var(--color-superficie)', border: '1px solid var(--color-borde)', color: 'var(--color-texto)' }}
          />
          <Legend />
          <Bar dataKey="cantidad" name="Juegos" radius={[4, 4, 0, 0]}>
            {datos.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default GraficaEstados