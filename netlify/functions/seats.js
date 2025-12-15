// Función Netlify para manejar asientos
// Usa la misma estructura de datos que el frontend actual
const { getStore } = require('@netlify/blobs');

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const store = getStore({ name: 'seats-data', siteID: context.site?.id });
    const { httpMethod, path } = event;
    
    // GET /api/seats - Obtener todos los asientos
    if (httpMethod === 'GET' && path === '/.netlify/functions/seats') {
      const seatsData = await store.get('seatsData', { type: 'json' }) || {};
      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(seatsData)
      };
    }

    // GET /api/seats/:seatNumber - Obtener un asiento específico
    if (httpMethod === 'GET') {
      const seatNumber = path.split('/').pop();
      const seatData = await store.get(`seat_${seatNumber}`, { type: 'json' });
      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(seatData || null)
      };
    }

    // POST /api/seats - Crear/actualizar asiento
    if (httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { seatNumber, status, customer, paymentMethod, price } = body;

      // Validar datos
      if (!seatNumber || !status) {
        return {
          statusCode: 400,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'seatNumber y status son requeridos' })
        };
      }

      // Cargar seatsData actual
      const seatsData = await store.get('seatsData', { type: 'json' }) || {};
      
      // Actualizar estado del asiento (mantener estructura actual)
      seatsData[seatNumber] = status === 'sold' ? 'sold' : 
                              status === 'reserved' ? `reserved_${Date.now()}_${seatNumber}` : 
                              null;

      // Guardar datos completos del asiento (misma estructura que frontend)
      const seatData = {
        seatNumber: parseInt(seatNumber),
        status: status,
        paymentStatus: status === 'sold' ? 'paid' : 'pending',
        soldAt: status === 'sold' ? new Date().toISOString() : null,
        customer: customer || {},
        paymentMethod: paymentMethod || null,
        price: price || 150000,
        reservationId: status === 'sold' ? `SOLD_${Date.now()}_${seatNumber}` : 
                      status === 'reserved' ? `RESERVED_${Date.now()}_${seatNumber}` : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Guardar en Netlify Blobs (reemplaza localStorage)
      await store.set('seatsData', JSON.stringify(seatsData));
      await store.set(`seat_${seatNumber}`, JSON.stringify(seatData));

      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, seatData })
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };

  } catch (error) {
    console.error('Error en función seats:', error);
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message })
    };
  }
};

