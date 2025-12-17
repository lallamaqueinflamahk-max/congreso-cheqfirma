/**
 * Script para crear vendedores
 */

// Cargar lista de vendedores
function cargarVendedores() {
  fetch('/api/vendedores')
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('lista-vendedores');
      if (data.length === 0) {
        container.innerHTML = '<p>No hay vendedores creados aún.</p>';
        return;
      }

      container.innerHTML = data.map(v => {
        const baseUrl = window.location.origin;
        const link = `${baseUrl}/v/${v.vendedor_id}`;
        return `
          <div class="vendedor-item">
            <div>
              <strong>${v.nombre}</strong><br>
              <small>ID: ${v.vendedor_id}</small><br>
              <a href="${link}" target="_blank">${link}</a>
            </div>
            <div>
              <img src="/qrs/${v.vendedor_id}.png" alt="QR" style="width: 80px; height: 80px;">
            </div>
          </div>
        `;
      }).join('');
    });
}

// Enviar formulario
document.getElementById('vendedor-form').addEventListener('submit', async function(e) {
  e.preventDefault();

  const formData = new FormData(this);
  const data = {
    vendedor_id: formData.get('vendedor_id'),
    nombre: formData.get('nombre'),
    username: formData.get('username') || null,
    password: formData.get('password') || null
  };

  try {
    const response = await fetch('/api/vendedor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
      // Mostrar resultado
      document.getElementById('vendedor-form').style.display = 'none';
      document.getElementById('resultado').style.display = 'block';
      
      document.getElementById('result-vendedor-id').textContent = result.vendedor_id;
      document.getElementById('result-nombre').textContent = formData.get('nombre');
      document.getElementById('result-link').href = result.link;
      document.getElementById('result-link').textContent = result.link;
      
      document.getElementById('qr-image').src = result.qr_path;
      document.getElementById('qr-download').href = result.qr_path;
      document.getElementById('qr-download').download = `qr_${result.vendedor_id}.png`;

      // Recargar lista
      cargarVendedores();
    } else {
      alert('Error: ' + result.error);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error al crear vendedor. Por favor intenta de nuevo.');
  }
});

function crearOtro() {
  document.getElementById('vendedor-form').style.display = 'block';
  document.getElementById('resultado').style.display = 'none';
  document.getElementById('vendedor-form').reset();
}

// Cargar lista al iniciar
cargarVendedores();

