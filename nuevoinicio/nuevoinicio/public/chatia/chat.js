const writeMessage = document.getElementById('writeMessage');
const messages = document.getElementById('messages');

writeMessage.addEventListener('keydown', async (e) => {
  if (e.code === 'Enter' && !e.shiftKey) {
    e.preventDefault(); // Evita que el Enter haga un salto de línea
    const userText = writeMessage.value.trim();
    if (!userText) return; // Evita enviar texto vacío

    appendMessage('Tú', userText);  // Agrega el mensaje del usuario
    writeMessage.value = ''; // Limpia el input
    const typingIndicator = appendMessage('IA', 'Escribiendo...'); // Muestra el indicador de escritura de la IA

    try {
      // Hacer la petición al backend (puerto 3000 donde está Express)
      const response = await fetch('http://localhost:3000/api/generate', {  // Cambié el puerto a 3000
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama2',  // El modelo que estás usando
          prompt: userText,  // El texto del usuario
          stream: false  // Cambiar a true si quieres streaming de respuesta
        })
      });

      if (!response.ok) {  // Si la respuesta no es correcta
        const error = await response.text();
        throw new Error(error || `Error HTTP: ${response.status}`);
      }

      const data = await response.json();  // Obtener la respuesta de la IA
      console.log('Respuesta de tu servidor proxy:', data);

      // En caso de que no haya respuesta, mostrar un mensaje por defecto
      const aiText = data.response || 'No obtuve respuesta';
      messages.removeChild(typingIndicator);  // Remueve el indicador de "Escribiendo..."
      appendMessage('IA', aiText);  // Muestra la respuesta de la IA

    } catch (err) {
      // Si hay un error, muestra el error y remueve el indicador
      messages.removeChild(typingIndicator);
      appendMessage('IA', 'Error: No se pudo conectar con el servidor');
      console.error('Error completo:', err);
    }
  }
});

function appendMessage(sender, text) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.textContent = `${sender}: ${text}`;  // Muestra el mensaje con el nombre del remitente
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;  // Desplaza el scroll hacia abajo
  return div;
}
