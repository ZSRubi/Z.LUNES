const mongoose = require('mongoose');
const Visita = require('./models/visitaModel');
const Property = require('./models/propiedadModel');
const User = require('./models/userModel');

// Genera un ID único para pruebas
const testId = Date.now();

mongoose.connect('mongodb://localhost:27017/Inmobiliaria1')
  .then(async () => {
    console.log("🟢 MongoDB conectado");
    
    try {
      // 1. Crear usuarios de prueba (cliente y agente)
      const [cliente, agente] = await Promise.all([
        User.create({
          name: `Cliente Test ${testId}`,
          email: `cliente-${testId}@example.com`,
          password: "123456"
        }),
        User.create({
          name: `Agente Test ${testId}`,
          email: `agente-${testId}@example.com`,
          password: "123456",
          rol: "agente" // Asegúrate que tu modelo User soporte este campo
        })
      ]);

      // 2. Crear propiedad de prueba
      const propiedad = await Property.create({
        address: `Calle Prueba ${testId}`,
        type: "Casa",
        price: 250000,
        createdBy: agente._id // Usamos al agente como creador
      });

      // 3. Crear visita con TODOS los campos requeridos
      const visita = await Visita.create({
        propiedad: propiedad._id,
        cliente: cliente._id,
        fecha: new Date(Date.now() + 86400000), // Fecha de mañana
        hora: '10:00',
        creadoPor: agente._id // ¡Este es el campo que faltaba!
      });

      console.log("✅ Visita creada exitosamente:", visita);
      
    } catch (error) {
      console.error("🔴 Error:", error.message);
    } finally {
      await mongoose.connection.close();
    }
  })
  .catch(err => {
    console.error("🔴 Error de conexión:", err);
    mongoose.connection.close();
  });