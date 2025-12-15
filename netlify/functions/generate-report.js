// Función Netlify para generar reporte diario en Excel
// Usa los mismos datos que el frontend actual
const { getStore } = require('@netlify/blobs');
const ExcelJS = require('exceljs');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Proteger con token (puede venir en header o query)
  const authToken = event.headers['authorization'] || event.queryStringParameters?.token;
  const validToken = process.env.REPORT_TOKEN || 'cheqfirma2025';
  
  if (authToken !== `Bearer ${validToken}` && authToken !== validToken) {
    return {
      statusCode: 401,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Unauthorized' })
    };
  }

  try {
    const store = getStore({ name: 'seats-data', siteID: context.site?.id });
    
    // Cargar todos los datos (misma estructura que frontend)
    const seatsData = await store.get('seatsData', { type: 'json' }) || {};
    
    const asientosVendidos = [];
    const asientosReservados = [];
    const asientosDisponibles = [];

    // Procesar cada asiento (1-100)
    for (let i = 1; i <= 100; i++) {
      const status = seatsData[i];
      const seatData = await store.get(`seat_${i}`, { type: 'json' });
      
      const row = Math.ceil(i / 10);
      const col = i % 10 || 10;
      const side = col <= 5 ? 'Izquierda' : 'Derecha';
      const position = `Fila ${row}, ${side}, Asiento ${col <= 5 ? col : col - 5}`;

      if (status === 'sold' && seatData) {
        asientosVendidos.push({
          'Asiento': i,
          'Ubicación': position,
          'Nombre': seatData.customer?.name || seatData.name || 'N/A',
          'Email': seatData.customer?.email || seatData.email || 'N/A',
          'Teléfono': seatData.customer?.phone || seatData.phone || 'N/A',
          'Precio (Gs)': seatData.price || 150000,
          'Método de Pago': seatData.paymentMethod || 'N/A',
          'Estado': 'Vendido',
          'Estado de Pago': 'Pagado',
          'Fecha de Venta': seatData.soldAt ? new Date(seatData.soldAt).toLocaleString('es-PY') : 'N/A',
          'ID de Reserva': seatData.reservationId || 'N/A'
        });
      } else if (status && (status.startsWith('reserved_') || status === 'reserved') && seatData) {
        asientosReservados.push({
          'Asiento': i,
          'Ubicación': position,
          'Nombre': seatData.customer?.name || seatData.name || 'N/A',
          'Email': seatData.customer?.email || seatData.email || 'N/A',
          'Teléfono': seatData.customer?.phone || seatData.phone || 'N/A',
          'Precio (Gs)': seatData.price || 150000,
          'Método de Pago': seatData.paymentMethod || 'Pendiente',
          'Estado': 'Reservado',
          'Estado de Pago': 'Pendiente',
          'Fecha de Reserva': seatData.createdAt ? new Date(seatData.createdAt).toLocaleString('es-PY') : 'N/A',
          'ID de Reserva': seatData.reservationId || 'N/A'
        });
      } else {
        asientosDisponibles.push({
          'Asiento': i,
          'Ubicación': position,
          'Estado': 'Disponible'
        });
      }
    }

    // Crear Excel con ExcelJS
    const workbook = new ExcelJS.Workbook();
    const fecha = new Date();
    const fechaFormato = fecha.toISOString().split('T')[0];
    const fechaLegible = fecha.toLocaleDateString('es-PY', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    // Hoja 1: RESUMEN
    const wsResumen = workbook.addWorksheet('Resumen');
    wsResumen.columns = [
      { header: 'Concepto', key: 'concepto', width: 30 },
      { header: 'Cantidad', key: 'cantidad', width: 15 }
    ];
    wsResumen.addRow({ concepto: 'Total Asientos Vendidos', cantidad: asientosVendidos.length });
    wsResumen.addRow({ concepto: 'Total Asientos Reservados', cantidad: asientosReservados.length });
    wsResumen.addRow({ concepto: 'Total Asientos Disponibles', cantidad: asientosDisponibles.length });
    wsResumen.addRow({ concepto: 'Total General', cantidad: 100 });
    wsResumen.addRow({ concepto: 'Fecha del Reporte', cantidad: fechaLegible });
    wsResumen.addRow({ concepto: 'Total Recaudado (Gs)', cantidad: asientosVendidos.reduce((sum, s) => sum + (s['Precio (Gs)'] || 0), 0) });

    // Hoja 2: VENDIDOS
    if (asientosVendidos.length > 0) {
      const wsVendidos = workbook.addWorksheet('Vendidos');
      wsVendidos.columns = [
        { header: 'Asiento', key: 'asiento', width: 8 },
        { header: 'Ubicación', key: 'ubicacion', width: 25 },
        { header: 'Nombre', key: 'nombre', width: 30 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Teléfono', key: 'telefono', width: 15 },
        { header: 'Precio (Gs)', key: 'precio', width: 12 },
        { header: 'Método de Pago', key: 'metodo', width: 18 },
        { header: 'Estado', key: 'estado', width: 12 },
        { header: 'Estado de Pago', key: 'pago', width: 15 },
        { header: 'Fecha de Venta', key: 'fecha', width: 20 },
        { header: 'ID de Reserva', key: 'id', width: 25 }
      ];
      asientosVendidos.forEach(seat => {
        wsVendidos.addRow(seat);
      });
    }

    // Hoja 3: RESERVADOS
    if (asientosReservados.length > 0) {
      const wsReservados = workbook.addWorksheet('Reservados');
      wsReservados.columns = [
        { header: 'Asiento', key: 'asiento', width: 8 },
        { header: 'Ubicación', key: 'ubicacion', width: 25 },
        { header: 'Nombre', key: 'nombre', width: 30 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Teléfono', key: 'telefono', width: 15 },
        { header: 'Precio (Gs)', key: 'precio', width: 12 },
        { header: 'Método de Pago', key: 'metodo', width: 18 },
        { header: 'Estado', key: 'estado', width: 12 },
        { header: 'Estado de Pago', key: 'pago', width: 15 },
        { header: 'Fecha de Reserva', key: 'fecha', width: 20 },
        { header: 'ID de Reserva', key: 'id', width: 25 }
      ];
      asientosReservados.forEach(seat => {
        wsReservados.addRow(seat);
      });
    }

    // Hoja 4: DISPONIBLES
    if (asientosDisponibles.length > 0) {
      const wsDisponibles = workbook.addWorksheet('Disponibles');
      wsDisponibles.columns = [
        { header: 'Asiento', key: 'asiento', width: 8 },
        { header: 'Ubicación', key: 'ubicacion', width: 25 },
        { header: 'Estado', key: 'estado', width: 12 }
      ];
      asientosDisponibles.forEach(seat => {
        wsDisponibles.addRow(seat);
      });
    }

    // Generar buffer del Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const base64 = buffer.toString('base64');

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="reporte_asientos_${fechaFormato}.xlsx"`
      },
      body: base64,
      isBase64Encoded: true
    };

  } catch (error) {
    console.error('Error generando reporte:', error);
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message })
    };
  }
};

