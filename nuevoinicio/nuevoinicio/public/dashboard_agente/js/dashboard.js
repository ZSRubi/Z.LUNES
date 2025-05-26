document.addEventListener('DOMContentLoaded', () => {
  fetch('http://localhost:3000/api/propiedades')
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('propiedadesContainer');
      container.innerHTML = '';

      data.forEach(prop => {
        
        

        const card = document.createElement('div');
        card.innerHTML = `
          ${prop.fotoUrl ? `<img src="${prop.fotoUrl}" alt="Foto de propiedad">` : ''}
          <h3>${prop.tipo}</h3>
          <p><strong>Dirección:</strong> ${prop.direccion}</p>
          <p><strong>Estado:</strong> ${prop.estado}</p>
          <p><strong>Precio:</strong> S/. ${prop.precio}</p>
          <div class="btn-group">
            <button class="btn-editar" data-id="${prop._id}">Editar</button>
            <button class="btn-eliminar" data-id="${prop._id}">Eliminar</button>
          </div>
        `;

        container.appendChild(card);
      });

      // Eventos para eliminar
      document.querySelectorAll('.btn-eliminar').forEach(button => {
        button.addEventListener('click', (e) => {
          const id = e.target.dataset.id;
          if (confirm('¿Estás seguro de eliminar esta propiedad?')) {
            fetch(`http://localhost:3000/api/propiedades/${id}`, {
              method: 'DELETE'
            })
            .then(res => res.json())
            .then(data => {
              alert('Propiedad eliminada');
              location.reload(); // recargar lista
            })
            .catch(err => console.error(err));
          }
        });
      });

      // Eventos para editar (solo alerta por ahora)
      document.querySelectorAll('.btn-editar').forEach(button => {
        button.addEventListener('click', (e) => {
          const id = e.target.dataset.id;
          alert(`Aquí puedes implementar la edición para la propiedad ID: ${id}`);
          // Aquí puedes abrir un modal o cargar los datos en el formulario para editar
        });
      });

    })
    .catch(err => {
      console.error('Error al cargar propiedades:', err);
    });
});
 
