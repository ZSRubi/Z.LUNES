// Importa las dependencias necesarias
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Crea una instancia de la aplicación Express
const app = express();

// Crea el servidor HTTP y lo integra con Socket.IO
const server = http.createServer(app);
const io = socketIo(server);

// Maneja las conexiones de los clientes
io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado: ' + socket.id);

  // Emite un mensaje al cliente
  socket.emit('mensaje', '¡Hola desde el servidor!');

  // Escucha un evento llamado 'enviarMensaje' desde el cliente
  socket.on('enviarMensaje', (data) => {
    console.log('Mensaje recibido desde el cliente: ', data);
    // Enviar un mensaje de vuelta al cliente
    socket.emit('mensaje', 'Mensaje recibido: ' + data);
  });

  // Maneja la desconexión del cliente
  socket.on('disconnect', () => {
    console.log('Un cliente se ha desconectado: ' + socket.id);
  });
});

// Inicia el servidor en el puerto 3000
server.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});
