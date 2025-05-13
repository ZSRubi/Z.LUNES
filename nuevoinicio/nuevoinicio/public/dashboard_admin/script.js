

  const socket = io(); // Conectamos el socket al servidor

  // Manejo del menú desplegable
  document.querySelector('.nav-parent').addEventListener('click', function() {
    this.classList.toggle('active');
  });

  // Obtener datos del usuario del localStorage
  const nombre = localStorage.getItem('nombre') || "Administrador Demo";
  const correo = localStorage.getItem('correo') || "admin@demo.com";
  const id = localStorage.getItem('id') || "ADM-123";
  const rol = localStorage.getItem('rol') || "admin";

  // Apenas se conecta el socket
  socket.on('connect', () => {
    console.log('✅ Socket conectado con ID:', socket.id);

    // Enviar rol e id correctos al servidor
    socket.emit('set-role', {
      role: rol,
      id: id
    });
  });

  // Asignar valores al DOM
  document.getElementById('nombreUsuario').textContent = nombre;
  document.getElementById('correoUsuario').textContent = correo;
  document.getElementById('idUsuario').textContent = id;
  document.getElementById('avatarInitials').textContent = nombre.charAt(0).toUpperCase();

  // Mostrar datos del usuario
  if(nombre) {
    document.getElementById('nombreUsuario').textContent = nombre;
    document.getElementById('avatarInitials').textContent = nombre.charAt(0).toUpperCase();
  }

  // Verificar rol
  if(rol !== 'admin') {
    window.location.href = 'login.html';
  }

  // Función para cerrar sesión
  function cerrarSesion() {
    localStorage.clear();
    window.location.href = 'login.html';
  }

  // Activar elemento del menú según sección visible
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.section');
  
  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if(pageYOffset >= (sectionTop - 300)) {
        current = section.getAttribute('id');
      }
    });
    
    navItems.forEach(item => {
      item.classList.remove('active');
      const href = item.parentElement.getAttribute('href');
      if(href === `#${current}`) {
        item.classList.add('active');
      }
    });
  });

  // Smooth scroll para los enlaces del menú
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      window.scrollTo({
        top: targetElement.offsetTop - 20,
        behavior: 'smooth'
      });
      
      // Actualizar clase activa
      navItems.forEach(item => item.classList.remove('active'));
      this.querySelector('.nav-item').classList.add('active');
    });
  });


<script src="./assets/js/chat-loader.js"></script>
