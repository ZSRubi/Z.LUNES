const express = require('express');
const router = express.Router();
const Contrato = require('../models/contrato');

// Crear contrato
router.post('/', async (req, res) => {
  try {
    const { cliente, propiedad, fechaFirma, duracion } = req.body;
    const nuevoContrato = new Contrato({ cliente, propiedad, fechaFirma, duracion });
    const contratoGuardado = await nuevoContrato.save();
    res.status(201).json(contratoGuardado);
  } catch (error) {
    console.error('Error al guardar contrato:', error);
    res.status(500).json({ error: 'Error al guardar contrato' });
  }
});

// Obtener todos los contratos
router.get('/', async (req, res) => {
  try {
    const contratos = await Contrato.find();
    res.json(contratos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener contratos' });
  }
});

// Eliminar contrato
router.delete('/:id', async (req, res) => {
  try {
    await Contrato.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Contrato eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar contrato' });
  }
});

module.exports = router;
