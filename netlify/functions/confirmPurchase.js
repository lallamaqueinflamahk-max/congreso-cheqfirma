// Función para confirmar compra/reserva de asiento
// Reemplaza toda la lógica de alert() y pop-ups del frontend

const { saveSeat, getSeat, SEAT_STATES } = require('./seats-store');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const {
      seatNumber,
      buyerName,
      buyerEmail,
      buyerPhone,
      paymentMethod,
      paidAmount,
      totalAmount,
      isDeposit // true si es seña del 50%, false si es pago total
    } = body;

    // Validaciones
    if (!seatNumber || !buyerName || !buyerEmail || !buyerPhone) {
      return {
        statusCode: 400,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Datos incompletos: seatNumber, buyerName, buyerEmail, buyerPhone son requeridos' })
      };
    }

    // Verificar que el asiento existe y está disponible
    const existingSeat = await getSeat(context, seatNumber);
    
    if (existingSeat && existingSeat.status === SEAT_STATES.SOLD) {
      return {
        statusCode: 409,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Asiento ya vendido' })
      };
    }

    if (existingSeat && existingSeat.status === SEAT_STATES.RESERVED) {
      // Verificar si es la misma persona o si la reserva expiró
      const now = new Date();
      if (existingSeat.reservationExpiresAt && new Date(existingSeat.reservationExpiresAt) < now) {
        // Reserva expirada, puede comprar
      } else if (existingSeat.buyerEmail !== buyerEmail) {
        return {
          statusCode: 409,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Asiento ya reservado por otra persona' })
        };
      }
    }

    // Determinar estado según tipo de pago
    let status;
    let reservationExpiresAt = null;
    
    if (isDeposit && paidAmount >= (totalAmount * 0.5)) {
      // Seña del 50% o más = RESERVED
      status = SEAT_STATES.RESERVED;
      // Reserva válida por 48 horas (2 días antes del evento)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 48);
      reservationExpiresAt = expiresAt.toISOString();
    } else if (paidAmount >= totalAmount) {
      // Pago total = SOLD
      status = SEAT_STATES.SOLD;
    } else {
      // Pago parcial menor al 50% = RESERVED con 24h
      status = SEAT_STATES.RESERVED;
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);
      reservationExpiresAt = expiresAt.toISOString();
    }

    // Guardar asiento
    const seatData = await saveSeat(context, {
      seatNumber: parseInt(seatNumber),
      seatType: 'presencial',
      ticketType: 'general',
      status: status,
      buyerName: buyerName,
      buyerEmail: buyerEmail,
      buyerPhone: buyerPhone,
      paymentMethod: paymentMethod || 'transferencia',
      paidAmount: paidAmount || 0,
      totalAmount: totalAmount || 150000,
      reservationExpiresAt: reservationExpiresAt,
      notes: isDeposit ? `Seña del ${Math.round((paidAmount / totalAmount) * 100)}%` : 'Pago completo'
    });

    // Calcular ubicación del asiento
    const row = Math.ceil(seatNumber / 10);
    const col = seatNumber % 10 || 10;
    const side = col <= 5 ? 'Izquierda' : 'Derecha';
    const position = `Fila ${row}, ${side}, Asiento ${col <= 5 ? col : col - 5}`;

    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        seat: {
          ...seatData,
          position: position
        },
        message: status === SEAT_STATES.SOLD ? 'Compra confirmada' : 'Reserva confirmada'
      })
    };

  } catch (error) {
    console.error('Error confirmando compra:', error);
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message })
    };
  }
};

