/**
 * Script para panel admin
 */

let ventas = [];
let vendedores = [];

// Cargar vendedores
fetch('/api/vendedores')
  .then(res => res.json())
  .then(data => {
    vendedores = data;
    const select = document.getElementById('filtro-vendedor');
    data.forEach(v => {
      const option = document.createElement('option');
      option.value = v.vendedor_id;
      option.textContent = v.nombre;
      select.appendChild(option);
    });
    cargarVentas();
  });

// Cargar ventas
function cargarVentas() {
  document.getElementById('loading').style.display = 'block';
  
  const params = new URLSearchParams();
  const canal = document.getElementById('filtro-canal').value;
  const vendedor = document.getElementById('filtro-vendedor').value;
  const fecha = document.getElementById('filtro-fecha').value;
  const estadoPago = document.getElementById('filtro-estado-pago').value;
  const asientoEstado = document.getElementById('filtro-asiento-estado').value;

  if (canal) params.append('canal', canal);
  if (vendedor) params.append('vendedor_id', vendedor);
  if (fecha) params.append('fecha', fecha);
  if (estadoPago) params.append('estado_pago', estadoPago);
  if (asientoEstado) params.append('asiento_estado', asientoEstado);

  fetch(`/api/ventas?${params.toString()}`)
    .then(res => res.json())
    .then(data => {
      ventas = data;
      renderizarTabla();
      document.getElementById('loading').style.display = 'none';
    })
    .catch(err => {
      console.error('Error:', err);
      document.getElementById('loading').style.display = 'none';
    });
}

function renderizarTabla() {
  const tbody = document.getElementById('tabla-body');
  tbody.innerHTML = '';

  if (ventas.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 20px;">No hay ventas registradas</td></tr>';
    return;
  }

  ventas.forEach(venta => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${venta.venta_id}</td>
      <td>${venta.fecha}</td>
      <td>${venta.vendedor_nombre || venta.vendedor_id}</td>
      <td>${venta.canal}</td>
      <td>${venta.comprador_email || venta.comprador_whatsapp || 'N/A'}</td>
      <td>Gs ${parseFloat(venta.total).toLocaleString()}</td>
      <td><span class="badge badge-${venta.estado_pago}">${venta.estado_pago}</span></td>
      <td>${venta.asiento_fisico_numero || 'N/A'}</td>
    `;
    tbody.appendChild(tr);
  });
}

function aplicarFiltros() {
  cargarVentas();
}

function limpiarFiltros() {
  document.getElementById('filtro-canal').value = '';
  document.getElementById('filtro-vendedor').value = '';
  document.getElementById('filtro-fecha').value = '';
  document.getElementById('filtro-estado-pago').value = '';
  document.getElementById('filtro-asiento-estado').value = '';
  cargarVentas();
}

function exportar(tipo, formato) {
  const params = new URLSearchParams();
  const canal = document.getElementById('filtro-canal').value;
  const vendedor = document.getElementById('filtro-vendedor').value;
  const fecha = document.getElementById('filtro-fecha').value;
  const estadoPago = document.getElementById('filtro-estado-pago').value;
  const asientoEstado = document.getElementById('filtro-asiento-estado').value;

  if (canal) params.append('canal', canal);
  if (vendedor) params.append('vendedor_id', vendedor);
  if (fecha) params.append('fecha', fecha);
  if (estadoPago) params.append('estado_pago', estadoPago);
  if (asientoEstado) params.append('asiento_estado', asientoEstado);

  window.location.href = `/api/export/${tipo}?formato=${formato}&${params.toString()}`;
}

// Cargar ventas al iniciar
cargarVentas();

