/**
 * Script para formulario de venta móvil
 */

// Obtener vendedor_id de la URL
const urlParams = new URLSearchParams(window.location.search);
const pathParts = window.location.pathname.split('/');
const vendedor_id = pathParts[pathParts.length - 1];

// Cargar datos del vendedor
fetch(`/api/vendedor/${vendedor_id}`)
  .then(res => res.json())
  .then(vendedor => {
    document.getElementById('vendedor-nombre').textContent = `Cargar Venta - ${vendedor.nombre}`;
    
    // Mostrar QR si existe
    const baseUrl = window.location.origin;
    const qrPath = `/qrs/${vendedor_id}.png`;
    
    // Verificar si el QR existe
    fetch(qrPath, { method: 'HEAD' })
      .then(res => {
        if (res.ok) {
          document.getElementById('qr-vendedor-img').src = qrPath;
          document.getElementById('qr-vendedor-container').style.display = 'block';
        }
      })
      .catch(() => {
        // QR no existe, intentar generarlo
        // El servidor lo generará automáticamente si no existe
        setTimeout(() => {
          document.getElementById('qr-vendedor-img').src = qrPath + '?t=' + Date.now();
          document.getElementById('qr-vendedor-container').style.display = 'block';
        }, 500);
      });
  })
  .catch(err => {
    console.error('Error cargando vendedor:', err);
  });

// Establecer fecha por defecto (hoy)
document.getElementById('fecha').valueAsDate = new Date();

// Estado de asientos
let asientosData = {};
let asientoSeleccionado = null;

// Cargar estado de asientos
function cargarAsientos() {
  fetch('/api/asientos')
    .then(res => res.json())
    .then(data => {
      asientosData = {};
      data.forEach(asiento => {
        asientosData[asiento.asiento_fisico_numero] = asiento;
      });
      renderizarAsientos();
    })
    .catch(err => {
      console.error('Error cargando asientos:', err);
    });
}

// Renderizar grid de asientos
function renderizarAsientos() {
  const grid = document.getElementById('asientos-grid');
  if (!grid) return;
  
  grid.innerHTML = '';
  
  // Crear 100 asientos (10x10)
  for (let i = 1; i <= 100; i++) {
    const asiento = asientosData[i] || { asiento_fisico_numero: i, asiento_estado: 'vacante' };
    const item = document.createElement('div');
    item.className = 'asiento-item';
    item.textContent = i;
    item.dataset.numero = i;
    
    // Determinar color según estado
    if (asiento.asiento_estado === 'comprado') {
      item.classList.add('rojo');
      item.title = `Asiento ${i} - Vendido`;
    } else if (asiento.asiento_estado === 'reservado') {
      item.classList.add('amarillo');
      item.title = `Asiento ${i} - Reservado`;
      item.addEventListener('click', () => seleccionarAsiento(i));
    } else {
      item.classList.add('verde');
      item.title = `Asiento ${i} - Libre`;
      item.addEventListener('click', () => seleccionarAsiento(i));
    }
    
    grid.appendChild(item);
  }
}

// Seleccionar asiento
function seleccionarAsiento(numero) {
  const asiento = asientosData[numero];
  if (!asiento) return;
  
  // No permitir seleccionar asientos vendidos
  if (asiento.asiento_estado === 'comprado') {
    alert('Este asiento ya está vendido');
    return;
  }
  
  // Remover selección anterior
  if (asientoSeleccionado) {
    const prevItem = document.querySelector(`[data-numero="${asientoSeleccionado}"]`);
    if (prevItem) prevItem.classList.remove('seleccionado');
  }
  
  // Marcar nuevo asiento como seleccionado
  asientoSeleccionado = numero;
  const item = document.querySelector(`[data-numero="${numero}"]`);
  if (item) {
    item.classList.add('seleccionado');
    // Scroll suave al asiento seleccionado
    item.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  
  // Actualizar campo de formulario
  document.getElementById('asiento_fisico_numero').value = numero;
  
  // Si está reservado, sugerir cambiar a comprado
  if (asiento.asiento_estado === 'reservado') {
    document.getElementById('asiento_estado').value = 'comprado';
  } else {
    document.getElementById('asiento_estado').value = 'comprado';
  }
}

// Mostrar/ocultar campos según canal
document.getElementById('canal').addEventListener('change', function() {
  const canal = this.value;
  const camposVentaFisica = document.getElementById('campos-venta-fisica');
  
  if (canal === 'venta_fisica') {
    camposVentaFisica.style.display = 'block';
    document.getElementById('asiento_fisico_numero').required = true;
    document.getElementById('asiento_estado').required = true;
    // Cargar asientos cuando se muestra el formulario
    cargarAsientos();
  } else {
    camposVentaFisica.style.display = 'none';
    document.getElementById('asiento_fisico_numero').required = false;
    document.getElementById('asiento_estado').required = false;
    asientoSeleccionado = null;
  }
});

// Calcular total automáticamente
document.getElementById('precio_venta').addEventListener('input', calcularTotal);
document.getElementById('cantidad').addEventListener('input', calcularTotal);

function calcularTotal() {
  const precio = parseFloat(document.getElementById('precio_venta').value) || 0;
  const cantidad = parseInt(document.getElementById('cantidad').value) || 1;
  const total = precio * cantidad;
  document.getElementById('total').value = total.toFixed(2);
}

// Enviar formulario
document.getElementById('venta-form').addEventListener('submit', async function(e) {
  e.preventDefault();

  const formData = new FormData(this);
  const canal = formData.get('canal');
  
  // Determinar categoría y campos específicos
  let categoria = '';
  let datosEspecificos = {};

  if (canal === 'venta_fisica') {
    categoria = 'fisica';
    datosEspecificos = {
      asiento_fisico_numero: parseInt(formData.get('asiento_fisico_numero')),
      asiento_estado: formData.get('asiento_estado'),
      canal_venta_p2p: 'p2p'
    };
  } else if (canal === 'live_virtual') {
    categoria = 'virtual';
    datosEspecificos = {
      canal_venta_virtual: 'live_event',
      pago_tipo: 'pago_live_event'
    };
  } else if (canal === 'post_transmision') {
    categoria = 'virtual';
    datosEspecificos = {
      canal_venta_virtual: 'post_transmision',
      pago_tipo: 'pago_post_transmicion'
    };
  }

  const data = {
    vendedor_id: vendedor_id,
    categoria: categoria,
    fecha: formData.get('fecha'),
    canal: canal,
    medio_pago: formData.get('medio_pago'),
    precio_unitario: formData.get('precio_unitario') || null,
    precio_promocional_preventa_40off: formData.get('precio_promocional_preventa_40off') || null,
    precio_venta: parseFloat(formData.get('precio_venta')),
    cantidad: parseInt(formData.get('cantidad')),
    total: parseFloat(formData.get('total')),
    comprador_email: formData.get('comprador_email') || null,
    comprador_whatsapp: formData.get('comprador_whatsapp'),
    estado_pago: formData.get('estado_pago'),
    notas: formData.get('notas') || null,
    ...datosEspecificos
  };

  try {
    const response = await fetch('/api/venta', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
      // Recargar asientos si es venta física
      if (canal === 'venta_fisica') {
        cargarAsientos();
      }
      
      // Mostrar mensaje de éxito
      document.getElementById('venta-form').style.display = 'none';
      document.getElementById('mensaje-exito').style.display = 'block';
      document.getElementById('mensaje-texto').textContent = `Venta ${result.venta_id} registrada exitosamente.`;
    } else {
      alert('Error: ' + result.error);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error al guardar la venta. Por favor intenta de nuevo.');
  }
});

function cargarOtra() {
  document.getElementById('venta-form').style.display = 'block';
  document.getElementById('mensaje-exito').style.display = 'none';
  document.getElementById('venta-form').reset();
  document.getElementById('fecha').valueAsDate = new Date();
  document.getElementById('cantidad').value = 1;
  calcularTotal();
  asientoSeleccionado = null;
  
  // Recargar asientos si el canal es venta_fisica
  const canal = document.getElementById('canal').value;
  if (canal === 'venta_fisica') {
    cargarAsientos();
  }
}

