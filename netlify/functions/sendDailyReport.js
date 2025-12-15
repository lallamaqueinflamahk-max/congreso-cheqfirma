// Función para generar y enviar reporte diario automáticamente
// Se puede ejecutar manualmente o programar con cron externo
// Usa SMTP vía nodemailer (Gmail)

const generateReportHandler = require('./generateDailyReport').handler;
const { sendSMTPEmail, getEmailRecipients } = require('./smtp-helper');

exports.handler = async (event, context) => {
  // Proteger con token
  const authToken = event.headers['authorization']?.replace('Bearer ', '') || 
                    event.queryStringParameters?.token;
  const validToken = process.env.REPORT_TOKEN || 'cheqfirma2025';
  
  if (authToken !== validToken) {
    return {
      statusCode: 401,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Unauthorized' })
    };
  }

  try {
    // 1. Generar reporte Excel
    const reportResponse = await generateReportHandler(event, context);
    
    if (reportResponse.statusCode !== 200) {
      throw new Error('Error generando reporte');
    }

    const excelBase64 = reportResponse.body;
    const fecha = new Date();
    const fechaFormato = fecha.toISOString().split('T')[0];
    const fechaLegible = fecha.toLocaleDateString('es-PY', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    // 2. Obtener destinatarios desde variables de entorno
    const recipients = getEmailRecipients();
    
    if (recipients.to.length === 0) {
      throw new Error('❌ ERROR: EMAIL_TO no configurado. No hay destinatarios para enviar el reporte.');
    }

    // 3. Convertir Excel base64 a Buffer para adjunto
    const excelBuffer = Buffer.from(excelBase64, 'base64');

    // 4. Enviar por email vía SMTP
    console.log('📧 Iniciando envío de email vía SMTP...');
    
    const emailResult = await sendSMTPEmail({
      to: recipients.to,
      cc: recipients.cc,
      bcc: recipients.bcc,
      subject: `Reporte diario de asientos – ${fechaFormato}`,
      html: `
        <h2>Reporte Diario de Asientos - Congreso CheqFirma</h2>
        <p><strong>Fecha:</strong> ${fechaLegible}</p>
        <p>Se adjunta el reporte completo en formato Excel con las siguientes hojas:</p>
        <ul>
          <li><strong>Resumen:</strong> Estadísticas generales</li>
          <li><strong>Vendidos:</strong> Asientos vendidos con todos los datos</li>
          <li><strong>Reservados:</strong> Asientos reservados con vencimientos</li>
          <li><strong>Disponibles:</strong> Asientos disponibles</li>
        </ul>
        <p>Este reporte fue generado automáticamente por el sistema de gestión del Congreso CheqFirma.</p>
      `,
      attachments: [{
        filename: `reporte_asientos_${fechaFormato}.xlsx`,
        content: excelBuffer,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }]
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        message: 'Reporte generado y enviado exitosamente vía SMTP',
        fecha: fechaFormato,
        destinatarios: {
          to: recipients.to,
          cc: recipients.cc,
          bcc: recipients.bcc
        },
        emailResult: emailResult
      })
    };

  } catch (error) {
    console.error('❌ Error enviando reporte diario:', error);
    const errorMessage = error.message || 'Error desconocido';
    
    // Si es error de configuración SMTP, loggear claramente
    if (errorMessage.includes('SMTP') || errorMessage.includes('Faltan variables')) {
      console.error('❌ ERROR DE CONFIGURACIÓN SMTP:');
      console.error('   Verifica que estas variables estén configuradas en .env o Netlify:');
      console.error('   - SMTP_HOST');
      console.error('   - SMTP_PORT');
      console.error('   - SMTP_USER');
      console.error('   - SMTP_APP_PASSWORD');
      console.error('   - EMAIL_TO');
    }
    
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: errorMessage,
        details: 'Revisa los logs para más información sobre la configuración SMTP'
      })
    };
  }
};

