// Función para actualizar el asiento 20 como vendido
// Se puede llamar directamente o desde el frontend

const { saveSeat, getSeat, SEAT_STATES } = require('./seats-store');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Datos del asiento 20 vendido
    const seatData = {
      seatNumber: 20,
      seatType: 'presencial',
      ticketType: 'general',
      status: SEAT_STATES.SOLD,
      buyerName: 'Juan Carlos Cruzans',
      buyerEmail: 'doctorjccruzans@gmail.com',
      buyerPhone: '+595982288036',
      paymentMethod: 'Transferencia Bancaria',
      paidAmount: 150000,
      totalAmount: 150000,
      reservationExpiresAt: null,
      notes: 'Compra confirmada - RES-1765628644730 - Fecha: 13/12/2025, 9:24:04'
    };

    // Guardar asiento
    const savedSeat = await saveSeat(context, seatData);

    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        message: 'Asiento 20 actualizado como VENDIDO',
        seat: savedSeat
      })
    };

  } catch (error) {
    console.error('Error actualizando asiento 20:', error);
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message })
    };
  }
};

