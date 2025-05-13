const Usuario = require('../models/userModel');

const registrar = async (req, res) => {
  try {
    const { nombre, correo, password, rol } = req.body;

    const existe = await Usuario.findOne({ correo });
    if (existe) return res.status(400).json({ message: 'Correo ya registrado' });

    const nuevoUsuario = new Usuario({ nombre, correo, password, rol });
    await nuevoUsuario.save();

    res.status(200).json({ message: 'Usuario registrado correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    const usuario = await Usuario.findOne({ correo });
    if (!usuario || usuario.password !== password) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      rol: usuario.rol,
      nombre: usuario.nombre,
      correo: usuario.correo,
      id: usuario._id.toString() 
    });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = { registrar, login };

