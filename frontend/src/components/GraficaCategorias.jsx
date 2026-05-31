// Gráfica 2: PieChart que muestra la distribución de juegos por categoría
import { useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { CATEGORIAS } from '../utils/categorias'

function GraficaCategorias({ listaFiltrada }) {

  // Calcula la distribución de juegos por categoría con useMemo
  const datos = useMemo(() => {
    return CATEGORIAS.map(cat => ({
      name: `${cat.emoji} ${cat.nombre}`,
      value: listaFiltrada.filter(item => item.categoriaId === cat.id).length,
      color: cat.color
    })).filter(d => d.value > 0)
  }, [listaFiltrada])

  if (datos.length === 0) {
    return (
      <div style={{ background: 'var(--color-superficie)', borderRadius: '8px', padding: '16px', border: '1px solid var(--color-borde)' }}>
        <h3 style={{ margin: '0 0 16px', color: 'var(--color-texto)' }}>🎯 Distribución por categoría</h3>
        <p style={{ color: 'var(--color-texto-secundario)', textAlign: 'center' }}>No hay juegos para mostrar</p>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--color-superficie)', borderRadius: '8px', padding: '16px', border: '1px solid var(--color-borde)' }}>
      <h3 style={{ margin: '0 0 16px', color: 'var(--color-texto)' }}>🎯 Distribución por categoría</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={datos}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {datos.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: 'var(--color-superficie)', border: '1px solid var(--color-borde)', color: 'var(--color-texto)' }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default GraficaCategorias