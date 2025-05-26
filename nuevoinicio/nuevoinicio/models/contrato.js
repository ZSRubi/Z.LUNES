const mongoose = require('mongoose');

const contratoSchema = new mongoose.Schema({
  cliente: { type: String, required: true },
  propiedad: { type: String, required: true },
  fechaFirma: { type: Date, required: true },
  duracion: { type: Number, required: true }
});

module.exports = mongoose.model('Contrato', contratoSchema);
