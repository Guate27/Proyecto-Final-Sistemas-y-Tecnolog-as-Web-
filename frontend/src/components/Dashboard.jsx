// Componente que agrupa las 3 gráficas del backlog
import GraficaActividad from './GraficaActividad'
import GraficaCategorias from './GraficaCategorias'
import GraficaEstados from './GraficaEstados'

function Dashboard({ lista, listaFiltrada }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <h2 style={{ color: 'var(--color-texto)', marginBottom: '16px' }}>📈 Dashboard</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px'
      }}>
        <GraficaActividad lista={lista} />
        <GraficaCategorias listaFiltrada={listaFiltrada} />
        <GraficaEstados listaFiltrada={listaFiltrada} />
      </div>
    </div>
  )
}

export default Dashboard