import React, { useState } from 'react'
import { CATEGORIAS } from '../utils/categorias'
import ModalEditarJuego from './ModalEditarJuego'
import EstrellasPuntuacion from './EstrellasPuntuacion'

// Tarjeta individual que muestra los datos de un juego y permite interactuar con él
function JuegoCard({ juego, onEliminar, onCambiarEstado, onEditar, onCalificar }) {
  // Busca la categoría del juego para mostrar su emoji y color
  const categoria = CATEGORIAS.find(c => c.id === juego.categoriaId)

  // Controla si el modal de edición está abierto o cerrado
  const [modalAbierto, setModalAbierto] = useState(false)

  // Detecta si la imagen es horizontal o vertical para ajustar el contenedor
  const [orientacionImagen, setOrientacionImagen] = useState('horizontal')

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
      {/* Imagen del juego (solo se muestra si hay URL definida) */}
      {/* El contenedor cambia de altura según si la imagen es vertical u horizontal */}
      {juego.imagen && (
        <img
          src={juego.imagen}
          alt={juego.nombre}
          onLoad={(e) => {
            // Compara dimensiones reales para definir la orientación
            const { naturalWidth, naturalHeight } = e.target
            setOrientacionImagen(naturalHeight > naturalWidth ? 'vertical' : 'horizontal')
            }}
          onError={(e) => { e.target.style.display = 'none' }}
          style={{
            width: '100%',
            height: orientacionImagen === 'vertical' ? '280px' : '140px' ,
            objectFit: 'cover',
            borderRadius: '6px',
            marginTop: '12px',
            border: '1px solid var(--color-borde)'
          }}
        />
      )}

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

      {/* Sección de calificación con estrellas */}
      <EstrellasPuntuacion
        puntuacion={juego.puntuacion}
        onCambiar={(valor) => onCalificar(juego.id, valor)}
      />

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

      {/* Botón para abrir el modal de edición */}
      <button
        onClick={() => setModalAbierto(true)}
        style={{
          padding: '4px 12px',
          marginRight: '8px',
          background: 'var(--color-acento)',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        ✏️ Editar
      </button>

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

      {/* Renderizar el modal solo cuando está abierto */}
      {modalAbierto && (
        <ModalEditarJuego
          juego={juego}
          onGuardar={onEditar}
          onCerrar={() => setModalAbierto(false)}
        />
      )}

    </div>
  )
}

// React.memo evita re-renders innecesarios cuando las props no cambian
export default React.memo(JuegoCard)