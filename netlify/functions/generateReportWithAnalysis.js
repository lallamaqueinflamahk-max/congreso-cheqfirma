// Función para generar reporte con análisis de problemas y soluciones
// Incluye ventas presenciales, online post-evento y recuento de plata

const { getAllSeats, getSeat, getSeatsByStatus, cleanExpiredReservations, SEAT_STATES } = require('./seats-store');
const ExcelJS = require('exceljs');
const { getStore } = require("@netlify/blobs");

function getBlobStore() {
  const siteID = process.env.NETLIFY_SITE_ID;
  const token = process.env.NETLIFY_TOKEN;

  if (!siteID || !token) {
    throw new Error("Faltan NETLIFY_SITE_ID o NETLIFY_TOKEN en variables de entorno");
  }

  return getStore({
    name: "report-data",
    siteID,
    token,
  });
}

function getSaleCategory(item = {}) {
  //const cat = getSaleCategory(item);
console.log("DEBUG item:", {
  id: item.id,
  title: item.title,
  type: item.type,
  product: item.product,
  plan: item.plan,
  kind: item.kind,
  category: cat
});

  //  Unificamos todo el texto posible
  const text = [
    item.type,
    item.product,
    item.plan,
    item.kind,
    item.title,
    item.name,
    item.description,
    item.metadata?.category,
    item.metadata?.type,
    item.metadata?.product,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  // 🟢 POST LIVE / EDUCATIVO (PRIMERO)
  if (
    text.includes("post") ||
    text.includes("postlive") ||
    text.includes("educativo") ||
    text.includes("certificacion") ||
    text.includes("certificación") ||
    text.includes("grabado") ||
    text.includes("on demand") ||
    text.includes("contenido")
  ) {
    return "POSTLIVE";
  }

  // 🔵 LIVE / VIRTUAL
  if (
    text.includes("live") ||
    text.includes("virtual") ||
    text.includes("stream") ||
    text.includes("streaming") ||
    text.includes("online") ||
    text.includes("en vivo") ||
    text.includes("zoom")
  ) {
    return "LIVE";
  }

  // 🔴 FÍSICO / PRESENCIAL
  if (
    text.includes("fisico") ||
    text.includes("físico") ||
    text.includes("presencial") ||
    text.includes("asiento") ||
    text.includes("entrada") ||
    text.includes("ticket")
  ) {
    return "FISICO";
  }

  return "OTRO";
}

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Proteger con token
  const authToken = event.headers['authorization']?.replace('Bearer ', '') || 
                    event.queryStringParameters?.token;
  const validToken = process.env.REPORT_TOKEN || 'cheqfirma2025';
  
  if (authToken !== validToken && event.httpMethod !== 'GET') {
    return {
      statusCode: 401,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Unauthorized' })
    };
  }

  try {
    // Limpiar reservas expiradas
    const cleaned = await cleanExpiredReservations(context);

    // Obtener todos los asientos
    const soldSeats = await getSeatsByStatus(context, SEAT_STATES.SOLD);
    const reservedSeats = await getSeatsByStatus(context, SEAT_STATES.RESERVED);
    const availableSeats = await getSeatsByStatus(context, SEAT_STATES.AVAILABLE);

    const fecha = new Date();
    const fechaFormato = fecha.toISOString().split('T')[0];
    const fechaLegible = fecha.toLocaleDateString('es-PY', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // ============================================
    // ANÁLISIS DE PROBLEMAS Y SOLUCIONES
    // ============================================
    const problemas = [];
    const soluciones = [];

    // Problema 1: Reservas próximas a vencer
    const ahora = new Date();
    const reservasPorVencer = reservedSeats.filter(seat => {
      if (!seat.reservationExpiresAt) return false;
      const vence = new Date(seat.reservationExpiresAt);
      const horasRestantes = (vence - ahora) / (1000 * 60 * 60);
      return horasRestantes > 0 && horasRestantes <= 12;
    });

    if (reservasPorVencer.length > 0) {
      problemas.push({
        tipo: 'URGENTE',
        descripcion: `${reservasPorVencer.length} reservas vencen en las próximas 12 horas`,
        detalles: reservasPorVencer.map(s => `Asiento ${s.seatNumber} - ${s.buyerName || 'Sin nombre'}`)
      });
      soluciones.push({
        problema: 'Reservas por vencer',
        accion: 'Contactar inmediatamente a los clientes para confirmar pago',
        prioridad: 'ALTA'
      });
    }

    // Problema 2: Señas sin completar
    const senasSinCompletar = reservedSeats.filter(seat => {
      const porcentajePagado = (seat.paidAmount || 0) / (seat.totalAmount || 150000);
      return porcentajePagado >= 0.5 && porcentajePagado < 1;
    });

    if (senasSinCompletar.length > 0) {
      problemas.push({
        tipo: 'ATENCIÓN',
        descripcion: `${senasSinCompletar.length} señas pendientes de completar`,
        detalles: senasSinCompletar.map(s => {
          const saldo = (s.totalAmount || 150000) - (s.paidAmount || 0);
          return `Asiento ${s.seatNumber} - ${s.buyerName || 'Sin nombre'} - Saldo: ${saldo.toLocaleString('es-PY')} Gs`;
        })
      });
      soluciones.push({
        problema: 'Señas sin completar',
        accion: 'Enviar recordatorio de saldo pendiente 2 días antes del evento',
        prioridad: 'MEDIA'
      });
    }

    // Problema 3: Baja ocupación
    const ocupacion = ((soldSeats.length + reservedSeats.length) / 100) * 100;
    if (ocupacion < 30) {
      problemas.push({
        tipo: 'CRÍTICO',
        descripcion: `Ocupación muy baja: ${ocupacion.toFixed(1)}% (${soldSeats.length + reservedSeats.length}/100)`,
        detalles: [`Vendidos: ${soldSeats.length}`, `Reservados: ${reservedSeats.length}`, `Disponibles: ${availableSeats.length}`]
      });
      console.log("DEBUG seats vendidos:", vendidos?.length, vendidos?.slice?.(0,2));
console.log("DEBUG seats reservados:", reservados?.length, reservados?.slice?.(0,2));
console.log("DEBUG seats disponibles:", disponibles?.length, disponibles?.slice?.(0,2));

console.log("DEBUG compras virtuales:", virtualPurchases?.length, virtualPurchases?.slice?.(0,2));
console.log("DEBUG compras postlive:", postLivePurchases?.length, postLivePurchases?.slice?.(0,2));
1. DEBUG seats vendidos: <número>

2. DEBUG compras virtuales: <número>

3. DEBUG ejemplo item:
{ ... un objeto ... }


      soluciones.push({
        problema: 'Baja ocupación',
        accion: 'Intensificar campaña de marketing, ofrecer descuentos adicionales, contactar leads anteriores',
        prioridad: 'ALTA'
      });
    }

    // Problema 4: Reservas sin datos completos
    const reservasIncompletas = reservedSeats.filter(s => !s.buyerEmail || !s.buyerPhone);
    if (reservasIncompletas.length > 0) {
      problemas.push({
        tipo: 'ATENCIÓN',
        descripcion: `${reservasIncompletas.length} reservas con datos incompletos`,
        detalles: reservasIncompletas.map(s => `Asiento ${s.seatNumber} - Faltan: ${!s.buyerEmail ? 'Email' : ''} ${!s.buyerPhone ? 'Teléfono' : ''}`)
      });
      soluciones.push({
        problema: 'Datos incompletos',
        accion: 'Solicitar datos faltantes para poder contactar al cliente',
        prioridad: 'MEDIA'
      });
    }

    // Problema 5: Reservas expiradas limpiadas
    if (cleaned > 0) {
      problemas.push({
        tipo: 'INFO',
        descripcion: `${cleaned} reservas expiradas fueron liberadas automáticamente`,
        detalles: ['Estos asientos ahora están disponibles para venta']
      });
    }

    // ============================================
    // RECUENTO DE PLATA
    // ============================================
    const totalRecaudadoVendidos = soldSeats.reduce((sum, s) => sum + (s.paidAmount || s.totalAmount || 0), 0);
    const totalRecaudadoReservas = reservedSeats.reduce((sum, s) => sum + (s.paidAmount || 0), 0);
    const totalRecaudado = totalRecaudadoVendidos + totalRecaudadoReservas;
    const totalPotencial = (soldSeats.length + reservedSeats.length) * 150000;
    const saldoPendiente = totalPotencial - totalRecaudado;

    // Crear Excel
    const workbook = new ExcelJS.Workbook();

    // ============================================
    // HOJA 1: RESUMEN FINANCIERO
    // ============================================
    const wsResumen = workbook.addWorksheet('Resumen Financiero');
    console.log("DEBUG sheet names:", workbook.worksheets.map(w => w.name));
    console.log("DEBUG sheet names:", workbook.worksheets.map(w => w.name));
    console.log("DEBUG escribiendo en hoja:", wsVendidos?.name);

console.log("DEBUG escribiendo en hoja:", ws.name);
console.log("DEBUG set A3:", ws.getCell("A3").value);
console.log("DEBUG set B3:", ws.getCell("B3").value);

    wsResumen.columns = [
      { header: 'Concepto', key: 'concepto', width: 40 },
      { header: 'Cantidad', key: 'cantidad', width: 15 },
      { header: 'Monto (Gs)', key: 'monto', width: 20 }
    ];
    const vendidos = soldSeats; // para que todo el resto use lo mismo
    console.log("DEBUG vendidos:", vendidos?.length);
console.log("DEBUG soldSeats:", soldSeats?.length);

    wsResumen.addRow({ concepto: '=== VENTAS PRESENCIALES ===', cantidad: '', monto: '' });
    wsResumen.addRow({ concepto: 'Total Asientos Vendidos', cantidad: soldSeats.length, monto: totalRecaudadoVendidos });
    wsResumen.addRow({ concepto: 'Total Asientos Reservados', cantidad: reservedSeats.length, monto: totalRecaudadoReservas });
    wsResumen.addRow({ concepto: 'Total Asientos Disponibles', cantidad: availableSeats.length, monto: 0 });
    wsResumen.addRow({ concepto: '', cantidad: '', monto: '' });
    wsResumen.addRow({ concepto: '=== RECUENTO DE PLATA ===', cantidad: '', monto: '' });
    wsResumen.addRow({ concepto: 'Total Recaudado (Pagado)', cantidad: '', monto: totalRecaudado });
    wsResumen.addRow({ concepto: 'Saldo Pendiente (Reservas)', cantidad: '', monto: saldoPendiente });
    wsResumen.addRow({ concepto: 'Total Potencial', cantidad: '', monto: totalPotencial });
    wsResumen.addRow({ concepto: '', cantidad: '', monto: '' });
    wsResumen.addRow({ concepto: '=== ESTADÍSTICAS ===', cantidad: '', monto: '' });
    wsResumen.addRow({ concepto: 'Ocupación Actual', cantidad: `${ocupacion.toFixed(1)}%`, monto: '' });
    wsResumen.addRow({ concepto: 'Fecha del Reporte', cantidad: fechaLegible, monto: '' });
    console.log("DEBUG seats vendidos:", vendidos?.length);
    console.log("DEBUG compras virtuales:", virtualPurchases?.length);
    
    // 👇 ESTE ES CLAVE (un solo ejemplo)
    console.log("DEBUG ejemplo item:", vendidos?.[0] || virtualPurchases?.[0]);
    
    // Estilo
    wsResumen.getRow(1).font = { bold: true };
    wsResumen.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
    wsResumen.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    // ============================================
    // HOJA 2: PROBLEMAS Y SOLUCIONES
    // ============================================
    const wsProblemas = workbook.addWorksheet('Problemas y Soluciones');
    wsProblemas.columns = [
      { header: 'Tipo', key: 'tipo', width: 12 },
      { header: 'Problema', key: 'problema', width: 50 },
      { header: 'Solución', key: 'solucion', width: 60 },
      { header: 'Prioridad', key: 'prioridad', width: 12 }
    ];

    if (problemas.length > 0) {
      problemas.forEach((p, idx) => {
        const solucion = soluciones[idx] || { accion: 'Revisar manualmente', prioridad: 'MEDIA' };
        wsProblemas.addRow({
          tipo: p.tipo,
          problema: p.descripcion,
          solucion: solucion.accion,
          prioridad: solucion.prioridad
        });
      });
    } else {
      wsProblemas.addRow({
        tipo: 'OK',
        problema: 'No se detectaron problemas críticos',
        solucion: 'Sistema funcionando correctamente',
        prioridad: 'BAJA'
      });
    }

    wsProblemas.getRow(1).font = { bold: true };
    wsProblemas.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEF4444' } };
    wsProblemas.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    // ============================================
    // HOJA 3: VENDIDOS
    // ============================================
    if (soldSeats.length > 0) {
      const wsVendidos = workbook.addWorksheet('Vendidos');
      const precioTotal = Number(seat.totalAmount ?? 0);

      wsVendidos.columns = [
        { header: 'Asiento', key: 'asiento', width: 8 },
        { header: 'Ubicación', key: 'ubicacion', width: 25 },
        { header: 'Nombre', key: 'nombre', width: 30 },
        { header: 'Email', key: 'email', width: 35 },
        { header: 'Teléfono', key: 'telefono', width: 15 },
        { header: 'Precio Total (Gs)', key: 'precioTotal', width: 18 },
        { header: 'Monto Pagado (Gs)', key: 'montoPagado', width: 18 },
        { header: 'Método de Pago', key: 'metodo', width: 18 },
        { header: 'Fecha de Venta', key: 'fechaVenta', width: 20 }
      ];

      soldSeats.forEach(seat => {
        const row = Math.ceil(seat.seatNumber / 10);
        const col = seat.seatNumber % 10 || 10;
        const side = col <= 5 ? 'Izquierda' : 'Derecha';
        const position = `Fila ${row}, ${side}, Asiento ${col <= 5 ? col : col - 5}`;

        wsVendidos.addRow({
          asiento: seat.seatNumber,
          ubicacion: position,
          nombre: seat.buyerName || 'N/A',
          email: seat.buyerEmail || 'N/A',
          telefono: seat.buyerPhone || 'N/A',
          precioTotal: seat.totalAmount || 150000,
          montoPagado: seat.paidAmount || seat.totalAmount || 150000,
          metodo: seat.paymentMethod || 'N/A',
          fechaVenta: seat.updatedAt ? new Date(seat.updatedAt).toLocaleString('es-PY') : 'N/A'
        });
      });

      wsVendidos.getRow(1).font = { bold: true };
      wsVendidos.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF70AD47' } };
      wsVendidos.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    }

    // ============================================
    // HOJA 4: RESERVADOS
    // ============================================
    if (reservedSeats.length > 0) {
      const wsReservados = workbook.addWorksheet('Reservados');
      wsReservados.columns = [
        { header: 'Asiento', key: 'asiento', width: 8 },
        { header: 'Ubicación', key: 'ubicacion', width: 25 },
        { header: 'Nombre', key: 'nombre', width: 30 },
        { header: 'Email', key: 'email', width: 35 },
        { header: 'Teléfono', key: 'telefono', width: 15 },
        { header: 'Precio Total (Gs)', key: 'precioTotal', width: 18 },
        { header: 'Monto Pagado (Gs)', key: 'montoPagado', width: 18 },
        { header: 'Saldo Pendiente (Gs)', key: 'saldo', width: 18 },
        { header: 'Vence el', key: 'vence', width: 20 },
        { header: 'Estado', key: 'estado', width: 15 }
      ];

      reservedSeats.forEach(seat => {
        const row = Math.ceil(seat.seatNumber / 10);
        const col = seat.seatNumber % 10 || 10;
        const side = col <= 5 ? 'Izquierda' : 'Derecha';
        const position = `Fila ${row}, ${side}, Asiento ${col <= 5 ? col : col - 5}`;
        const saldo = (seat.totalAmount || 150000) - (seat.paidAmount || 0);
        const porcentaje = Math.round(((seat.paidAmount || 0) / (seat.totalAmount || 150000)) * 100);
        const vence = seat.reservationExpiresAt ? new Date(seat.reservationExpiresAt) : null;
        const horasRestantes = vence ? Math.round((vence - ahora) / (1000 * 60 * 60)) : null;
        let estado = porcentaje >= 50 ? 'Seña 50%' : 'Reserva';
        if (horasRestantes !== null && horasRestantes <= 12) estado += ' - URGENTE';

        wsReservados.addRow({
          asiento: seat.seatNumber,
          ubicacion: position,
          nombre: seat.buyerName || 'N/A',
          email: seat.buyerEmail || 'N/A',
          telefono: seat.buyerPhone || 'N/A',
          precioTotal: seat.totalAmount || 150000,
          montoPagado: seat.paidAmount || 0,
          saldo: saldo,
          vence: vence ? vence.toLocaleString('es-PY') : 'N/A',
          estado: estado
        });
      });

      wsReservados.getRow(1).font = { bold: true };
      wsReservados.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC000' } };
      wsReservados.getRow(1).font = { bold: true, color: { argb: 'FF000000' } };
    }

    // ============================================
    // HOJA 5: DISPONIBLES
    // ============================================
    if (availableSeats.length > 0) {
      const wsDisponibles = workbook.addWorksheet('Disponibles');
      wsDisponibles.columns = [
        { header: 'Asiento', key: 'asiento', width: 8 },
        { header: 'Ubicación', key: 'ubicacion', width: 25 },
        { header: 'Precio (Gs)', key: 'precio', width: 15 }
      ];

      availableSeats.forEach(seat => {
        const row = Math.ceil(seat.seatNumber / 10);
        const col = seat.seatNumber % 10 || 10;
        const side = col <= 5 ? 'Izquierda' : 'Derecha';
        const position = `Fila ${row}, ${side}, Asiento ${col <= 5 ? col : col - 5}`;

        wsDisponibles.addRow({
          asiento: seat.seatNumber,
          ubicacion: position,
          precio: seat.totalAmount || 150000
        });
      });

      wsDisponibles.getRow(1).font = { bold: true };
      wsDisponibles.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE7E6E6' } };
      wsDisponibles.getRow(1).font = { bold: true, color: { argb: 'FF000000' } };
    }

    // Generar buffer
    const buffer = await workbook.xlsx.writeBuffer();
    const base64 = buffer.toString('base64');

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="reporte_completo_${fechaFormato}.xlsx"`
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

