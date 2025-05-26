
    const writeMessage = document.getElementById('writeMessage');
    const messages = document.getElementById('messages');

    function appendMessage(who, text, isUser) {
      const msgDiv = document.createElement('div');
      msgDiv.className = isUser ? 'user-message' : 'ia-message';
      msgDiv.textContent = `${who}: ${text}`;
      messages.appendChild(msgDiv);
      messages.scrollTop = messages.scrollHeight;
      return msgDiv; // Para poder quitar mensajes como "Escribiendo..."
    }

    writeMessage.addEventListener('keydown', async (e) => {
      if (e.code === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const userText = writeMessage.value.trim();
        if (!userText) return;

        appendMessage('Tú', userText, true);
        writeMessage.value = '';

        const typingIndicator = appendMessage('IA', 'Escribiendo...', false);

        function respuestaRapida(texto) {
          texto = texto.toLowerCase();
          if (texto.includes('propiedad')) {
            return 'Tenemos 3 propiedades disponibles: una casa en Miraflores, un departamento en Surco y un terreno en Pachacámac.';
          } else if (texto.includes('cliente')) {
            return 'Algunos clientes interesados son: 1. Lucía Fernández - 999888777 2. Juan Pérez - 987654321 3. Ana Torres - 912345678';
          } else if (texto.includes('agente')) {
            return 'Los agentes disponibles son: Carlos Méndez (especialista en ventas) y María López (alquileres y contratos).';
          }
          return null;
        }

        try {
          const respuestaLocal = respuestaRapida(userText);

          if (respuestaLocal) {
            messages.removeChild(typingIndicator);
            appendMessage('IA', respuestaLocal, false);
          } else {
            const systemInstruction = `
Eres un asistente especializado exclusivamente en temas inmobiliarios. 
Responde siempre como si tuvieras datos reales de propiedades, clientes y agentes.
Si no tienes datos concretos, inventa respuestas plausibles y creíbles para que la conversación continúe.
Nunca digas que no sabes o que no tienes información.
            `;

            const fullPrompt = `${systemInstruction}\nPregunta: ${userText}`;

            const response = await fetch('http://localhost:3000/api/generate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                model: 'llama2',
                prompt: fullPrompt,
                stream: false,
              }),
            });

            if (!response.ok) {
              const error = await response.text();
              throw new Error(error || `Error HTTP: ${response.status}`);
            }

            const data = await response.json();
            const aiText = data.response || 'No obtuve respuesta';

            messages.removeChild(typingIndicator);
            appendMessage('IA', aiText, false);
          }
        } catch (err) {
          messages.removeChild(typingIndicator);
          appendMessage('IA', 'Error: No se pudo conectar con el servidor', false);
          console.error(err);
        }
      }
    });