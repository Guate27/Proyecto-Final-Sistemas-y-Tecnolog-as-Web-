// Estado inicial del reducer
// Contiene la lista de juegos y los filtros actualmente aplicados
export const initialState = {
  lista: [],
  filtroCategoria: 'todas',
  filtroEstado: 'todos',
  busqueda: '',
}

// Reducer que maneja todas las acciones sobre la lista de juegos y los filtros
// Siempre devuelve un nuevo estado sin modificar el anterior
export function itemsReducer(state, action) {
  switch (action.type) {

    // Carga inicial de juegos desde la API o LocalStorage
    case 'HIDRATAR':
      return { ...state, lista: action.payload }

    // Agrega un juego nuevo al array y le pone fechaActividad actual
    // Esto hace que el juego aparezca al inicio del orden por interacción
    case 'AGREGAR':
      return {
        ...state,
        lista: [
          ...state.lista,
          { ...action.payload, fechaActividad: new Date().toISOString() }
        ]
      }

    // Elimina un juego del array según su id
    case 'ELIMINAR':
      return {
        ...state,
        lista: state.lista.filter(item => item.id !== action.payload)
      }

    // Cambia el estado de un juego (pendiente, jugando, completado, abandonado)
    // Actualiza fechaActividad para que el juego suba al inicio del orden
    case 'CAMBIAR_ESTADO':
      return {
        ...state,
        lista: state.lista.map(item =>
          item.id === action.payload.id
            ? {
                ...item,
                estado: action.payload.estado,
                fechaActividad: new Date().toISOString()
              }
            : item
        )
      }
      
    // Reemplaza un juego existente con su versión actualizada desde el modal
    case 'EDITAR':
      return {
        ...state,
        lista: state.lista.map(item =>
          item.id === action.payload.id ? action.payload : item
        )
      }  

    // Actualiza uno o varios filtros a la vez (categoría, estado o búsqueda)
    case 'FILTRAR':
      return { ...state, ...action.payload }

    // Restaura todos los filtros a sus valores iniciales
    case 'LIMPIAR_FILTROS':
      return {
        ...state,
        filtroCategoria: 'todas',
        filtroEstado: 'todos',
        busqueda: '',
      }

    // Suma horas al campo horasTotales de un juego y actualiza su fechaActividad
    // Usa spread en dos fases para no mutar el objeto anidado de atributos
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