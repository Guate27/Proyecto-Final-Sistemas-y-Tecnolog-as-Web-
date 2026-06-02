import { useMemo } from 'react'
import JuegoCard from './JuegoCard'
import { CATEGORIAS } from '../utils/categorias'

// Componente que muestra todos los juegos en una grilla de 4 columnas
// Cada juego aparece dentro de un panel con el header de su categoría
function ListaJuegos({ juegos, onEliminar, onCambiarEstado, onEditar, onCalificar, ultimoJuegoRef }) {


  // Ordena los juegos por fecha de actividad descendente
  // Los juegos con interacción más reciente aparecen primero
  // useMemo evita que el sort se ejecute en cada render
  const juegosOrdenados = useMemo(() => {
    return [...juegos].sort((a, b) => {
      const fechaA = new Date(a.fechaActividad || a.fechaRegistro).getTime()
      const fechaB = new Date(b.fechaActividad || b.fechaRegistro).getTime()
      return fechaB - fechaA
    })
  }, [juegos])

  // Si el usuario no tiene juegos agregados, muestra un mensaje invitando a hacerlo
  if (juegos.length === 0) {
    return (
      <p style={{ textAlign: 'center', color: 'var(--color-texto-secundario)', marginTop: '40px' }}>
        🎮 Tu backlog está vacío. ¡Agrega tu primer juego!
      </p>
    )
  }

  return (
    <div style={{ marginTop: '24px' }}>

      {/* Título con el conteo total de juegos */}
      <h2 style={{ marginBottom: '16px' }}>📚 Mi Backlog ({juegos.length} juegos)</h2>

      {/* Grilla de 4 columnas exactas que se llena de izquierda a derecha */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        alignItems: 'start',
      }}>
        {juegosOrdenados.map((juego, index) => {

          // Busca el objeto categoría completo para acceder a su emoji, color y nombre
          const categoria = CATEGORIAS.find(c => c.id === juego.categoriaId)

          return (
            <div
              key={juego.id}
              style={{
                background: 'var(--color-superficie)',
                borderRadius: '12px',
                padding: '12px',
                border: '1px solid var(--color-borde)',
              }}
            >
              {/* Header con el emoji y nombre de la categoría del juego */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 4px 12px 4px',
                borderBottom: `2px solid ${categoria?.color || 'var(--color-borde)'}`,
                marginBottom: '12px',
              }}>
                <span style={{ fontSize: '20px' }}>{categoria?.emoji}</span>
                <span style={{ fontWeight: 'bold', flex: 1 }}>{categoria?.nombre}</span>
              </div>

              {/* Tarjeta del juego con sus datos y los botones de acción */}
              <JuegoCard
                juego={juego}
                onEliminar={onEliminar}
                onCambiarEstado={onCambiarEstado}
                onEditar={onEditar}
                onCalificar={onCalificar}
                ref={index === 0 ? ultimoJuegoRef : null}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ListaJuegos