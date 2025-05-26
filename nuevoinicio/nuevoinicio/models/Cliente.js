const mongoose = require("mongoose");

const clienteSchema = new mongoose.Schema({
  nombre: String,
  correo: String,
  telefono: String,
  // puedes añadir más campos si lo necesitas
});

module.exports = mongoose.model("Cliente", clienteSchema);

