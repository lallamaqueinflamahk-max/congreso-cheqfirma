// Función para generar y enviar reporte INMEDIATAMENTE
// Con análisis de problemas y soluciones
// Usa SMTP vía nodemailer (Gmail)
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const generateReportHandler = require('./generateReportWithAnalysis').handler;

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
    // 1. Generar reporte con análisis
    const token = process.env.REPORT_TOKEN || 'cheqfirma2025';

const eventForReport = {
  ...event,
  headers: {
    ...(event.headers || {}),
    authorization: `Bearer ${token}`,
  },
  queryStringParameters: {
    ...(event.queryStringParameters || {}),
    token, // por si el handler usa queryString
  },
};
const reportResponse = await generateReportHandler(eventForReport, context);

console.log("REPORT status:", reportResponse?.statusCode);
console.log("REPORT body (raw):", reportResponse?.body);

if (reportResponse?.statusCode !== 200) {
  const err = new Error('Error generando reporte');
  console.error("ERROR REAL:", err);
  console.error(err?.stack || err);
  console.log("CWD:", process.cwd());
  console.log("DIR:", __dirname);
  console.log("ENV keys:", Object.keys(process.env).filter(k=>k.includes("SMTP")||k.includes("EMAIL")||k.includes("REPORT")||k.includes("SEAT")));
  throw err;
}


    const excelBase64 = reportResponse.body;
    const fecha = new Date();
    const fechaFormato = fecha.toISOString().split('T')[0];
    const hora = fecha.toLocaleTimeString('es-PY', { hour: '2-digit', minute: '2-digit' });
    const fechaLegible = fecha.toLocaleDateString('es-PY', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    // 2. Obtener destinatarios desde variables de entorno
    const { sendSMTPEmail, getEmailRecipients } = require('./smtp-helper');
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
      subject: `📊 Reporte Completo de Asientos – ${fechaFormato} ${hora}`,
      html: `
        <h2>📊 Reporte Completo de Asientos - Congreso CheqFirma</h2>
        <p><strong>Fecha y Hora:</strong> ${fechaLegible} ${hora}</p>
        
        <h3>📋 Contenido del Reporte:</h3>
        <ul>
          <li><strong>Resumen Financiero:</strong> Recuento completo de plata ganada</li>
          <li><strong>Problemas y Soluciones:</strong> Análisis de problemas detectados y acciones recomendadas</li>
          <li><strong>Vendidos:</strong> Lista completa de asientos vendidos</li>
          <li><strong>Reservados:</strong> Asientos reservados con vencimientos</li>
          <li><strong>Disponibles:</strong> Asientos disponibles para venta</li>
        </ul>
        
        <p><strong>⚠️ IMPORTANTE:</strong> Revisar la hoja "Problemas y Soluciones" para acciones urgentes.</p>
        
        <p>Este reporte fue generado automáticamente por el sistema de gestión del Congreso CheqFirma.</p>
      `,
      attachments: [{
        filename: `reporte_completo_${fechaFormato}.xlsx`,
        content: excelBuffer,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }]
    });

    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        message: 'Reporte generado y enviado exitosamente vía SMTP',
        fecha: fechaFormato,
        hora: hora,
        destinatarios: {
          to: recipients.to,
          cc: recipients.cc,
          bcc: recipients.bcc
        },
        emailResult: emailResult
      })
    };

  } catch (error) {
    console.error('❌ Error enviando reporte:', error);
    console.error("ERROR REAL:", error);
    console.error(error?.stack || error);
    console.log("CWD:", process.cwd());
    console.log("DIR:", __dirname);
    console.log("ENV keys:", Object.keys(process.env).filter(k=>k.includes("SMTP")||k.includes("EMAIL")||k.includes("REPORT")||k.includes("SEAT")));
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
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: errorMessage,
        details: 'Revisa los logs para más información sobre la configuración SMTP'
      })
    };
  }
};

