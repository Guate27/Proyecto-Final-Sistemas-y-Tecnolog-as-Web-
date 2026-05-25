
// Estado inicial del reducer
export const initialState = {
  lista: [],
  filtroCategoria: 'todas',
  filtroEstado: 'todos',
  busqueda: '',
}

// Función que devuelve un estado sin modificar el anterior
export function itemsReducer(state, action) {
  switch (action.type) {

    // Carga inicial de juegos desde API o localStorage
    case 'HIDRATAR':
      return { ...state, lista: action.payload }

    // Agrega un nuevo juego al array
    case 'AGREGAR':
      return { ...state, lista: [...state.lista, action.payload] }

    // Archiva un juego marcándolo como inactivo
    case 'ELIMINAR':
      return {
        ...state,
        lista: state.lista.map(item =>
          item.id === action.payload
            ? { ...item, activo: false }
            : item
        )
      }

    // Actualiza el estado de un juego (pendiente, jugando, completado, abandonado)
    case 'CAMBIAR_ESTADO':
      return {
        ...state,
        lista: state.lista.map(item =>
          item.id === action.payload.id
            ? { ...item, estado: action.payload.estado }
            : item
        )
      }

    // Actualiza un filtro activo (categoría, estado o búsqueda)
    case 'FILTRAR':
      return { ...state, ...action.payload }

    // Resetea todos los filtros a sus valores iniciales
    case 'LIMPIAR_FILTROS':
      return {
        ...state,
        filtroCategoria: 'todas',
        filtroEstado: 'todos',
        busqueda: '',
      }

    // Agrega un registro de actividad al historial de un juego
    case 'REGISTRAR_ACTIVIDAD':
      return {
        ...state,
        lista: state.lista.map(item =>
          item.id === action.payload.itemId
            ? {
                ...item,
                atributos: {
                  ...item.atributos,
                  horasTotales: item.atributos.horasTotales + action.payload.valor
                },
                fechaActividad: action.payload.fecha,
              }
            : item
        )
      }

    default:
      return state
  }
}