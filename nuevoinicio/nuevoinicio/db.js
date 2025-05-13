// db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Cargar variables del archivo .env

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error.message);
    process.exit(1); // Detener el servidor si no se conecta a la base de datos
  }
};

module.exports = connectDB;
