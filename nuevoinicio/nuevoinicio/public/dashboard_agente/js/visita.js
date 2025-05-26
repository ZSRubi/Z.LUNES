// Mostrar una visita en el contenedor
function mostrarVisita(visita) {
  const container = document.getElementById('visitasContainer');

  const card = document.createElement('div');
 card.className = 'card mb-3 shadow-sm rounded';  // para que se vea como tarjeta con sombra y margen

card.style.padding = '15px';  // un poco de padding interior

card.innerHTML = `
  <h4 class="text-primary mb-2">${visita.cliente}</h4>
  <p><strong>Propiedad:</strong> ${visita.propiedad}</p>
  <p><strong>Fecha:</strong> ${new Date(visita.fechaVisita).toLocaleDateString()}</p>
  <p><strong>Comentario:</strong> ${visita.comentario}</p>
  <button class="btn btn-danger btn-sm mt-3 btnEliminar">Eliminar</button>
`;

  // Evento de eliminación
  const btnEliminar = card.querySelector('.btnEliminar');
  btnEliminar.addEventListener('click', () => {
    if (confirm('¿Seguro que deseas eliminar esta visita?')) {
      fetch(`http://localhost:3000/api/visitas/${visita._id}`, {
        method: 'DELETE'
      })
        .then(res => {
          if (!res.ok) throw new Error('Error al eliminar visita');
          card.remove(); // Eliminar la tarjeta del DOM
          alert('Visita eliminada correctamente');
        })
        .catch(err => {
          console.error('Error al eliminar visita:', err);
          alert('No se pudo eliminar la visita');
        });
    }
  });

  container.appendChild(card);
}

// Cargar visitas desde el backend al iniciar
function cargarVisitas() {
  fetch('http://localhost:3000/api/visitas')
    .then(res => res.json())
    .then(visitas => {
      visitas.forEach(mostrarVisita);
    })
    .catch(err => console.error('Error al cargar visitas:', err));
}

// Guardar nueva visita al enviar formulario
document.getElementById('formVisita').addEventListener('submit', function (e) {
  e.preventDefault();

  const data = {
    cliente: document.getElementById('cliente').value,
    propiedad: document.getElementById('propiedad').value,
    fechaVisita: document.getElementById('fechaVisita').value,
    comentario: document.getElementById('comentario').value
  };

  fetch('http://localhost:3000/api/visitas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(data => {
      console.log('Visita guardada:', data);
      alert('Visita creada correctamente');
      mostrarVisita(data); // Mostrar visita recién creada
      document.getElementById('formVisita').reset(); // Limpiar formulario
    })
    .catch(err => {
      console.error('Error al crear visita:', err);
      alert('Error al crear visita');
    });
});

// Llamar al cargar
cargarVisitas();
