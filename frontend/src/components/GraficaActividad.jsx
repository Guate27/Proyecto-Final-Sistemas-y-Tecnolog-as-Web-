import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function GraficaActividad({ listaFiltrada }) {

  const datos = useMemo(() => {
    const hoy = new Date()
    const ultimos7Dias = Array.from({ length: 7 }, (_, i) => {
      const fecha = new Date(hoy)
      fecha.setDate(hoy.getDate() - (6 - i))
      return {
        fecha: fecha.toLocaleDateString('es-GT', { weekday: 'short', day: 'numeric' }),
        fechaISO: fecha.toISOString().split('T')[0],
        juegos: 0
      }
    })

    listaFiltrada.forEach(item => {
      const fechaItem = item.fechaRegistro?.split('T')[0]
      const dia = ultimos7Dias.find(d => d.fechaISO === fechaItem)
      if (dia) dia.juegos += 1
    })

    return ultimos7Dias
  }, [listaFiltrada])

  return (
    <div style={{ background: 'var(--color-superficie)', borderRadius: '8px', padding: '16px', border: '1px solid var(--color-borde)' }}>
      <h3 style={{ margin: '0 0 16px', color: 'var(--color-texto)' }}>📅 Juegos agregados — últimos 7 días</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={datos} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <XAxis dataKey="fecha" tick={{ fill: 'var(--color-texto-secundario)', fontSize: 11 }} />
          <YAxis allowDecimals={false} tick={{ fill: 'var(--color-texto-secundario)', fontSize: 11 }} />
          <Tooltip
            contentStyle={{ background: 'var(--color-superficie)', border: '1px solid var(--color-borde)', color: 'var(--color-texto)' }}
          />
          <Legend />
          <Bar dataKey="juegos" name="Juegos agregados" fill="#7F77DD" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default GraficaActividad