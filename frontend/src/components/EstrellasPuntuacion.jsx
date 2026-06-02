import { useState } from 'react'

// Componente que muestra 10 estrellas clickeables para calificar un juego
// Recibe la puntuación actual del juego y la función para actualizarla
function EstrellasPuntuacion({ puntuacion, onCambiar }) {

  // Estrella sobre la que está pasando el cursor del usuario
  // Permite mostrar el efecto visual de "vista previa" antes de hacer clic
  const [hover, setHover] = useState(0)

  // Define qué valor usar para pintar las estrellas
  // Si el usuario está pasando el cursor, usa el valor del hover; si no, el valor real
  const valorMostrado = hover || puntuacion || 0

  // Construye el array de 10 estrellas para recorrerlas con map
  const estrellas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginTop: '8px', flexWrap: 'wrap' }}>
      {estrellas.map(num => (
        <span
          key={num}
          onClick={() => onCambiar(num)}
          onMouseEnter={() => setHover(num)}
          onMouseLeave={() => setHover(0)}
          style={{
            cursor: 'pointer',
            fontSize: '18px',
            color: num <= valorMostrado ? '#FFD700' : 'var(--color-borde)',
            transition: 'color 0.15s',
            userSelect: 'none',
          }}
        >
          ★
        </span>
      ))}

      {/* Texto al lado de las estrellas con la puntuación numérica */}
      <span style={{ marginLeft: '8px', fontSize: '13px', color: 'var(--color-texto-secundario)' }}>
        {puntuacion ? `${puntuacion}/10` : 'Sin calificar'}
      </span>
    </div>
  )
}

export default EstrellasPuntuacion