const express = require('express');
const router = express.Router();
const fetch = require('node-fetch'); // asegúrate de tener fetch o usar node-fetch en Node.js

router.post('/generate', async (req, res) => {
  const { model = 'llama2', prompt, stream = false } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'El prompt es obligatorio y debe ser texto' });
  }

  const rawPrompt = prompt.toLowerCase();

  // Extraer solo la pregunta del prompt si viene con formato
  const match = rawPrompt.match(/pregunta:\s*(.*)/i);
  const texto = match ? match[1] : rawPrompt;

  // Respuestas rápidas locales
  let respuestaLocal = '';

  if (texto.includes('propiedad') || texto.includes('inmueble') || texto.includes('departamento') || texto.includes('casa') || texto.includes('terreno')) {
    respuestaLocal = `Tenemos varias propiedades disponibles:
1. Departamento moderno en Miraflores - $120,000 USD - 80m², 2 habitaciones.
2. Casa familiar en Surco - $250,000 USD - 3 pisos, jardín amplio.
3. Terreno en Pachacámac - $95,000 USD - 500m², ideal para proyecto residencial.`;
  } else if (texto.includes('cliente') || texto.includes('comprador') || texto.includes('interesado')) {
    respuestaLocal = `Clientes potenciales actualmente activos:
1. Lucía Fernández - 999888777 - Interesada en departamento en Miraflores.
2. Juan Pérez - 987654321 - Busca casa en Surco.
3. Ana Torres - 912345678 - Preguntó por terrenos en zona rural.`;
  } else if (texto.includes('agente') || texto.includes('asesor') || texto.includes('vendedor')) {
    respuestaLocal = `Nuestros agentes disponibles:
- Carlos Méndez (Especialista en ventas residenciales) - 986543210
- María López (Alquileres y contratos) - 981112233
Puedes agendar una cita con cualquiera de ellos.`;
  } else if (texto.includes('precio') || texto.includes('costo') || texto.includes('cuánto vale')) {
    respuestaLocal = `Los precios varían según la zona y tipo:
- Departamentos desde $80,000 USD.
- Casas desde $150,000 USD.
- Terrenos desde $50 por m².
¿Deseas información en alguna zona específica?`;
  } else if (texto.includes('alquiler') || texto.includes('renta') || texto.includes('arrendar')) {
    respuestaLocal = `Opciones de alquiler:
- Departamento en Surquillo - $400/mes
- Mini departamento en Barranco - $500/mes
- Casa en San Borja - $950/mes
Todos incluyen mantenimiento. ¿Deseas agendar una visita?`;
  } else if (texto.includes('vender') || texto.includes('venda') || texto.includes('publicar')) {
    respuestaLocal = `Para vender tu propiedad necesitamos:
1. Título de propiedad
2. Copia del DNI del propietario
3. Certificado de gravamen
Luego de eso, un agente puede ayudarte a publicarla y encontrar compradores.`;
  } else if (texto.includes('documento') || texto.includes('requisito') || texto.includes('necesito para comprar')) {
    respuestaLocal = `Para comprar una propiedad necesitas:
- Copia de tu DNI
- Firma de contrato de arras
- Realizar el pago inicial acordado
- Firma de escritura pública ante notario
Nuestro equipo legal puede ayudarte en todo el proceso.`;
  }

  if (respuestaLocal) {
    // Responde rápido sin llamar al backend
    return res.json({ response: respuestaLocal });
  }

  // Si no hay respuesta local, llama al backend Ollama
  try {
    const check = await fetch('http://localhost:11434');
    if (!check.ok) throw new Error('Ollama no está disponible');

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt, stream }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ollama respondió con error: ${errorText}`);
    }

    const data = await response.json();
    return res.json(data);

  } catch (err) {
    console.error('❌ Error al conectar con Ollama:', err.message || err);
    return res.status(500).json({ error: 'No se pudo obtener respuesta de Ollama' });
  }
});

module.exports = router;
