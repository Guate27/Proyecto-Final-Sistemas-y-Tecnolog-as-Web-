import { CATEGORIAS } from '../utils/categorias'

function Filtros({ filtroCategoria, filtroEstado, busqueda, dispatch }) {
  return (
    <div style={{
      padding: '16px',
      border: '1px solid var(--color-borde)',
      borderRadius: '8px',
      background: 'var(--color-superficie)',
      marginBottom: '16px',
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap',
      alignItems: 'center'
    }}>
      <span style={{ color: 'var(--color-texto)', fontWeight: 'bold' }}>🔍 Filtros:</span>

      {/* Búsqueda por texto */}
      <input
        type="text"
        placeholder="Buscar juego..."
        value={busqueda}
        onChange={(e) => dispatch({ type: 'FILTRAR', payload: { busqueda: e.target.value } })}
        style={{
          padding: '6px 10px',
          borderRadius: '6px',
          border: '1px solid var(--color-borde)',
          background: 'var(--color-fondo)',
          color: 'var(--color-texto)',
          minWidth: '160px'
        }}
      />

      {/* Filtro por categoría */}
      <select
        value={filtroCategoria}
        onChange={(e) => dispatch({ type: 'FILTRAR', payload: { filtroCategoria: e.target.value } })}
        style={{
          padding: '6px 10px',
          borderRadius: '6px',
          border: '1px solid var(--color-borde)',
          background: 'var(--color-fondo)',
          color: 'var(--color-texto)'
        }}
      >
        <option value="todas">🎮 Todas las categorías</option>
        {CATEGORIAS.map(cat => (
          <option key={cat.id} value={cat.id}>
            {cat.emoji} {cat.nombre}
          </option>
        ))}
      </select>

      {/* Filtro por estado */}
      <select
        value={filtroEstado}
        onChange={(e) => dispatch({ type: 'FILTRAR', payload: { filtroEstado: e.target.value } })}
        style={{
          padding: '6px 10px',
          borderRadius: '6px',
          border: '1px solid var(--color-borde)',
          background: 'var(--color-fondo)',
          color: 'var(--color-texto)'
        }}
      >
        <option value="todos">📌 Todos los estados</option>
        <option value="pendiente">⏳ Pendiente</option>
        <option value="jugando">🎮 Jugando</option>
        <option value="completado">✅ Completado</option>
        <option value="abandonado">❌ Abandonado</option>
      </select>

      {/* Botón limpiar filtros */}
      <button
        onClick={() => dispatch({ type: 'LIMPIAR_FILTROS' })}
        style={{
          padding: '6px 12px',
          borderRadius: '6px',
          border: '1px solid var(--color-borde)',
          background: 'var(--color-superficie)',
          color: 'var(--color-texto)',
          cursor: 'pointer'
        }}
      >
        🗑️ Limpiar
      </button>
    </div>
  )
}

export default Filtros