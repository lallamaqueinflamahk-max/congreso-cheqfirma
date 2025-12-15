// Función programada para reportes automáticos
// Se ejecuta según horarios configurados

const { getAllSeats, getSeatsByStatus, SEAT_STATES } = require('./seats-store');
const sendReportHandler = require('./sendReportNow').handler;

exports.handler = async (event, context) => {
  try {
    const reportType = event.queryStringParameters?.type || 'daily';
    const fecha = new Date();
    const fechaFormato = fecha.toISOString().split('T')[0];
    
    // Obtener estadísticas rápidas
    const soldSeats = await getSeatsByStatus(context, SEAT_STATES.SOLD);
    const reservedSeats = await getSeatsByStatus(context, SEAT_STATES.RESERVED);
    const availableSeats = await getSeatsByStatus(context, SEAT_STATES.AVAILABLE);
    
    const totalVentas = soldSeats.length;
    const totalReservas = reservedSeats.length;
    const ocupacion = ((totalVentas + totalReservas) / 100) * 100;
    
    // Determinar tipo de reporte
    let shouldSend = false;
    let motivo = '';
    
    if (reportType === 'morning') {
      // Reporte de primera hora (mañana)
      shouldSend = true;
      motivo = 'Reporte matutino - Primera hora del día';
    } else if (reportType === 'low-sales') {
      // Reporte si no se vende nada o poco en 24h
      // Comparar con ventas de ayer (simplificado: si ocupación < 10%)
      if (ocupacion < 10) {
        shouldSend = true;
        motivo = 'ALERTA: Baja ocupación detectada (< 10%)';
      }
    } else if (reportType === 'end-day') {
      // Reporte antes de terminar jornada
      const hora = fecha.getHours();
      if (hora >= 18) { // Después de las 6 PM
        shouldSend = true;
        motivo = 'Reporte de fin de jornada - Recuento del día';
      }
    } else {
      // Reporte diario estándar
      shouldSend = true;
      motivo = 'Reporte diario automático';
    }
    
    if (shouldSend) {
      // Generar y enviar reporte
      const fakeEvent = {
        ...event,
        queryStringParameters: { ...event.queryStringParameters, token: process.env.REPORT_TOKEN || 'cheqfirma2025' }
      };
      
      const result = await sendReportHandler(fakeEvent, context);
      
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          reportType: reportType,
          motivo: motivo,
          estadisticas: {
            vendidos: totalVentas,
            reservados: totalReservas,
            disponibles: availableSeats.length,
            ocupacion: `${ocupacion.toFixed(1)}%`
          },
          resultado: result
        })
      };
    } else {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          message: 'Reporte no necesario en este momento',
          reportType: reportType,
          estadisticas: {
            vendidos: totalVentas,
            reservados: totalReservas,
            disponibles: availableSeats.length,
            ocupacion: `${ocupacion.toFixed(1)}%`
          }
        })
      };
    }
    
  } catch (error) {
    console.error('Error en reporte programado:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message })
    };
  }
};

