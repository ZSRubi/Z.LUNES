const mongoose = require('mongoose');

const propiedadSchema = new mongoose.Schema({
  direccion: { type: String, required: true },
  tipo: { type: String, required: true, enum: ['Casa', 'Departamento'] },
  precio: { type: Number, required: true, min: 0 },
  fotoUrl: { type: String, default: '' },
  estado: { type: String, default: 'Publicado' }, // o 'Pendiente' etc.
  fechaCreacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Propiedad', propiedadSchema);
