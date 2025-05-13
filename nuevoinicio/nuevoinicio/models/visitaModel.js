const mongoose = require('mongoose');

const visitaSchema = new mongoose.Schema({
  propiedad: {
    type: mongoose.Schema.Types.ObjectId, // Esto es importante si 'propiedad' es un ID de otra colección (como 'Propiedad')
    ref: 'Propiedad', // Referencia al modelo de 'Propiedad'
    required: true
  },
  fecha: {
    type: Date, 
    required: true
  },
  hora: {
    type: String,
    required: true
  },
  cliente: {
    type: mongoose.Schema.Types.ObjectId, // Referencia a la colección de 'Cliente'
    ref: 'Cliente', // Si existe el modelo de Cliente
    required: true
  },
  estado: {
    type: String,
    default: 'pendiente' // Estado inicial de la visita
  },
  creadoPor: {
    type: mongoose.Schema.Types.ObjectId, // Referencia a quien creó la visita (por ejemplo, un usuario admin)
    ref: 'Usuario',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Visita = mongoose.model('Visita', visitaSchema);

module.exports = Visita;
