const express = require("express");
const router = express.Router(); // <--- Asegúrate de tener esto

const Cliente = require("../models/Cliente"); // Ajusta el path si es necesario

// Ruta GET para obtener todos los clientes
router.get("/clientes", async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.json(clientes);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener clientes", error: err });
  }
});

module.exports = router;
