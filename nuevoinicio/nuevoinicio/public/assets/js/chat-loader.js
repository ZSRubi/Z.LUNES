// Crea los elementos del chat
const chatContainer = document.createElement('div');
chatContainer.id = 'inmobot-container';
chatContainer.innerHTML = `
  <div id="inmobot-header">
    <span>Asistente Inmobiliario</span>
    <button id="inmobot-minimize">−</button>  <!-- Cambiado a minimize -->
  </div>
  <div id="inmobot-messages"></div>
  <div id="inmobot-input-area">
    <input type="text" id="inmobot-input" placeholder="Escribe tu consulta...">
    <button id="inmobot-send">➤</button>
  </div>
`;

// Estilos dinámicos
const style = document.createElement('style');
style.textContent = `
  #inmobot-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 320px;
    max-width: calc(100% - 40px);
    height: 400px;
    max-height: 70vh;
    background: #2d3436;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    display: flex;
    flex-direction: column;
    z-index: 1000;
    font-family: Arial, sans-serif;
    overflow: hidden;
    transform: translateY(20px);
    opacity: 0;
    transition: all 0.3s ease;
  }
  
  #inmobot-container.show {
    transform: translateY(0);
    opacity: 1;
  }
  #inmobot-container.minimized {
    height: 40px !important;
    width: 150px !important;
  }
  
  #inmobot-container.minimized #inmobot-messages,
  #inmobot-container.minimized #inmobot-input-area {
    display: none;
  }
  
  #inmobot-minimize {
    background: none;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    line-height: 0.5;
    padding: 0 8px 5px 8px;
  }
  #inmobot-header {
    background: #636e72;
    color: white;
    padding: 12px 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
  }
  
  #inmobot-close {
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
    line-height: 1;
  }
  
  #inmobot-messages {
    flex: 1;
    padding: 15px;
    overflow-y: auto;
    background: #dfe6e9;
  }
  
  .inmobot-message {
    margin-bottom: 10px;
    max-width: 80%;
    padding: 8px 12px;
    border-radius: 15px;
    line-height: 1.4;
    word-wrap: break-word;
  }
  
  .user-message {
    background: #fdcb6e;
    margin-left: auto;
    border-bottom-right-radius: 3px;
  }
  
  .bot-message {
    background: white;
    margin-right: auto;
    border-bottom-left-radius: 3px;
  }
  
  #inmobot-input-area {
    display: flex;
    padding: 10px;
    background: #2d3436;
    border-top: 1px solid #636e72;
  }
  
  #inmobot-input {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 20px;
    margin-right: 8px;
  }
  
  #inmobot-send {
    background: #e17055;
    color: white;
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    cursor: pointer;
    transition: background 0.2s;
  }
  
  #inmobot-send:hover {
    background: #fdcb6e;
  }
  
  @media (max-width: 480px) {
    #inmobot-container {
      width: 90%;
      right: 5%;
      bottom: 10px;
    }
  }
`;

// Añade al documento
document.head.appendChild(style);
document.body.appendChild(chatContainer);

// Lógica del chatbot
const messagesContainer = document.getElementById('inmobot-messages');
const userInput = document.getElementById('inmobot-input');
const sendButton = document.getElementById('inmobot-send');
const minimizeButton = document.getElementById('inmobot-minimize');
let isMinimized = false;

// Funciones auxiliares primero
function addBotMessage(text) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'inmobot-message bot-message';
  messageDiv.textContent = text;
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function addUserMessage(text) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'inmobot-message user-message';
  messageDiv.textContent = text;
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function getResponse(userText) {
  userText = userText.toLowerCase();
  for (const [key, value] of Object.entries(responses)) {
    if (userText.includes(key)) {
      return value[Math.floor(Math.random() * value.length)];
    }
  }
  return responses.default[Math.floor(Math.random() * responses.default.length)];
}

// Event listeners
minimizeButton.addEventListener('click', () => {
  if (isMinimized) {
    // Restaurar
    chatContainer.style.height = '400px';
    chatContainer.style.width = '320px';
    minimizeButton.textContent = '−';
    document.getElementById('inmobot-messages').style.display = 'block';
    document.getElementById('inmobot-input-area').style.display = 'flex';
  } else {
    // Minimizar
    chatContainer.style.height = '40px';
    chatContainer.style.width = '150px';
    minimizeButton.textContent = '+';
    document.getElementById('inmobot-messages').style.display = 'none';
    document.getElementById('inmobot-input-area').style.display = 'none';
  }
  isMinimized = !isMinimized;
});

sendButton.addEventListener('click', () => {
  const message = userInput.value.trim();
  if (message) {
    addUserMessage(message);
    userInput.value = '';
    setTimeout(() => {
      addBotMessage(getResponse(message));
    }, 800);
  }
});

userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendButton.click();
  }
});

// Respuestas predefinidas
const responses = {
    'hola': [
      '¡Hola! Bienvenido a Inmobiliaria Dorada. ¿En qué podemos ayudarte hoy?',
      '¡Buen día! ¿Estás buscando comprar, vender o alquilar una propiedad?',
      'Hola, soy tu asistente virtual. ¿Necesitas información sobre propiedades?'
    ],

    'sí': [
    '¡Genial! ¿Estás interesado en comprar, vender o alquilar una propiedad?',
    '¡Perfecto! ¿Qué opción te interesa más: comprar, vender o alquilar?',
    '¡Claro! ¿Quieres empezar con la compra, venta o alquiler de propiedades?'
     ],
    
    'propiedad|propiedades|casa|departamento|local': [
      'Tenemos excelentes opciones disponibles. ¿Buscas residencial o comercial?',
      'Contamos con casas, departamentos y locales comerciales. ¿Qué te interesa?',
      '¿Prefieres propiedad nueva o usada? Tenemos ambas opciones disponibles.'
    ],
    
    'comprar|adquirir|inversión': [
      'Excelente decisión. ¿Qué tipo de propiedad buscas para inversión?',
      'Tenemos propiedades con gran potencial de revalorización. ¿Qué presupuesto manejas?',
      '¿Te interesaría conocer nuestras promociones exclusivas para compradores?'
    ],
    
    'vender|vendo|valor': [
      'Podemos hacer una valoración gratuita de tu propiedad. ¿En qué zona está ubicada?',
      'Nuestro equipo de ventas puede maximizar el valor de tu propiedad. ¿Quieres agendar una cita?',
      'Tenemos compradores activos buscando propiedades. ¿Cuándo podemos visitar la tuya?'
    ],
    
    'alquilar|rentar|arrendar': [
      'Ofrecemos opciones de alquiler residencial y comercial. ¿Qué tipo de espacio necesitas?',
      '¿Buscas alquiler a corto o largo plazo? Tenemos flexibilidad en contratos.',
      'Nuestros alquileres incluyen mantenimiento básico. ¿Qué tamaño de propiedad necesitas?'
    ],
    
    'precio|costó|presupuesto': [
      'Los precios varían según ubicación y características. ¿Tienes un rango específico?',
      'Tenemos propiedades desde $150,000 hasta $2,500,000. ¿Qué rango te interesa?',
      '¿Qué características prioritarias buscas? Así puedo darte un rango de precio más exacto.'
    ],
    
    'ubicación|zona|donde': [
      'Trabajamos en las mejores zonas de la ciudad. ¿Prefieres área residencial o céntrica?',
      'Tenemos propiedades en zonas premium con alta plusvalía. ¿Buscas cerca de algún lugar específico?',
      '¿Qué es más importante para ti: cercanía a servicios, transporte o tranquilidad?'
    ],
    
    'contacto|hablar|asesor': [
      'Puedes contactar a nuestro equipo al 555-1234 o visitar nuestra oficina en Calle Principal 123.',
      'Nuestro correo es info@inmobiliaria.com. ¿Prefieres contacto por WhatsApp?',
      'Te puedo conectar con un asesor especializado. ¿Es para compra, venta o alquiler?'
    ],
    
    'servicios|qué hacen|qué ofrecen': [
      'Ofrecemos: compra/venta, alquileres, valoraciones, gestión de hipotecas y asesoría legal.',
      'Nuestros servicios incluyen tours virtuales, gestión documental y acompañamiento completo.',
      'Además de intermediación, ofrecemos decoración profesional para tus espacios.'
    ],
    
    'promoción|descuento|oferta': [
      'Actualmente tenemos 10% de descuento en comisiones para primeras compras.',
      '¡Oferta especial! Propiedades seleccionadas con financiamiento directo sin intereses.',
      'Este mes tenemos promoción en departamentos nuevos: estacionamiento incluido.'
    ],
    
    'visitar|ver|agendar': [
      'Podemos agendar una visita hoy mismo. ¿Qué horario te funciona mejor?',
      'Ofrecemos tours virtuales o presenciales. ¿Cuál prefieres?',
      'Nuestro horario de visitas es de 9am a 6pm. ¿Qué día te viene bien?'
    ],
  
    };
  

// Mostrar mensaje inicial después de 1 segundo
setTimeout(() => {
    addBotMessage('¡Hola! Soy tu asistente inmobiliario. ¿En qué puedo ayudarte?');
    chatContainer.classList.add('show');
  }, 1000);

