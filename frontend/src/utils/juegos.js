// Esta función "construye" un objeto juego con todos los campos que el proyecto requiere

export function crearJuego({ nombre, categoriaId, plataforma = '', horas = 0, genero = '', imagen = '' }) {
  return {
    id: crypto.randomUUID(),        // ID único generado por el sistema
    nombre: nombre.trim(),
    categoriaId,                    // Categoría a la que pertenece (género del videojuego)
    estado: 'pendiente',            // pendiente | jugando | completado | abandonado
    puntuacion: null,               // calificación dada por el usuario que lo jugó (empieza sin calificación)
    fechaRegistro: new Date().toISOString(),   // fecha en que se agregó al sistema
    fechaActividad: new Date().toISOString(),  // fecha de la última vez que se jugó
    notas: '',
    imagen,                         // URL de la imagen del videojuego
    atributos: {                    // información adicional del videojuego
      plataforma,                   // PC, PS5, Switch, etc.
      horasTotales: horas,
      genero,
    },
    activo: true,                   // true = visible, false = archivado
  }
}