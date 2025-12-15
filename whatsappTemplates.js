// Templates de mensajes WhatsApp
// Alineados con los estados reales del backend: SOLD, RESERVED, AVAILABLE
// Usar placeholders [NOMBRE], [ASIENTO], [FECHA], etc.

const whatsappTemplates = {
  // RESERVA SIN PAGO (primer aviso – 24h)
  reservationPendingFirst: (data) => {
    return `*RESERVA TEMPORAL - CONGRESO CHEQFIRMA*

Estimado/a [NOMBRE],

Tu reserva ha sido registrada exitosamente.

📋 *DETALLES DE TU RESERVA:*
• Asiento: [ASIENTO]
• ID de Reserva: [ID_RESERVA]
• Estado: Reservado (Pago pendiente)
• Válido hasta: [FECHA_VENCIMIENTO]

⏰ *IMPORTANTE:*
Tienes 24 horas para completar el pago. Después de este tiempo, tu reserva será liberada automáticamente.

💳 *Para completar tu pago:*
1. Sube tu comprobante de pago en la plataforma
2. O contacta a +549 3536 564940

¡Esperamos verte en el congreso!

Equipo CheqFirma
cheqfirma@gmail.com
+549 3536 564940`
      .replace('[NOMBRE]', data.buyerName || 'Cliente')
      .replace('[ASIENTO]', data.seatNumber || 'N/A')
      .replace('[ID_RESERVA]', data.reservationId || 'N/A')
      .replace('[FECHA_VENCIMIENTO]', data.reservationExpiresAt ? new Date(data.reservationExpiresAt).toLocaleString('es-PY') : 'N/A');
  },

  // RESERVA SIN PAGO (último aviso)
  reservationPendingLast: (data) => {
    const hoursRemaining = data.hoursRemaining || 2;
    return `*⏰ ÚLTIMO AVISO - RESERVA PENDIENTE*

Estimado/a [NOMBRE],

Tu reserva del Asiento [ASIENTO] expira en ${hoursRemaining} horas.

Si no completas el pago antes de ese tiempo, el asiento será liberado automáticamente.

💳 *Completa tu pago ahora:*
• Sube tu comprobante en la plataforma
• O contacta a +549 3536 564940

No pierdas tu lugar en el congreso.

Equipo CheqFirma
+549 3536 564940`
      .replace('[NOMBRE]', data.buyerName || 'Cliente')
      .replace('[ASIENTO]', data.seatNumber || 'N/A');
  },

  // RESERVA CON SEÑA (recordatorio de saldo)
  depositReminder: (data) => {
    const saldo = (data.totalAmount || 150000) - (data.paidAmount || 0);
    const porcentajePagado = Math.round(((data.paidAmount || 0) / (data.totalAmount || 150000)) * 100);
    
    return `*SEÑA REGISTRADA - CONGRESO CHEQFIRMA*

Estimado/a [NOMBRE],

Hemos registrado tu seña del ${porcentajePagado}%.

📋 *DETALLES:*
• Asiento: [ASIENTO]
• Seña pagada: [MONTO_PAGADO] Gs
• Saldo pendiente: [SALDO] Gs
• Precio total: [PRECIO_TOTAL] Gs

⏰ *IMPORTANTE:*
Debes completar el pago restante hasta 2 días antes del evento (17 de Diciembre).

💳 *Para completar tu pago:*
• Sube tu comprobante en la plataforma
• O contacta a +549 3536 564940

Equipo CheqFirma
+549 3536 564940`
      .replace('[NOMBRE]', data.buyerName || 'Cliente')
      .replace('[ASIENTO]', data.seatNumber || 'N/A')
      .replace('[MONTO_PAGADO]', (data.paidAmount || 0).toLocaleString('es-PY'))
      .replace('[SALDO]', saldo.toLocaleString('es-PY'))
      .replace('[PRECIO_TOTAL]', (data.totalAmount || 150000).toLocaleString('es-PY'));
  },

  // FIN DE PROMO / AUMENTO DE PRECIO
  promoEnded: (data) => {
    return `*PROMOCIÓN FINALIZADA - CONGRESO CHEQFIRMA*

Estimado/a [NOMBRE],

La promoción de preventa ha finalizado. Los precios ahora son regulares.

💰 *Nuevos precios:*
• Precio regular: [PRECIO_NUEVO] Gs
• (Anterior: [PRECIO_ANTERIOR] Gs con descuento)

Aún puedes adquirir tu entrada al congreso con los precios actuales.

📅 *Evento:* 19-20 Diciembre 2025
📍 *Lugar:* Asunción, Paraguay

Para más información:
• Email: cheqfirma@gmail.com
• WhatsApp: +549 3536 564940

Equipo CheqFirma`
      .replace('[NOMBRE]', data.buyerName || 'Cliente')
      .replace('[PRECIO_NUEVO]', (data.newPrice || 200000).toLocaleString('es-PY'))
      .replace('[PRECIO_ANTERIOR]', (data.oldPrice || 150000).toLocaleString('es-PY'));
  },

  // ÚLTIMOS CUPOS
  lastSeats: (availableSeats) => {
    return `*🚨 ÚLTIMOS CUPOS DISPONIBLES*

Solo quedan ${availableSeats} asientos disponibles para el Congreso CheqFirma.

No pierdas esta oportunidad única de aprender sobre ADN Humano con expertos internacionales.

📅 19-20 Diciembre 2025
📍 Asunción, Paraguay

Reserva tu lugar ahora:
• WhatsApp: +549 3536 564940
• Email: cheqfirma@gmail.com

Equipo CheqFirma`;

  },

  // CONFIRMACIÓN DE PAGO
  paymentConfirmed: (data) => {
    const row = Math.ceil(data.seatNumber / 10);
    const col = data.seatNumber % 10 || 10;
    const side = col <= 5 ? 'Izquierda' : 'Derecha';
    const position = `Fila ${row}, ${side}, Asiento ${col <= 5 ? col : col - 5}`;
    
    return `*✅ PAGO CONFIRMADO - CONGRESO CHEQFIRMA*

Estimado/a [NOMBRE],

Tu pago ha sido confirmado exitosamente.

📋 *DETALLES DE TU COMPRA:*
• Asiento: [ASIENTO]
• Ubicación: ${position}
• Precio: [PRECIO] Gs
• Método de Pago: [METODO_PAGO]
• Estado: ✅ Pagado

📅 *EVENTO:*
• Fecha: 19-20 Diciembre 2025
• Lugar: Auditorio "Ruiz Diaz", Manzana de la Rivera, Asunción

📌 *IMPORTANTE:*
• Presenta este mensaje al llegar al evento
• Tu asiento está garantizado
• Llega 30 minutos antes del inicio

¡Esperamos verte en el congreso!

Equipo CheqFirma
cheqfirma@gmail.com
+549 3536 564940`
      .replace('[NOMBRE]', data.buyerName || 'Cliente')
      .replace('[ASIENTO]', data.seatNumber || 'N/A')
      .replace('[PRECIO]', (data.totalAmount || 150000).toLocaleString('es-PY'))
      .replace('[METODO_PAGO]', data.paymentMethod || 'N/A');
  },

  // DUDA POR ASISTENCIA (streaming / grabación)
  attendanceInquiry: (data) => {
    return `*ALTERNATIVA DE ASISTENCIA - CONGRESO CHEQFIRMA*

Estimado/a [NOMBRE],

Entendemos que podrías tener dudas sobre tu asistencia al evento presencial.

📺 *ALTERNATIVAS DISPONIBLES:*

1️⃣ *STREAMING EN VIVO*
• Acceso en tiempo real durante el evento
• Interacción con los expositores
• Disponible para asientos presenciales

2️⃣ *GRABACIÓN POST-EVENTO*
• Acceso a todas las grabaciones
• Disponible después del evento
• Materiales adicionales incluidos

Si no puedes asistir presencialmente, podemos cambiar tu modalidad sin costo adicional.

📧 *Contacta para más información:*
• Email: cheqfirma@gmail.com
• WhatsApp: +549 3536 564940

Equipo CheqFirma`
      .replace('[NOMBRE]', data.buyerName || 'Cliente');
  },

  // STREAMING / GRABACIÓN
  streamingAccess: (customerName, accessLink, credentials) => {
    return `*ACCESO A STREAMING - CONGRESO CHEQFIRMA*

Estimado/a ${customerName},

Aquí están tus credenciales de acceso al streaming en vivo:

🔗 *Enlace:* ${accessLink}
👤 *Usuario:* ${credentials.username}
🔑 *Contraseña:* ${credentials.password}

📅 *HORARIOS:*
• Día 1: 19 de Diciembre - 8:00 AM
• Día 2: 20 de Diciembre - 8:00 AM

Guarda estas credenciales de forma segura.

Equipo CheqFirma`;

  },

  // LIBERACIÓN DE ASIENTO
  seatReleased: (data) => {
    return `*RESERVA LIBERADA - CONGRESO CHEQFIRMA*

Estimado/a [NOMBRE],

Tu reserva del Asiento [ASIENTO] ha sido liberada.

📋 *Razón:* [RAZON]

Si deseas reservar nuevamente, puedes hacerlo a través de nuestra plataforma.

Para más información:
• WhatsApp: +549 3536 564940
• Email: cheqfirma@gmail.com

Equipo CheqFirma`
      .replace('[NOMBRE]', data.buyerName || 'Cliente')
      .replace('[ASIENTO]', data.seatNumber || 'N/A')
      .replace('[RAZON]', data.reason || 'Reserva expirada');
  },

  // ÚLTIMOS CUPOS
  lastSeats: (data) => {
    return `*🚨 ÚLTIMOS CUPOS DISPONIBLES*

Solo quedan [CUPOS_DISPONIBLES] asientos disponibles para el Congreso CheqFirma.

No pierdas esta oportunidad única de aprender sobre ADN Humano con expertos internacionales.

📅 19-20 Diciembre 2025
📍 Asunción, Paraguay

Reserva tu lugar ahora:
• WhatsApp: +549 3536 564940
• Email: cheqfirma@gmail.com

Equipo CheqFirma`
      .replace('[CUPOS_DISPONIBLES]', data.availableSeats || 'pocos');
  }
};

// Exportar para uso en backend
if (typeof module !== 'undefined' && module.exports) {
  module.exports = whatsappTemplates;
}

// Disponible globalmente en frontend
if (typeof window !== 'undefined') {
  window.whatsappTemplates = whatsappTemplates;
}

