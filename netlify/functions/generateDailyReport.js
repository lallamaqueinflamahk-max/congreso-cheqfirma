// Función para generar reporte diario en Excel
// Lee TODOS los asientos desde backend y genera Excel con 4 hojas

const { getAllSeats, getSeat, getSeatsByStatus, cleanExpiredReservations, SEAT_STATES } = require('./seats-store');
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

  // Proteger con token
  const authToken = event.headers['authorization']?.replace('Bearer ', '') || 
                    event.queryStringParameters?.token;
  const validToken = process.env.REPORT_TOKEN || 'cheqfirma2025';
  
  if (authToken !== validToken) {
    return {
      statusCode: 401,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Unauthorized' })
    };
  }

  try {
    // Limpiar reservas expiradas antes de generar reporte
    await cleanExpiredReservations(context);

    // Obtener todos los asientos por estado
    const soldSeats = await getSeatsByStatus(context, SEAT_STATES.SOLD);
    const reservedSeats = await getSeatsByStatus(context, SEAT_STATES.RESERVED);
    const availableSeats = await getSeatsByStatus(context, SEAT_STATES.AVAILABLE);

    const fecha = new Date();
    const fechaFormato = fecha.toISOString().split('T')[0];
    const fechaLegible = fecha.toLocaleDateString('es-PY', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    // Crear Excel
    const workbook = new ExcelJS.Workbook();

    // ============================================
    // HOJA 1: RESUMEN
    // ============================================
    const wsResumen = workbook.addWorksheet('Resumen');
    wsResumen.columns = [
      { header: 'Concepto', key: 'concepto', width: 35 },
      { header: 'Cantidad', key: 'cantidad', width: 15 },
      { header: 'Monto (Gs)', key: 'monto', width: 18 }
    ];

    const totalRecaudado = soldSeats.reduce((sum, s) => sum + (s.paidAmount || s.totalAmount || 0), 0);
    const totalReservado = reservedSeats.reduce((sum, s) => sum + (s.paidAmount || 0), 0);

    wsResumen.addRow({ concepto: 'Total Asientos Vendidos', cantidad: soldSeats.length, monto: totalRecaudado });
    wsResumen.addRow({ concepto: 'Total Asientos Reservados', cantidad: reservedSeats.length, monto: totalReservado });
    wsResumen.addRow({ concepto: 'Total Asientos Disponibles', cantidad: availableSeats.length, monto: 0 });
    wsResumen.addRow({ concepto: 'Total General', cantidad: 100, monto: totalRecaudado + totalReservado });
    wsResumen.addRow({ concepto: 'Fecha del Reporte', cantidad: fechaLegible, monto: '' });
    wsResumen.addRow({ concepto: 'Total Recaudado (Pagado)', cantidad: '', monto: totalRecaudado });
    wsResumen.addRow({ concepto: 'Total en Reservas (Señas)', cantidad: '', monto: totalReservado });

    // Estilo para encabezados
    wsResumen.getRow(1).font = { bold: true };
    wsResumen.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    };
    wsResumen.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    // ============================================
    // HOJA 2: VENDIDOS
    // ============================================
    if (soldSeats.length > 0) {
      const wsVendidos = workbook.addWorksheet('Vendidos');
      wsVendidos.columns = [
        { header: 'Asiento', key: 'asiento', width: 8 },
        { header: 'Ubicación', key: 'ubicacion', width: 25 },
        { header: 'Nombre', key: 'nombre', width: 30 },
        { header: 'Email', key: 'email', width: 35 },
        { header: 'Teléfono', key: 'telefono', width: 15 },
        { header: 'Precio Total (Gs)', key: 'precioTotal', width: 18 },
        { header: 'Monto Pagado (Gs)', key: 'montoPagado', width: 18 },
        { header: 'Método de Pago', key: 'metodo', width: 18 },
        { header: 'Fecha de Venta', key: 'fechaVenta', width: 20 },
        { header: 'ID de Reserva', key: 'idReserva', width: 25 },
        { header: 'Notas', key: 'notas', width: 30 }
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
          fechaVenta: seat.updatedAt ? new Date(seat.updatedAt).toLocaleString('es-PY') : 'N/A',
          idReserva: seat.notes || 'N/A',
          notas: seat.notes || ''
        });
      });

      wsVendidos.getRow(1).font = { bold: true };
      wsVendidos.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF70AD47' }
      };
      wsVendidos.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    }

    // ============================================
    // HOJA 3: RESERVADOS
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
        { header: 'Método de Pago', key: 'metodo', width: 18 },
        { header: 'Fecha de Reserva', key: 'fechaReserva', width: 20 },
        { header: 'Vence el', key: 'vence', width: 20 },
        { header: 'Notas', key: 'notas', width: 30 }
      ];

      reservedSeats.forEach(seat => {
        const row = Math.ceil(seat.seatNumber / 10);
        const col = seat.seatNumber % 10 || 10;
        const side = col <= 5 ? 'Izquierda' : 'Derecha';
        const position = `Fila ${row}, ${side}, Asiento ${col <= 5 ? col : col - 5}`;
        const saldo = (seat.totalAmount || 150000) - (seat.paidAmount || 0);

        wsReservados.addRow({
          asiento: seat.seatNumber,
          ubicacion: position,
          nombre: seat.buyerName || 'N/A',
          email: seat.buyerEmail || 'N/A',
          telefono: seat.buyerPhone || 'N/A',
          precioTotal: seat.totalAmount || 150000,
          montoPagado: seat.paidAmount || 0,
          saldo: saldo,
          metodo: seat.paymentMethod || 'Pendiente',
          fechaReserva: seat.createdAt ? new Date(seat.createdAt).toLocaleString('es-PY') : 'N/A',
          vence: seat.reservationExpiresAt ? new Date(seat.reservationExpiresAt).toLocaleString('es-PY') : 'N/A',
          notas: seat.notes || ''
        });
      });

      wsReservados.getRow(1).font = { bold: true };
      wsReservados.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFC000' }
      };
      wsReservados.getRow(1).font = { bold: true, color: { argb: 'FF000000' } };
    }

    // ============================================
    // HOJA 4: DISPONIBLES
    // ============================================
    if (availableSeats.length > 0) {
      const wsDisponibles = workbook.addWorksheet('Disponibles');
      wsDisponibles.columns = [
        { header: 'Asiento', key: 'asiento', width: 8 },
        { header: 'Ubicación', key: 'ubicacion', width: 25 },
        { header: 'Estado', key: 'estado', width: 12 },
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
          estado: 'Disponible',
          precio: seat.totalAmount || 150000
        });
      });

      wsDisponibles.getRow(1).font = { bold: true };
      wsDisponibles.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE7E6E6' }
      };
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

