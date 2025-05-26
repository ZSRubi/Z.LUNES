const express = require('express');
const router = express.Router();
const Propiedad = require('../models/Propiedad');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración Multer para subir imágenes a carpeta /uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

const upload = multer({ storage });

// GET todas las propiedades
router.get('/', async (req, res) => {
  try {
    const propiedades = await Propiedad.find();
    res.json(propiedades);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener propiedades' });
  }
});

// POST crear propiedad con foto opcional
router.post('/', upload.single('foto'), async (req, res) => {
  try {
    const { direccion, tipo, precio } = req.body;
    let fotoUrl = '';
    if (req.file) {
      fotoUrl = `/uploads/${req.file.filename}`; // URL relativa para frontend
    }
    const nuevaPropiedad = new Propiedad({ direccion, tipo, precio, fotoUrl });
    await nuevaPropiedad.save();
    res.status(201).json(nuevaPropiedad);
  } catch (err) {
    res.status(400).json({ error: 'Error al crear propiedad' });
  }
});

// PUT actualizar propiedad (sin cambiar foto)
router.put('/:id', async (req, res) => {
  try {
    const { direccion, tipo, precio, estado } = req.body;
    const propiedad = await Propiedad.findById(req.params.id);
    if (!propiedad) return res.status(404).json({ error: 'Propiedad no encontrada' });

    propiedad.direccion = direccion || propiedad.direccion;
    propiedad.tipo = tipo || propiedad.tipo;
    propiedad.precio = precio || propiedad.precio;
    propiedad.estado = estado || propiedad.estado;

    await propiedad.save();
    res.json(propiedad);
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar propiedad' });
  }
});

// DELETE eliminar propiedad (y borrar archivo de foto si existe)
router.delete('/:id', async (req, res) => {
  try {
    const propiedad = await Propiedad.findById(req.params.id);
    if (!propiedad) return res.status(404).json({ error: 'Propiedad no encontrada' });

    // Borrar archivo de foto si existe
    if (propiedad.fotoUrl) {
      const filePath = path.join(__dirname, '..', propiedad.fotoUrl);
      fs.unlink(filePath, (err) => {
        if (err) console.log('Error al borrar imagen:', err);
      });
    }

    await propiedad.deleteOne();
    res.json({ message: 'Propiedad eliminada' });
  } catch (err) {
    res.status(400).json({ error: 'Error al eliminar propiedad' });
  }
});
// En routers/propiedades.js agrega este endpoint:
router.get('/:id', async (req, res) => {
  try {
    const propiedad = await Propiedad.findById(req.params.id);
    if (!propiedad) return res.status(404).json({ error: 'Propiedad no encontrada' });
    res.json(propiedad);
  } catch (err) {
    res.status(400).json({ error: 'Error al obtener propiedad' });
  }
});
// Eliminar propiedad por ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Propiedad.findByIdAndDelete(id);
    res.json({ mensaje: 'Propiedad eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar propiedad' });
  }
});

module.exports = router;
