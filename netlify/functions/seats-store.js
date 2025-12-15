// Helper centralizado para gestión de asientos en Netlify Blobs
// ÚNICA FUENTE DE VERDAD para todos los asientos

const { getStore } = require('@netlify/blobs');

const SEAT_STATES = {
  SOLD: 'SOLD',
  RESERVED: 'RESERVED',
  AVAILABLE: 'AVAILABLE'
};

/**
 * Obtener store de asientos
 */
function getSeatsStore(context) {
  return getStore({ 
    name: 'congreso-seats', 
    siteID: context.site?.id 
  });
}

/**
 * Obtener todos los asientos
 */
async function getAllSeats(context) {
  const store = getSeatsStore(context);
  const seats = await store.get('all-seats', { type: 'json' }) || {};
  return seats;
}

/**
 * Obtener un asiento específico
 */
async function getSeat(context, seatNumber) {
  const store = getSeatsStore(context);
  const seat = await store.get(`seat-${seatNumber}`, { type: 'json' });
  return seat || null;
}

/**
 * Guardar un asiento
 */
async function saveSeat(context, seatData) {
  const store = getSeatsStore(context);
  const seatNumber = seatData.seatNumber;
  
  // Validar datos requeridos
  if (!seatNumber || !seatData.status) {
    throw new Error('seatNumber y status son requeridos');
  }
  
  // Validar estado
  if (!Object.values(SEAT_STATES).includes(seatData.status)) {
    throw new Error(`Estado inválido: ${seatData.status}`);
  }
  
  // Asegurar campos requeridos
  const completeSeatData = {
    seatNumber: parseInt(seatNumber),
    seatType: seatData.seatType || 'presencial',
    ticketType: seatData.ticketType || 'general',
    status: seatData.status,
    buyerName: seatData.buyerName || null,
    buyerEmail: seatData.buyerEmail || null,
    buyerPhone: seatData.buyerPhone || null,
    paymentMethod: seatData.paymentMethod || null,
    paidAmount: seatData.paidAmount || 0,
    totalAmount: seatData.totalAmount || 150000,
    reservationExpiresAt: seatData.reservationExpiresAt || null,
    createdAt: seatData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: seatData.notes || null
  };
  
  // Guardar asiento individual
  await store.set(`seat-${seatNumber}`, JSON.stringify(completeSeatData));
  
  // Actualizar índice de todos los asientos
  const allSeats = await getAllSeats(context);
  allSeats[seatNumber] = completeSeatData.status;
  await store.set('all-seats', JSON.stringify(allSeats));
  
  return completeSeatData;
}

/**
 * Obtener asientos por estado
 */
async function getSeatsByStatus(context, status) {
  const allSeats = await getAllSeats(context);
  const seats = [];
  
  for (const seatNumber in allSeats) {
    if (allSeats[seatNumber] === status) {
      const seat = await getSeat(context, seatNumber);
      if (seat) seats.push(seat);
    }
  }
  
  return seats;
}

/**
 * Limpiar reservas expiradas
 */
async function cleanExpiredReservations(context) {
  const reservedSeats = await getSeatsByStatus(context, SEAT_STATES.RESERVED);
  const now = new Date();
  let cleaned = 0;
  
  for (const seat of reservedSeats) {
    if (seat.reservationExpiresAt) {
      const expiresAt = new Date(seat.reservationExpiresAt);
      if (expiresAt < now) {
        // Liberar asiento
        seat.status = SEAT_STATES.AVAILABLE;
        seat.buyerName = null;
        seat.buyerEmail = null;
        seat.buyerPhone = null;
        seat.paymentMethod = null;
        seat.paidAmount = 0;
        seat.reservationExpiresAt = null;
        seat.updatedAt = new Date().toISOString();
        seat.notes = (seat.notes || '') + ` [Liberado automáticamente: ${now.toISOString()}]`;
        
        await saveSeat(context, seat);
        cleaned++;
      }
    }
  }
  
  return cleaned;
}

/**
 * Inicializar todos los asientos como AVAILABLE
 */
async function initializeSeats(context, totalSeats = 100) {
  const store = getSeatsStore(context);
  const allSeats = {};
  
  for (let i = 1; i <= totalSeats; i++) {
    const seatData = {
      seatNumber: i,
      seatType: 'presencial',
      ticketType: 'general',
      status: SEAT_STATES.AVAILABLE,
      buyerName: null,
      buyerEmail: null,
      buyerPhone: null,
      paymentMethod: null,
      paidAmount: 0,
      totalAmount: 150000,
      reservationExpiresAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: null
    };
    
    await store.set(`seat-${i}`, JSON.stringify(seatData));
    allSeats[i] = SEAT_STATES.AVAILABLE;
  }
  
  await store.set('all-seats', JSON.stringify(allSeats));
  return { initialized: totalSeats };
}

module.exports = {
  SEAT_STATES,
  getSeatsStore,
  getAllSeats,
  getSeat,
  saveSeat,
  getSeatsByStatus,
  cleanExpiredReservations,
  initializeSeats
};

