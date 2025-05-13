const Property = require('../models/propiedadModel');
const fs = require('fs');
const path = require('path');

exports.createProperty = async (req, res) => {
  try {
    const { address, type, price } = req.body;
    
    // Procesar imágenes subidas
    const photos = req.files.map(file => {
      return `/uploads/${file.filename}`; // Cambiar por Cloudinary/S3 en producción
    });

    const newProperty = new Property({
      address,
      type,
      price,
      photos,
      createdBy: req.userId // Asume que tienes middleware de autenticación
    });

    await newProperty.save();
    res.status(201).json(newProperty);
    
  } catch (error) {
    // Limpiar archivos subidos si hay error
    req.files.forEach(file => fs.unlinkSync(file.path));
    res.status(500).json({ error: error.message });
  }
};