const Usuario = require('../models/userModel');

const crearUsuario = async (datos) => {
  const nuevo = new Usuario(datos);
  return await nuevo.save();
};

const buscarPorCorreo = async (correo) => {
  return await Usuario.findOne({ correo });
};

module.exports = { crearUsuario, buscarPorCorreo };
