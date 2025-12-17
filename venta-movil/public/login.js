/**
 * Script para login de vendedores
 */

// Enviar formulario de login
document.getElementById('login-form').addEventListener('submit', async function(e) {
  e.preventDefault();

  const formData = new FormData(this);
  const data = {
    username: formData.get('username'),
    password: formData.get('password')
  };

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
      // Ocultar formulario y mostrar panel
      document.getElementById('login-form').style.display = 'none';
      document.getElementById('mensaje-error').style.display = 'none';
      document.getElementById('panel-vendedor').style.display = 'block';

      // Llenar datos del vendedor
      document.getElementById('vendedor-nombre').textContent = result.vendedor.nombre;
      document.getElementById('vendedor-id').textContent = result.vendedor.vendedor_id;
      document.getElementById('vendedor-link').href = result.vendedor.link;
      document.getElementById('vendedor-link').textContent = result.vendedor.link;
      
      document.getElementById('qr-image').src = result.vendedor.qr_path;
      document.getElementById('qr-download').href = result.vendedor.qr_path;
      document.getElementById('qr-download').download = `qr_${result.vendedor.vendedor_id}.png`;
      
      document.getElementById('link-venta').href = result.vendedor.link;

      // Guardar en sessionStorage
      sessionStorage.setItem('vendedor_logueado', JSON.stringify(result.vendedor));
    } else {
      // Mostrar error
      document.getElementById('mensaje-error').style.display = 'block';
      document.getElementById('error-texto').textContent = result.error || 'Error al iniciar sesión';
    }
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('mensaje-error').style.display = 'block';
    document.getElementById('error-texto').textContent = 'Error de conexión. Por favor intenta de nuevo.';
  }
});

function cerrarSesion() {
  sessionStorage.removeItem('vendedor_logueado');
  document.getElementById('login-form').style.display = 'block';
  document.getElementById('panel-vendedor').style.display = 'none';
  document.getElementById('login-form').reset();
}

// Verificar si ya está logueado
window.addEventListener('DOMContentLoaded', function() {
  const vendedorLogueado = sessionStorage.getItem('vendedor_logueado');
  if (vendedorLogueado) {
    const vendedor = JSON.parse(vendedorLogueado);
    // Simular login exitoso
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('panel-vendedor').style.display = 'block';
    document.getElementById('vendedor-nombre').textContent = vendedor.nombre;
    document.getElementById('vendedor-id').textContent = vendedor.vendedor_id;
    document.getElementById('vendedor-link').href = vendedor.link;
    document.getElementById('vendedor-link').textContent = vendedor.link;
    document.getElementById('qr-image').src = vendedor.qr_path;
    document.getElementById('qr-download').href = vendedor.qr_path;
    document.getElementById('qr-download').download = `qr_${vendedor.vendedor_id}.png`;
    document.getElementById('link-venta').href = vendedor.link;
  }
});

