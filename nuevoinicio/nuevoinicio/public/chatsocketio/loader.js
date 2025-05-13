// (function() {
//     const iframe = document.createElement('iframe');
//     iframe.src = 'http://localhost:3000/chatsocketio/chat.html'; // Ruta donde se encuentra tu chat
//     iframe.style.position = 'fixed';
//     iframe.style.bottom = '20px';
//     iframe.style.right = '20px';
//     iframe.style.width = '320px';
//     iframe.style.height = '450px';
//     iframe.style.border = 'none';
//     iframe.style.zIndex = '9999';
//     iframe.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
//     document.body.appendChild(iframe);
//   })();
(function() {
    // Crear contenedor principal
    const chatWidget = document.createElement('div');
    chatWidget.id = 'chat-widget';
    chatWidget.style.position = 'fixed';
    chatWidget.style.bottom = '0';
    chatWidget.style.right = '0';
    chatWidget.style.zIndex = '9999';
    
    // Crear iframe (ahora sin bordes ni espacios)
    const iframe = document.createElement('iframe');
    iframe.src = 'http://localhost:3000/chatsocketio/chat.html';
    iframe.style.width = '320px';
    iframe.style.height = '450px';
    iframe.style.border = 'none';
    iframe.style.margin = '0';
    iframe.style.padding = '0';
    iframe.style.display = 'block';
    iframe.style.backgroundColor = 'transparent';
    
    // Botón de minimizado (ahora externo al iframe)
    const bubbleBtn = document.createElement('div');
    bubbleBtn.id = 'chat-bubble';
    bubbleBtn.style.display = 'none';
    bubbleBtn.style.width = '60px';
    bubbleBtn.style.height = '60px';
    bubbleBtn.style.borderRadius = '50%';
    bubbleBtn.style.backgroundColor = '#D4AF37';
    bubbleBtn.style.position = 'fixed';
    bubbleBtn.style.bottom = '20px';
    bubbleBtn.style.right = '20px';
    bubbleBtn.style.zIndex = '9999';
    bubbleBtn.style.cursor = 'pointer';
    bubbleBtn.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
    bubbleBtn.innerHTML = '+';
    bubbleBtn.style.textAlign = 'center';
    bubbleBtn.style.lineHeight = '60px';
    bubbleBtn.style.fontSize = '24px';
    bubbleBtn.style.color = '#000';
    
    // Añadir elementos al DOM
    chatWidget.appendChild(iframe);
    document.body.appendChild(chatWidget);
    document.body.appendChild(bubbleBtn);
    
    // Comunicación entre ventanas
    window.addEventListener('message', function(e) {
      if (e.data.action === 'minimize') {
        iframe.style.display = 'none';
        bubbleBtn.style.display = 'block';
      } else if (e.data.action === 'expand') {
        iframe.style.display = 'block';
        bubbleBtn.style.display = 'none';
      }
    });
    
    // Click en la burbuja
    bubbleBtn.addEventListener('click', function() {
      iframe.style.display = 'block';
      bubbleBtn.style.display = 'none';
      // Enviar mensaje al iframe para expandir
      iframe.contentWindow.postMessage({ action: 'expand' }, '*');
    });
  })();