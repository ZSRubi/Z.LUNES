const writeMessage = document.getElementById('writeMessage');
const messages = document.getElementById('messages');

writeMessage.addEventListener('keydown', async (e) => {
  if (e.code === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    const userText = writeMessage.value.trim();
    if (!userText) return;

    appendMessage('Tú', userText);
    writeMessage.value = '';
    const typingIndicator = appendMessage('IA', 'Escribiendo...');

    try {
      const response = await fetch(
        `https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium`,
        {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer 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', // Tu clave real
            'Content-Type': 'application/json',
            'x-wait-for-model': 'true'
          },
          body: JSON.stringify({ inputs: userText })
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('Respuesta de la IA:', data); // Verifica la estructura

      const aiText = data.generated_text || 'No obtuve respuesta';
      
      messages.removeChild(typingIndicator);
      appendMessage('IA', aiText);

    } catch (err) {
      messages.removeChild(typingIndicator);
      appendMessage('IA', 'Error: El modelo no está disponible');
      console.error('Error completo:', err);
    }
  }
});

function appendMessage(sender, text) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.textContent = `${sender}: ${text}`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
  return div;
}
