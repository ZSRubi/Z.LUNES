
// Funcionalida dde registrar formulario
document.getElementById('newPropertyForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Obtener valores del formulario
  const address = document.getElementById('propertyAddress').value;
  const type = document.getElementById('propertyType').value;
  const price = document.getElementById('propertyPrice').value;
  const photosInput = document.getElementById('propertyPhotos');
  
  // Validación básica
  if (!address || !type || !price) {
    alert('Por favor complete todos los campos requeridos');
    return;
  }

  // Crear FormData para enviar archivos
  const formData = new FormData();
  formData.append('address', address);
  formData.append('type', type);
  formData.append('price', price);
  
  // Agregar archivos seleccionados
  for (let i = 0; i < photosInput.files.length; i++) {
    formData.append('photos', photosInput.files[i]);
  }

  try {
    // Obtener token JWT del localStorage (asumiendo que usas autenticación)
    const token = localStorage.getItem('token');
    
    const response = await fetch('/api/properties', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const data = await response.json();

    if (response.ok) {
      alert('Propiedad creada exitosamente');
      // Resetear formulario
      e.target.reset();
      document.getElementById('photoCount').textContent = '0 fotos seleccionadas';
      document.getElementById('photoPreviews').innerHTML = '';
      // Ocultar formulario o redirigir
      document.getElementById('propertyForm').style.display = 'none';
    } else {
      throw new Error(data.message || 'Error al crear propiedad');
    }
  } catch (error) {
    console.error('Error:', error);
    alert(`Error: ${error.message}`);
  }
});

// Mostrar vista previa de imágenes
document.getElementById('propertyPhotos').addEventListener('change', function(e) {
  const previewContainer = document.getElementById('photoPreviews');
  const countElement = document.getElementById('photoCount');
  
  previewContainer.innerHTML = '';
  countElement.textContent = `${e.target.files.length} foto(s) seleccionada(s)`;
  
  Array.from(e.target.files).forEach(file => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = document.createElement('img');
      img.src = event.target.result;
      img.classList.add('img-thumbnail', 'mr-2');
      img.style.maxHeight = '100px';
      previewContainer.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
});

// Botón cancelar
document.getElementById('cancelPropertyForm').addEventListener('click', () => {
  document.getElementById('propertyForm').style.display = 'none';
});





// Fin de formulario


// Mostrar/ocultar formulario
document.getElementById('togglePropertyForm').addEventListener('click', function() {
  const form = document.getElementById('propertyForm');
  form.style.display = form.style.display === 'none' ? 'block' : 'none';
});

document.getElementById('cancelPropertyForm').addEventListener('click', function() {
  document.getElementById('propertyForm').style.display = 'none';
});

// Manejo de fotos
document.getElementById('propertyPhotos').addEventListener('change', function(e) {
  const files = e.target.files;
  const previewContainer = document.getElementById('photoPreviews');
  const countElement = document.getElementById('photoCount');
  
  previewContainer.innerHTML = '';
  countElement.textContent = files.length + ' foto(s) seleccionada(s)';
  
  for (let i = 0; i < files.length; i++) {
    const reader = new FileReader();
    reader.onload = function(event) {
      const img = document.createElement('img');
      img.src = event.target.result;
      previewContainer.appendChild(img);
    }
    reader.readAsDataURL(files[i]);
  }
});

// Enviar formulario
document.getElementById('newPropertyForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  // Aquí iría la lógica para guardar el inmueble
  alert('Inmueble guardado exitosamente');
  this.reset();
  document.getElementById('photoPreviews').innerHTML = '';
  document.getElementById('photoCount').textContent = '0 fotos seleccionadas';
  document.getElementById('propertyForm').style.display = 'none';
});

// Obtener datos del usuario del localStorage o usar valores demo
const nombre = localStorage.getItem('nombre') || "Administrador Demo";
const correo = localStorage.getItem('correo') || "admin@demo.com";
const id = localStorage.getItem('id') || "ADM-123";
const rol = localStorage.getItem('rol') || "admin";

// Asignar valores al DOM (esto es suficiente, no necesitas repetirlo)
document.getElementById('nombreUsuario').textContent = nombre;
document.getElementById('correoUsuario').textContent = correo;
document.getElementById('idUsuario').textContent = id;
document.getElementById('avatarInitials').textContent = nombre.charAt(0).toUpperCase();

// Verificar rol (esto previene acceso no autorizado)
if(rol !== 'agente' && rol !== 'admin') {  // Permite tanto agentes como admins
  window.location.href = 'login.html';
}

// Función para cerrar sesión
function cerrarSesion() {
  localStorage.clear();
  window.location.href = 'login.html';
}

document.querySelectorAll('.btn-status').forEach(button => {
button.addEventListener('click', function() {
if (this.disabled) return;

const visitId = this.dataset.visitId;
const statusMap = {
  'pending': ['Pendiente', 'pending'],
  'completed': ['Realizada', 'completed'],
  'cancelled': ['Cancelada', 'cancelled']
};
const [textoEstado, claseEstado] = statusMap[this.classList[1]];

// Actualizar UI
const statusElement = this.closest('tr').querySelector('.status');
statusElement.className = 'status ' + claseEstado;
statusElement.textContent = textoEstado;

// Ejemplo llamada API (descomentar para usar)
/*
fetch(`/api/visits/${visitId}/status`, {
  method: 'PUT',
  body: JSON.stringify({ status: claseEstado }),
  headers: { 'Content-Type': 'application/json' }
});
*/
});
});


// Mostrar/ocultar formulario (CORRECCIÓN)
document.getElementById('toggleContractForm').addEventListener('click', function() {
const form = document.getElementById('contractFormContainer');
form.style.display = form.style.display === 'none' ? 'block' : 'none';
});

// Mostrar campo fecha fin solo para alquileres
document.getElementById('contractType').addEventListener('change', function() {
document.getElementById('endDateGroup').style.display = 
this.value === 'Alquiler' ? 'block' : 'none';
});

// Cancelar formulario
document.getElementById('cancelContractForm').addEventListener('click', function() {
document.getElementById('contractFormContainer').style.display = 'none';
});

//ahorro de energia en la coomputadora
//contrato

// Generar contrato
document.getElementById('contractForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  // Aquí iría la lógica para guardar el contrato
  alert('Contrato generado exitosamente');
  this.reset();
  document.getElementById('contractFormContainer').style.display = 'none';
});

// Ver contrato con cláusulas
document.querySelectorAll('.view-contract').forEach(btn => {
  btn.addEventListener('click', function() {
    const contract = JSON.parse(this.dataset.contract);
    const modal = document.getElementById('contractModal');
    const content = document.getElementById('contractContent');
    
    // Generar HTML con cláusulas
    let clausesHTML = '';
    contract.clauses.forEach((clause, index) => {
      clausesHTML += `<p><strong>Cláusula ${index + 1}:</strong> ${clause}</p>`;
    });
    
    content.innerHTML = `
      <div class="contract-template">
        <div class="contract-header">
          <h2 class="contract-title">CONTRATO DE ${contract.type.toUpperCase()}</h2>
          <p>No. ${contract.id}</p>
        </div>
        
        <div class="contract-details">
          <div class="contract-detail">
            <label>Entre:</label>
            <span>${contract.agent}, en representación de la propiedad ${contract.property}</span>
          </div>
          <div class="contract-detail">
            <label>Y:</label>
            <span>${contract.client}</span>
          </div>
          <div class="contract-detail">
            <label>Fecha:</label>
            <span>${contract.date}</span>
          </div>
          <div class="contract-detail">
            <label>Precio:</label>
            <span>${contract.price}</span>
          </div>
          
          <div class="contract-clauses">
            <h3>Cláusulas:</h3>
            ${clausesHTML}
          </div>
        </div>
        
        <div class="contract-footer">
          <div class="signature-line">Firma del Cliente</div>
          <div class="signature-line">Firma del Agente</div>
        </div>
      </div>
    `;
    
    modal.style.display = 'block';
  });
});



// Cerrar modal
document.querySelector('.close-modal').addEventListener('click', function() {
  document.getElementById('contractModal').style.display = 'none';
});

// Descargar PDF (simulado)
document.getElementById('downloadPdf').addEventListener('click', function() {
  alert('PDF generado con éxito');
  // En producción usarías: 
  // const element = document.getElementById('contractContent');
  // html2pdf().from(element).save('contrato.pdf');
});



//-------------------------------------
    document.getElementById('propertyPhotos').addEventListener('change', function(event) {
    const photoCount = document.getElementById('photoCount');
    const photoPreviews = document.getElementById('photoPreviews');
    const files = event.target.files;
    
    photoCount.textContent = `${files.length} fotos seleccionadas`;

    // Limpiar las vistas previas anteriores
    photoPreviews.innerHTML = '';
    
    // Mostrar las vistas previas de las fotos
    Array.from(files).forEach(file => {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      img.style.width = '50px';
      img.style.height = '50px';
      photoPreviews.appendChild(img);
    });
  });

  document.getElementById('newPropertyForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append('propertyAddress', document.getElementById('propertyAddress').value);
    formData.append('propertyType', document.getElementById('propertyType').value);
    formData.append('propertyPrice', document.getElementById('propertyPrice').value);
    Array.from(document.getElementById('propertyPhotos').files).forEach(file => {
      formData.append('propertyPhotos', file);
    });

    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      // if (response.ok) {
      //   alert('Propiedad guardada exitosamente');
      //   // Redirigir o limpiar el formulario según sea necesario
      // } else {
      //   alert('Hubo un error al guardar la propiedad');
      // }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      alert('Error al guardar la propiedad');
    }
  });


    // Función para cargar las propiedades y clientes en los selects
  async function cargarAgendados() {
    try {
      const response = await fetch('/api/agendados');
      const agendados = await response.json();
      
      // Llenar el select de propiedades
      const selectProperty = document.getElementById('contractProperty');
      agendados.forEach(agendado => {
        const option = document.createElement('option');
        option.value = agendado.propiedad.nombre; // Asumiendo que propiedad tiene un campo nombre
        option.textContent = `${agendado.propiedad.direccion} (${agendado.propiedad.tipo})`; // Asume que propiedad tiene estos campos
        selectProperty.appendChild(option);
      });

      // Llenar el select de clientes
      const selectClient = document.getElementById('contractClient');
      agendados.forEach(agendado => {
        const option = document.createElement('option');
        option.value = agendado.cliente.nombre; // Asumiendo que cliente tiene un campo nombre
        option.textContent = agendado.cliente.nombre; // O cualquier otro campo que quieras mostrar
        selectClient.appendChild(option);
      });

    } catch (error) {
      console.error('Error al cargar los agendados:', error);
    }
  }

  // Llamar la función para cargar los agendados al cargar la página
  window.onload = cargarAgendados;

<script src="./assets/js/chat-loader.js"></script>