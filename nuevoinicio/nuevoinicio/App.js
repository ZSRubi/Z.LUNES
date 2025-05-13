
const express = require('express');
const path = require('path');
const http = require('http'); // 👈 necesario para Socket.IO
const socketIO = require('socket.io'); // 👈 importar socket.io
const connectDB = require('./database/connection');
const userRoutes = require('./routers/userRouters');
const propertyRoutes = require('./routers/propiedadRouters');
const mongoose = require('mongoose');  // Mueve esto arriba
const Message = mongoose.models.Message || mongoose.model('Message', require('./models/messageModel').messageSchema); // Corregir la forma en que se maneja el modelo
const app = express();
const server = http.createServer(app); // 👈 aquí creamos el servidor HTTP
const io = socketIO(server); // 👈 aquí montamos socket.io sobre ese servidor
const PORT = 3000;
const fetch = require('node-fetch');

// Conexión a la base de datos
connectDB();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Modelos
const visitaSchema = new mongoose.Schema({
  propiedad: String,
  fecha: Date,
  hora: String,
  agente: String,
  estado: { type: String, default: 'pendiente' },
  dashboardOrigin: String,
  fechaCreacion: { type: Date, default: Date.now }
});
const Visita = mongoose.model('Visita', visitaSchema);

const contratoSchema = new mongoose.Schema({
  property: String,
  client: String,
  type: String,
  start: Date,
  end: Date,
  price: String,
  contractId: String,
  clauses: String,
  createdAt: { type: Date, default: Date.now }
});
const ContractMongo = mongoose.model('Contract', contratoSchema);

// Rutas
app.use('/api/usuarios', userRoutes);
app.use('/api/properties', propertyRoutes);

app.post('/programar-visita', async (req, res) => {
  try {
    const { propiedadVisita, fechaVisita, horaVisita, clienteVisita } = req.body;
    const origin = req.query.origin || 'unknown';

    const nuevaVisita = new Visita({
      propiedad: propiedadVisita,
      fecha: new Date(fechaVisita),
      hora: horaVisita,
      cliente: clienteVisita,
      dashboardOrigin: origin,
      estado: 'pendiente',
      creadoPor: 'some_user_id'
    });

    await nuevaVisita.save();

    if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
      res.json({ success: true, message: 'Visita programada exitosamente' });
    } else {
      res.redirect(`/dashboard_cliente.html?visita=success`);
    }
  } catch (error) {
    console.error('Error al programar visita:', error);
    res.status(500).json({ error: 'Error al programar la visita' });
  }
});

app.post('/api/contracts', async (req, res) => {
  try {
    const { property, client, type, start, end, price, contractId, clauses } = req.body;

    const nuevoContrato = new ContractMongo({
      property,
      client,
      type,
      start: new Date(start),
      end: end ? new Date(end) : null,
      price,
      contractId,
      clauses: JSON.stringify(clauses)
    });

    await nuevoContrato.save();
    res.status(201).json({ success: true, message: 'Contrato guardado correctamente en MongoDB' });
  } catch (error) {
    console.error('Error al guardar contrato:', error);
    res.status(500).json({ success: false, message: 'Error al guardar el contrato' });
  }
});

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Verificar disponibilidad
app.get('/api/visitas/disponibilidad', async (req, res) => {
  try {
    const { fecha, hora, propiedad } = req.query;

    const visitaExistente = await Visita.findOne({
      propiedad: propiedad,
      fecha: new Date(fecha),
      hora: hora,
      estado: { $ne: 'cancelada' }
    });

    res.json({ disponible: !visitaExistente });
  } catch (error) {
    console.error('Error al verificar disponibilidad:', error);
    res.status(500).json({ error: 'Error al verificar disponibilidad' });
  }
});

// 👉 Cargar lógica del chat
require('./socket')(io); // tu archivo de sockets
// Ruta para interactuar con Ollama desde el frontend
// Ruta para interactuar con Ollama desde el frontend
// Ruta para interactuar con Ollama desde el frontend
app.post('/api/generate', async (req, res) => {
  const { model = 'llama2', prompt, stream = false } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'El prompt es obligatorio y debe ser texto' });
  }

  try {
    // Verificamos si Ollama está en funcionamiento
    const check = await fetch('http://localhost:11434');  // Aquí verificamos si Ollama responde
    if (!check.ok) throw new Error('Ollama no está disponible');

    // Enviar la petición a Ollama
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt, stream })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ollama respondió con error: ${errorText}`);
    }

    const data = await response.json();
    res.json(data);  // Enviar la respuesta de Ollama al frontend

  } catch (err) {
    console.error('❌ Error al conectar con Ollama:', err.message || err);
    res.status(500).json({ error: 'No se pudo obtener respuesta de Ollama' });
  }
});

// ✅ Iniciar servidor
server.listen(PORT, () => {
  console.log(`✅ Servidor con Socket.IO activo en http://localhost:${PORT}`);
});













//---------------------------------------------------
// const express = require('express');
// const path = require('path');
// const connectDB = require('./database/connection');
// const userRoutes = require('./routers/userRouters');

// const app = express();
// const PORT = 3000;

// connectDB();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use('/api/usuarios', userRoutes);


// app.use(express.static(path.join(__dirname, 'public')));

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public/index.html'));
// });

// app.listen(PORT, () => {
//   console.log(`✅ Servidor activo en http://localhost:${PORT}`);
// });



// // Agrega estas líneas donde configuras tus rutas
// const propertyRoutes = require('./routers/propiedadRouters');
// app.use('/api/properties', propertyRoutes);

// // Para servir archivos estáticos
// app.use('/uploads', express.static('uploads'));


//----------------------------------------------------------------------------
//----------------------------------------------------------------------------

// const express = require('express');
// const path = require('path');
// const http = require('http');
// const socketIo = require('socket.io');
// const connectDB = require('./database/connection');
// const userRoutes = require('./routers/userRouters');
// const Message = require('./models/Message');  // Asegúrate de importar el modelo de mensaje
// const app = express();
// const server = http.createServer(app);
// const PORT = 3000;
// const io = socketIo(server);

// connectDB();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use('/api/usuarios', userRoutes);

// // Configuración de Socket.io
// io.on('connection', (socket) => {
//   console.log('Nuevo usuario conectado:', socket.id);

//   let userRole = ''; // Role del usuario
//   let userId = '';   // ID del usuario

//   socket.on('set-role', (data) => {
//     userRole = data.role;
//     userId = data.id;
//     console.log(`${userRole} conectado con ID ${userId}`);
//   });

//   // Cuando se recibe un mensaje, lo redirige según el rol del remitente
//   socket.on('send-message', async (data) => {
//     const { message, isToAdmin } = data;
//     const newMessage = new Message({
//       from: userRole,
//       message,
//       timestamp: new Date()
//     });

//     // Guardar el mensaje en la base de datos
//     await newMessage.save();

//     // Emitir el mensaje a la sala correspondiente según el rol
//     if (userRole === 'cliente') {
//       // Cliente → Agente
//       io.to('agente-room').emit('new-message', newMessage);
//     } else if (userRole === 'agente') {
//       if (isToAdmin) {
//         // Agente → Administrador
//         io.to('administrador-room').emit('new-message', newMessage);
//       } else {
//         // Agente → Cliente
//         io.to('cliente-room').emit('new-message', newMessage);
//       }
//     } else if (userRole === 'administrador') {
//       // Administrador → Agente
//       io.to('agente-room').emit('new-message', newMessage);
//     }
//   });

//   // Cuando el usuario se desconecta
//   socket.on('disconnect', () => {
//     console.log(`${userRole} desconectado: ${socket.id}`);
//   });
// });

// app.use(express.static(path.join(__dirname, 'public')));

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public/index.html'));
// });

// // Cambia app.listen por server.listen
// server.listen(PORT, () => {
//   console.log(`✅ Servidor activo en http://localhost:${PORT}`);
// });

// // Rutas de propiedades
// const propertyRoutes = require('./routers/propiedadRouters');
// app.use('/api/properties', propertyRoutes);

// // Para servir archivos estáticos
// app.use('/uploads', express.static('uploads'));

//----------------------------------------------------------------------------
//--------------------------------sin socket io--------------------------------------------

// const express = require('express');
// const path = require('path');
// const connectDB = require('./database/connection');
// const userRoutes = require('./routers/userRouters');
// const Message = require('./models/Message');  // Asegúrate de importar el modelo de mensaje
// const app = express();
// const PORT = 3000;

// connectDB();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use('/api/usuarios', userRoutes);

// // Ruta principal
// app.use(express.static(path.join(__dirname, 'public')));

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public/index.html'));
// });

// // Rutas de propiedades
// const propertyRoutes = require('./routers/propiedadRouters');
// app.use('/api/properties', propertyRoutes);

// // Para servir archivos estáticos
// app.use('/uploads', express.static('uploads'));

// // Iniciar el servidor
// app.listen(PORT, () => {
//   console.log(`✅ Servidor activo en http://localhost:${PORT}`);
// });


//-------------------------------------GUARDA CONTRATO---------------------------------------
//----------------------------------------------------------------------------
// const express = require('express');
// const path = require('path');
// const connectDB = require('./database/connection');
// const userRoutes = require('./routers/userRouters');
// const Message = require('./models/Message');
// const mongoose = require('mongoose');
// const app = express();
// const PORT = 3000;

// // Conexión a la base de datos
// connectDB();

// // Middleware para parsear application/x-www-form-urlencoded
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// // Modelo de Visita (nuevo)
// const Visita = mongoose.model('Visita', new mongoose.Schema({
//   propiedad: String,
//   fecha: Date,
//   hora: String,
//   cliente: String,
//   dashboardOrigin: String,
//   fechaCreacion: { type: Date, default: Date.now }
// }));

// // Rutas existentes (sin cambios)
// app.use('/api/usuarios', userRoutes);

// // Rutas de propiedades
// const propertyRoutes = require('./routers/propiedadRouters');
// app.use('/api/properties', propertyRoutes);

// // Ruta para procesar el formulario (nueva)
// app.post('/programar-visita', async (req, res) => {
//   try {
//     const { propiedadVisita, fechaVisita, horaVisita, clienteVisita } = req.body;
//     const origin = req.query.origin || 'unknown';  // Obtenemos el origin de la URL

//     // Verificamos si los datos están llegando correctamente
//     console.log('Datos recibidos:', { propiedadVisita, fechaVisita, horaVisita, clienteVisita, origin });

//     const nuevaVisita = new Visita({
//       propiedad: propiedadVisita,
//       fecha: new Date(fechaVisita),  // Convertimos la fecha a tipo Date
//       hora: horaVisita,
//       cliente: clienteVisita,
//       dashboardOrigin: origin,
//       estado: 'pendiente',  // Estado por defecto
//       creadoPor: 'some_user_id'  // Esto debería ser el ID del usuario que está creando la visita
//     });

//     await nuevaVisita.save();

//     // Respuesta para redirección o AJAX
//     if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
//       res.json({ success: true, message: 'Visita programada exitosamente' });
//     } else {
//       res.redirect(`/dashboard_cliente.html?visita=success`);
//     }
    
//   } catch (error) {
//     console.error('Error al programar visita:', error);
//     res.status(500).json({ error: 'Error al programar la visita' });
//   }
// });

// // Archivos estáticos (sin cambios)
// app.use(express.static(path.join(__dirname, 'public')));
// app.use('/uploads', express.static('uploads'));

// // Ruta principal (sin cambios)
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public/index.html'));
// });

// app.listen(PORT, () => {
//   console.log(`✅ Servidor activo en http://localhost:${PORT}`);
// });

//-------------------CODIGO ANTES DEL CHAT-----------------------
// const express = require('express');
// const path = require('path');
// const connectDB = require('./database/connection');
// const userRoutes = require('./routers/userRouters');
// const Message = require('./models/Message');
// const mongoose = require('mongoose');
// const app = express();
// const PORT = 3000;

// // Conexión a la base de datos
// connectDB();

// // Middleware para parsear application/x-www-form-urlencoded
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// // Modelo de Visita (sin cambios)
// const visitaSchema = new mongoose.Schema({
//   propiedad: String,
//   fecha: Date,
//   hora: String,
//   agente: String,  // Cambiado de cliente a agente
//   estado: { type: String, default: 'pendiente' }, // pendiente, confirmada, realizada, cancelada
//   dashboardOrigin: String,
//   fechaCreacion: { type: Date, default: Date.now }
// });

// const Visita = mongoose.model('Visita', visitaSchema);

// // Modelo de Contrato (nuevo)
// const contratoSchema = new mongoose.Schema({
//   property: String,
//   client: String,
//   type: String,
//   start: Date,
//   end: Date,
//   price: String,
//   contractId: String,
//   clauses: String, // Almacenamos las cláusulas como texto (puedes modificar esto si son más complejas)
//   createdAt: { type: Date, default: Date.now }
// });

// const ContractMongo = mongoose.model('Contract', contratoSchema);

// // Rutas existentes (sin cambios)
// app.use('/api/usuarios', userRoutes);

// // Rutas de propiedades
// const propertyRoutes = require('./routers/propiedadRouters');
// app.use('/api/properties', propertyRoutes);

// // Ruta para procesar el formulario (nueva)
// app.post('/programar-visita', async (req, res) => {
//   try {
//     const { propiedadVisita, fechaVisita, horaVisita, clienteVisita } = req.body;
//     const origin = req.query.origin || 'unknown';  // Obtenemos el origin de la URL

//     // Verificamos si los datos están llegando correctamente
//     console.log('Datos recibidos:', { propiedadVisita, fechaVisita, horaVisita, clienteVisita, origin });

//     const nuevaVisita = new Visita({
//       propiedad: propiedadVisita,
//       fecha: new Date(fechaVisita),  // Convertimos la fecha a tipo Date
//       hora: horaVisita,
//       cliente: clienteVisita,
//       dashboardOrigin: origin,
//       estado: 'pendiente',  // Estado por defecto
//       creadoPor: 'some_user_id'  // Esto debería ser el ID del usuario que está creando la visita
//     });

//     await nuevaVisita.save();

//     // Respuesta para redirección o AJAX
//     if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
//       res.json({ success: true, message: 'Visita programada exitosamente' });
//     } else {
//       res.redirect(`/dashboard_cliente.html?visita=success`);
//     }
    
//   } catch (error) {
//     console.error('Error al programar visita:', error);
//     res.status(500).json({ error: 'Error al programar la visita' });
//   }
// });

// // Ruta para crear un contrato
// app.post('/api/contracts', async (req, res) => {
//   try {
//     const { property, client, type, start, end, price, contractId, clauses } = req.body;

//     // Crear un nuevo contrato en MongoDB
//     const nuevoContrato = new ContractMongo({
//       property,
//       client,
//       type,
//       start: new Date(start),
//       end: end ? new Date(end) : null,
//       price,
//       contractId,
//       clauses: JSON.stringify(clauses)  // Almacenamos como texto
//     });

//     await nuevoContrato.save();
//     res.status(201).json({ success: true, message: 'Contrato guardado correctamente en MongoDB' });
//   } catch (error) {
//     console.error('Error al guardar contrato:', error);
//     res.status(500).json({ success: false, message: 'Error al guardar el contrato' });
//   }
// });

// // Archivos estáticos (sin cambios)
// app.use(express.static(path.join(__dirname, 'public')));
// app.use('/uploads', express.static('uploads'));

// // Ruta principal (sin cambios)
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public/index.html'));
// });

// // Agrega esta ruta para verificar disponibilidad
// app.get('/api/visitas/disponibilidad', async (req, res) => {
//   try {
//     const { fecha, hora, propiedad } = req.query;
    
//     const visitaExistente = await Visita.findOne({
//       propiedad: propiedad,
//       fecha: new Date(fecha),
//       hora: hora,
//       estado: { $ne: 'cancelada' } // No considerar las canceladas
//     });
    
//     res.json({ disponible: !visitaExistente });
//   } catch (error) {
//     console.error('Error al verificar disponibilidad:', error);
//     res.status(500).json({ error: 'Error al verificar disponibilidad' });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`✅ Servidor activo en http://localhost:${PORT}`);
// });