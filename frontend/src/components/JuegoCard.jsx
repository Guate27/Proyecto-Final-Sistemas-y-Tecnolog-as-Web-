import React from 'react'
import { CATEGORIAS } from '../utils/categorias'

function JuegoCard({ juego, onEliminar, onCambiarEstado }) {
  // Busca la categoría del juego para mostrar su emoji y color
  const categoria = CATEGORIAS.find(c => c.id === juego.categoriaId)

  return (
    <div style={{
      border: '1px solid var(--color-borde)',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '12px',
      background: 'var(--color-superficie)'
    }}>

      {/* Encabezado: nombre del juego y badge de categoría */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: 'var(--color-texto)' }}>
          {categoria?.emoji} {juego.nombre}
        </h3>
        <span style={{
          background: categoria?.color,
          color: 'white',
          padding: '2px 8px',
          borderRadius: '12px',
          fontSize: '12px'
        }}>
          {categoria?.nombre}
        </span>
      </div>

      {/* Detalles del juego */}
      <p style={{ margin: '8px 0 4px', color: 'var(--color-texto)' }}>
        🎮 Plataforma: <strong>{juego.atributos.plataforma || 'No especificada'}</strong>
      </p>
      <p style={{ margin: '4px 0', color: 'var(--color-texto)' }}>
        ⏱️ Horas jugadas: <strong>{juego.atributos.horasTotales}</strong>
      </p>
      <p style={{ margin: '4px 0', color: 'var(--color-texto)' }}>
        📌 Estado: <strong>{juego.estado}</strong>
      </p>

      {/* Selector de estado */}
      <select
        value={juego.estado}
        onChange={(e) => onCambiarEstado(juego.id, e.target.value)}
        style={{
          marginTop: '8px',
          marginRight: '8px',
          padding: '4px',
          background: 'var(--color-fondo)',
          color: 'var(--color-texto)',
          border: '1px solid var(--color-borde)',
          borderRadius: '4px'
        }}
      >
        <option value="pendiente">Pendiente</option>
        <option value="jugando">Jugando</option>
        <option value="completado">Completado</option>
        <option value="abandonado">Abandonado</option>
      </select>

      {/* Botón eliminar */}
      <button
        onClick={() => onEliminar(juego.id)}
        style={{
          padding: '4px 12px',
          background: 'var(--color-peligro)',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        🗑️ Eliminar
      </button>

    </div>
  )
}

// React.memo evita re-renders innecesarios cuando las props no cambian
export default React.memo(JuegoCard)