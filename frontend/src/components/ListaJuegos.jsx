import JuegoCard from './JuegoCard'

function ListaJuegos({ juegos, onEliminar, onCambiarEstado, ultimoJuegoRef }) {

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
      {juegos.map((juego, index) => (
        // Asigna la ref al último juego de la lista para scroll automático
        <div key={juego.id} ref={index === juegos.length - 1 ? ultimoJuegoRef : null}>
          <JuegoCard
            juego={juego}
            onEliminar={onEliminar}
            onCambiarEstado={onCambiarEstado}
          />
        </div>
      ))}
    </div>
  )
}

export default ListaJuegos