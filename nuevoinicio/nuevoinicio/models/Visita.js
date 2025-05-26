// models/Visita.js
const mongoose = require('mongoose');

const visitaSchema = new mongoose.Schema({
  cliente: String,
  propiedad: String,
  fechaVisita: Date,
  comentario: String,
  fechaCreacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Visita', visitaSchema);
