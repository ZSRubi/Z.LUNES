// Mostrar contrato como tarjeta Bootstrap
function mostrarContrato(contrato) {
  const container = document.getElementById('contratosContainer');

const col = document.createElement('div');
  col.className = 'col-md-6 col-lg-4 mb-4';

col.innerHTML = `
  <div class="card h-100 shadow-sm border-0 rounded-3 bg-white">
    <div class="card-header text-white" style="background: linear-gradient(45deg, #dc3545, #a71d2a);">
      <h5 class="card-title mb-0 fw-semibold">
        <i class="bi bi-person-circle me-1"></i>${contrato.cliente}
      </h5>
    </div>
    <div class="card-body">
      <p class="card-text mb-2">
        <i class="bi bi-house-fill text-primary me-1"></i>
        <strong>Propiedad:</strong> ${contrato.propiedad}
      </p>
      <p class="card-text mb-2">
        <i class="bi bi-calendar-event-fill text-success me-1"></i>
        <strong>Fecha Firma:</strong> ${new Date(contrato.fechaFirma).toLocaleDateString()}
      </p>
      <p class="card-text mb-3">
        <i class="bi bi-clock-history text-warning me-1"></i>
        <strong>Duración:</strong> ${contrato.duracion} meses
      </p>
      <button class="btn btn-danger w-100" onclick="eliminarContrato('${contrato._id}')">
        <i class="bi bi-trash3-fill me-1"></i>Eliminar Contrato
      </button>
    </div>
  </div>
`;




  container.appendChild(col);
}

// Cargar contratos al iniciar
function cargarContratos() {
  document.getElementById('contratosContainer').innerHTML = ''; // limpiar antes
  fetch('http://localhost:3000/api/contratos')
    .then(res => res.json())
    .then(contratos => contratos.forEach(mostrarContrato))
    .catch(err => console.error('Error al cargar contratos:', err));
}

// Guardar nuevo contrato
document.getElementById('formContrato').addEventListener('submit', function (e) {
  e.preventDefault();

  const data = {
    cliente: document.getElementById('clienteContrato').value,
    propiedad: document.getElementById('propiedadContrato').value,
    fechaFirma: document.getElementById('fechaFirmaContrato').value,
    duracion: parseInt(document.getElementById('duracionContrato').value)
  };

  fetch('http://localhost:3000/api/contratos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(contrato => {
      mostrarContrato(contrato);
      alert('Contrato registrado correctamente');
      e.target.reset();
    })
    .catch(err => {
      console.error('Error al registrar contrato:', err);
      alert('No se pudo registrar el contrato');
    });
});

// Eliminar contrato
function eliminarContrato(id) {
  if (!confirm('¿Estás seguro de eliminar este contrato?')) return;

  fetch(`http://localhost:3000/api/contratos/${id}`, {
    method: 'DELETE'
  })
    .then(res => res.json())
    .then(() => {
      alert('Contrato eliminado');
      cargarContratos();
    })
    .catch(err => {
      console.error('Error al eliminar contrato:', err);
      alert('No se pudo eliminar el contrato');
    });
}

// Cargar al iniciar
cargarContratos();
