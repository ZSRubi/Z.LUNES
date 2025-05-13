// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   nombre: String,
//   correo: { type: String, unique: true },
//   password: String,
//   rol: String // admin, agente, cliente
// });

// // Agrega esto al schema de usuario
// userSchema.virtual('properties', {
//   ref: 'Propiedad',
//   localField: '_id',
//   foreignField: 'createdBy'
// });

// module.exports = mongoose.model('Usuario', userSchema);

// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: String,
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     validate: {
//       validator: function(v) {
//         return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Validación de email
//       },
//       message: props => `${props.value} no es un email válido!`
//     }
//   },
//   password: {
//     type: String,
//     required: true
//   }
// }, { 
//   timestamps: true // Añade createdAt y updatedAt automáticamente
// });

// module.exports = mongoose.model('User', userSchema);
// define como se guarda los datos al mongodb
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true
  },
  correo: {
    type: String,
    required: [true, 'El correo es requerido'],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida']
  },
  rol: {
    type: String,
    enum: ['admin', 'agente', 'cliente'],
    default: 'cliente'
  }
}, {
  timestamps: true, // Crea createdAt y updatedAt automáticamente
  collection: 'usuarios' // Fuerza el nombre de la colección
});

// Limpia los datos antes de convertirlos a JSON
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

// Virtual para propiedades
userSchema.virtual('propiedades', {
  ref: 'Propiedad',
  localField: '_id',
  foreignField: 'createdBy'
});

module.exports = mongoose.model('Usuario', userSchema);