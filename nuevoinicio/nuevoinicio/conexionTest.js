const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Conexión a MongoDB exitosa');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ Error al conectar a MongoDB:', err);
  });
