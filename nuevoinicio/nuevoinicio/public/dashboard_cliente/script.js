

  const username = document.getElementById('username')
  const writeMessage = document.getElementById('writeMessage')
  const writing = document.getElementById('writing')
  const messages = document.getElementById('messages')
  const socket = io("http://localhost:3000");

  username.value = 

  socket.on('all-messages', (m)=>{
      let content = ''
      for(const message of m){
          content += `
          <div class="message">
              <strong>${message.username}:</strong> ${message.message}
          </div>
          `
      }
      messages.innerHTML = content
      messages.scrollTo = messages.scrollHeight
  })

  writeMessage.addEventListener('keydown', (event) => {
      socket.emit('writing', username.value)
  })

  socket.on('writing', (username) => {
      writing.innerHTML = username + " esta escribiendo..."
      setTimeout(() => {
          writing.innerHTML = ''
      }, 3000)
  })

  writeMessage.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault(); // Evita salto de línea
    if (username.value === "" || writeMessage.value.trim() === "") {
      return alert('El nombre de usuario y el mensaje son requeridos👽')
    }
    socket.emit('new-message', {
      username: username.value,
      message: writeMessage.value.trim()
    })
    writeMessage.value = ""
  } else {
    socket.emit('writing', username.value)
  }
})




    //de google mpas
    document.querySelectorAll('.btn-location').forEach(button => {
    button.addEventListener('click', function() {
      const mapContainer = this.nextElementSibling;
      // Cambiar el estado de visibilidad del mapa
      if (mapContainer.style.display === 'none' || mapContainer.style.display === '') {
        mapContainer.style.display = 'block';
      } else {
        mapContainer.style.display = 'none';
      }

      // Redirigir a Google Maps al hacer clic en el mapa
      const address = this.getAttribute('data-address');
      const mapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}`;
      window.open(mapsUrl, '_blank');
    });
  });



   // Obtener datos del usuario del localStorage
    const nombre = localStorage.getItem('nombre') || "Administrador Demo"; // Si no hay nombre en localStorage, usa el demo
    const correo = localStorage.getItem('correo') || "admin@demo.com";
    const id = localStorage.getItem('id') || "ADM-123";
    const rol = localStorage.getItem('rol') || "admin"; // Rol por defecto

    // Asignar valores al DOM
    document.getElementById('nombreUsuario').textContent = nombre;
    document.getElementById('correoUsuario').textContent = correo;
    document.getElementById('idUsuario').textContent = id;
    document.getElementById('avatarInitials').textContent = nombre.charAt(0).toUpperCase(); // Inicial del nombre

    // Mostrar datos del usuario
    if(nombre) {
      document.getElementById('nombreUsuario').textContent = nombre;
      document.getElementById('userAvatar').textContent = nombre.charAt(0).toUpperCase();
    }
    if(correo) document.getElementById('correoUsuario').textContent = correo;
    if(id) document.getElementById('idUsuario').textContent = id;

    // Verificar si el usuario es cliente
    if(rol !== 'cliente') {
      window.location.href = 'index.html';
    }

    // Función para cerrar sesión
    function cerrarSesion() {
      localStorage.clear();
      window.location.href = 'index.html';
    }

    // Cerrar modal
    document.querySelector('.close-modal').addEventListener('click', function() {
      document.getElementById('mapModal').style.display = 'none';
    });


//GUARDAR CONTRATO
    document.getElementById('generateContractBtn').addEventListener('click', async function (e) {
      e.preventDefault();  // Evitar el envío del formulario

      const contrato = {
        id: document.getElementById('contractId').value,
        property: document.getElementById('contractProperty').value,
        client: document.getElementById('contractClient').value,
        agent: 'Ana Herrera G.',  // Puedes poner un agente predeterminado o permitir seleccionar
        date: document.getElementById('contractStart').value,
        type: document.getElementById('contractType').value,
        price: document.getElementById('contractPrice').value,
        clauses: document.getElementById('contractClauses').value.split('\n')  // Convertir cláusulas en un array
      };

      // Enviar los datos al backend
      try {
        const response = await fetch('/api/contracts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contrato)
        });

        const result = await response.json();
        if (response.status === 201) {
          // Mostrar el popup con los detalles del contrato
          document.getElementById('contractPopup').style.display = 'block';
          document.getElementById('contractDetails').innerHTML = `
            <p><strong>ID:</strong> ${contrato.id}</p>
            <p><strong>Propiedad:</strong> ${contrato.property}</p>
            <p><strong>Cliente:</strong> ${contrato.client}</p>
            <p><strong>Agente:</strong> ${contrato.agent}</p>
            <p><strong>Fecha Inicio:</strong> ${contrato.date}</p>
            <p><strong>Tipo:</strong> ${contrato.type}</p>
            <p><strong>Precio:</strong> ${contrato.price}</p>
            <p><strong>Cláusulas:</strong></p>
            <ul>
              ${contrato.clauses.map(clause => `<li>${clause}</li>`).join('')}
            </ul>
          `;
          // Mostrar el botón de ver contrato
          document.getElementById('viewContractBtn').style.display = 'inline-block';
        }
      } catch (error) {
        console.error('Error al generar contrato:', error);
      }
    });

    // Función para cerrar el popup
    document.getElementById('closePopupBtn').addEventListener('click', function () {
      document.getElementById('contractPopup').style.display = 'none';
    });

    // Función para descargar el contrato en PDF
    document.getElementById('downloadPDFBtn').addEventListener('click', function () {
      const doc = new jsPDF();
      const contractDetails = document.getElementById('contractDetails').innerText;

      doc.text(contractDetails, 10, 10);
      doc.save('contrato.pdf');
    });

// API GET /api/mi-agente/:clienteId
const cliente = await Usuario.findById(clienteId).populate('agenteAsignado');

document.getElementById("infoAgenteCliente").innerText = "Tu agente es: rubi chambi";
