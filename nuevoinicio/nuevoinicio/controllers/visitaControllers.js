// exports.crearVisita = async (req, res) => {
//     try {
//       const { propiedad, cliente, fecha, hora } = req.body;
      
//       const nuevaVisita = await Visita.create({
//         propiedad,
//         cliente,
//         fecha: new Date(fecha),
//         hora,
//         creadoPor: req.userId // Asume autenticación JWT
//       });
  
//       res.status(201).json({
//         message: 'Visita programada exitosamente',
//         visita: nuevaVisita
//       });
//     } catch (error) {
//       res.status(500).json({ 
//         error: 'Error al programar visita',
//         details: error.message 
//       });
//     }
//   };

// visitaControllers.js
exports.obtenerVisitas = async (req, res) => {
  try {
    const visitas = await Visita.find()
      .populate('propiedad', 'nombre direccion')
      .populate('cliente', 'nombre email')
      .sort({ fecha: 1 });

    res.status(200).json(visitas);
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al obtener visitas',
      details: error.message 
    });
  }
};

exports.actualizarEstadoVisita = async (req, res) => {
  try {
    const { visitaId } = req.params;
    const { estado } = req.body;

    const visitaActualizada = await Visita.findByIdAndUpdate(
      visitaId,
      { estado },
      { new: true }
    );

    res.status(200).json({
      message: 'Estado de visita actualizado',
      visita: visitaActualizada
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al actualizar visita',
      details: error.message 
    });
  }
};