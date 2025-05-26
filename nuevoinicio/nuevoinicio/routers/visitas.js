const express = require('express');
const router = express.Router();
const Visita = require('../models/Visita');

// Crear una nueva visita
router.post('/', async (req, res) => {
  try {
    const nuevaVisita = new Visita(req.body);
    await nuevaVisita.save();
    res.status(201).json(nuevaVisita);
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar visita' });
  }
});

// Obtener todas las visitas
router.get('/', async (req, res) => {
  try {
    const visitas = await Visita.find();
    res.json(visitas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener visitas' });
  }
});
router.delete('/api/visitas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await Visita.findByIdAndDelete(id);
    if (!eliminado) {
      return res.status(404).json({ message: 'Visita no encontrada' });
    }
    res.status(200).json({ message: 'Visita eliminada' });
  } catch (error) {
    console.error('Error eliminando visita:', error);
    res.status(500).json({ message: 'Error al eliminar la visita' });
  }
});

module.exports = router; // ✅ Exportar correctamente
