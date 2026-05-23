import JuegoCard from './JuegoCard'

function ListaJuegos({ juegos, onEliminar, onCambiarEstado }) {

  // Si no hay juegos activos muestra un mensaje vacío
  if (juegos.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-texto-secundario)' }}>
        <p>🎮 Tu backlog está vacío. ¡Agrega tu primer juego!</p>
      </div>
    )
  }

  return (
    <div>
      <h2 style={{ color: 'var(--color-texto)' }}>
        📋 Mi Backlog ({juegos.length} juegos)
      </h2>
      {juegos.map(juego => (
        <JuegoCard
          key={juego.id}
          juego={juego}
          onEliminar={onEliminar}
          onCambiarEstado={onCambiarEstado}
        />
      ))}
    </div>
  )
}

export default ListaJuegos