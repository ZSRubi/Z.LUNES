const mongoose = require('mongoose');
const Property = require('./models/propiedadModel');
const User = require('./models/userModel');

// Genera un email único para cada prueba
const uniqueEmail = `test-${Date.now()}@example.com`;

mongoose.connect('mongodb://localhost:27017/Inmobiliaria1')
  .then(async () => {
    console.log("🟢 MongoDB conectado");
    
    try {
      console.log("⚠️ Creando usuario de prueba...");
      const testUser = await User.create({
        name: "Usuario Test",
        email: uniqueEmail,
        password: "123456"
      });

      const testProperty = await Property.create({
        address: "Prueba Script 456",
        type: "Oficina",
        price: 50000,
        createdBy: testUser._id
      });

      console.log("✅ Usuario creado:", testUser.email);
      console.log("✅ Propiedad creada:", testProperty);
    } catch (error) {
      console.error("🔴 Error durante la creación:", error.message);
    } finally {
      await mongoose.connection.close();
    }
  })
  .catch(err => {
    console.error("🔴 Error de conexión:", err);
    mongoose.connection.close();
  });