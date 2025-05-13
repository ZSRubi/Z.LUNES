const writeMessage = document.getElementById('writeMessage');
const messages = document.getElementById('messages');

writeMessage.addEventListener('keydown', async (e) => {
  if (e.code === 'Enter' && !e.shiftKey) {
    e.preventDefault(); // Evita el salto de línea
    const userText = writeMessage.value.trim();
    if (!userText) return; // Si no hay texto, no hace nada

    appendMessage('Tú', userText, true);  // Agregar mensaje del usuario
    writeMessage.value = ''; // Limpiar el input

    const typingIndicator = appendMessage('IA', 'Escribiendo...', false); // Indicador de escritura de la IA

    try {
      // Hacer la petición al backend
      const response = await fetch('http://localhost:3000/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama2',
          prompt: userText,
          stream: false,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      const aiText = data.response || 'No obtuve respuesta';

      messages.removeChild(typingIndicator); // Eliminar el indicador de "Escribiendo..."
      appendMessage('IA', aiText, false);  // Mostrar respuesta de la IA

    } catch (err) {
      messages.removeChild(typingIndicator);
      appendMessage('IA', 'Error: No se pudo conectar con el servidor', false);
    }
  }
});

function appendMessage(sender, text, isUser) {
  const div = document.createElement('div');
  div.classList.add('message');
  if (isUser) div.classList.add('user');  // Estilo para mensajes del usuario

  const avatar = document.createElement('img');
  avatar.classList.add('avatar');
  avatar.src = isUser ? '/assets/images/q1.jpg' : '/assets/images/q2.jpg'; // Ruta de los avatares

  const textContainer = document.createElement('div');
  textContainer.classList.add('text');
  textContainer.textContent = `${sender}: ${text}`;

  div.appendChild(avatar);
  div.appendChild(textContainer);
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;  // Mantener el scroll en la parte inferior

  return div;
}

  
