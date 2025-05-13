(function () {
  const bubble = document.createElement('div');
  bubble.id = 'chat-ai-bubble';
  bubble.style.position = 'fixed';
  bubble.style.bottom = '100px';
  bubble.style.right = '20px';
  bubble.style.width = '60px';
  bubble.style.height = '60px';
  bubble.style.borderRadius = '50%';
  bubble.style.backgroundColor = '#111';
  bubble.style.color = '#fff';
  bubble.style.display = 'flex';
  bubble.style.alignItems = 'center';
  bubble.style.justifyContent = 'center';
  bubble.style.boxShadow = '0 4px 10px rgba(139, 107, 9, 0.3)';
  bubble.style.cursor = 'pointer';
  bubble.style.zIndex = '10000';
  bubble.innerHTML = '🤖';

  const iframe = document.createElement('iframe');
  iframe.src = 'http://localhost:3000/chatia/chat.html';
  iframe.style.position = 'fixed';
  iframe.style.bottom = '90px';
  iframe.style.right = '20px';
  iframe.style.width = '350px';
  iframe.style.height = '500px';
  iframe.style.border = 'none';
  iframe.style.borderRadius = '12px';
  iframe.style.boxShadow = '0 0 20px rgba(134, 89, 7, 0.4)';
  iframe.style.zIndex = '9999';
  iframe.style.display = 'none';

  document.body.appendChild(bubble);
  document.body.appendChild(iframe);

  let isChatOpen = false;

  bubble.addEventListener('click', () => {
    isChatOpen = !isChatOpen;
    iframe.style.display = isChatOpen ? 'block' : 'none';
  });
})();
