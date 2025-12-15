// Función para obtener todos los asientos (frontend)
// Reemplaza lectura de localStorage

const { getAllSeats, getSeat, getSeatsByStatus, SEAT_STATES } = require('./seats-store');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { seatNumber, status } = event.queryStringParameters || {};

    // Obtener asiento específico
    if (seatNumber) {
      const seat = await getSeat(context, seatNumber);
      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(seat)
      };
    }

    // Obtener por estado
    if (status) {
      const seats = await getSeatsByStatus(context, status);
      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(seats)
      };
    }

    // Obtener todos los asientos
    const allSeatsIndex = await getAllSeats(context);
    const allSeats = [];

    for (const seatNum in allSeatsIndex) {
      const seat = await getSeat(context, seatNum);
      if (seat) allSeats.push(seat);
    }

    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(allSeats)
    };

  } catch (error) {
    console.error('Error obteniendo asientos:', error);
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message })
    };
  }
};

