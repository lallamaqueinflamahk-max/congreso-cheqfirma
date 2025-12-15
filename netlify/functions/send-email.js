// Función Netlify para enviar emails reales vía SMTP
// Reemplaza mailto: del frontend
// Usa nodemailer con configuración SMTP desde .env

const { sendSMTPEmail } = require('./smtp-helper');
const { getStore } = require('@netlify/blobs');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
    const { to, subject, body, attachment } = JSON.parse(event.body || '{}');

    if (!to || !subject || !body) {
      return {
        statusCode: 400,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'to, subject y body son requeridos' })
      };
    }

    // Preparar adjuntos si existen
    const attachments = [];
    if (attachment) {
      attachments.push({
        filename: attachment.filename || 'attachment',
        content: Buffer.from(attachment.content, attachment.encoding || 'base64'),
        contentType: attachment.type || 'application/octet-stream'
      });
    }

    // Enviar vía SMTP
    console.log(`📧 Enviando email a: ${to}`);
    
    const result = await sendSMTPEmail({
      to: Array.isArray(to) ? to : [to],
      subject: subject,
      html: body.replace(/\n/g, '<br>'),
      text: body,
      attachments: attachments
    });

    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        success: true, 
        message: 'Email enviado exitosamente vía SMTP',
        result: result
      })
    };

  } catch (error) {
    console.error('❌ Error enviando email vía SMTP:', error);
    
    // Si es error de configuración SMTP, loggear claramente
    if (error.message && (error.message.includes('SMTP') || error.message.includes('Faltan variables'))) {
      console.error('❌ ERROR DE CONFIGURACIÓN SMTP:');
      console.error('   Verifica que estas variables estén configuradas:');
      console.error('   - SMTP_HOST');
      console.error('   - SMTP_PORT');
      console.error('   - SMTP_USER');
      console.error('   - SMTP_APP_PASSWORD');
      
      // Fallback: guardar en store para procesamiento manual
      try {
        const store = getStore({ name: 'emails-queue', siteID: context.site?.id });
        const emailQueue = await store.get('queue', { type: 'json' }) || [];
        emailQueue.push({
          to,
          subject,
          body,
          attachment,
          createdAt: new Date().toISOString(),
          error: error.message
        });
        await store.set('queue', JSON.stringify(emailQueue));

        return {
          statusCode: 200,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            success: false, 
            message: 'Email encolado (error de configuración SMTP)',
            error: error.message
          })
        };
      } catch (storeError) {
        console.error('Error guardando en store:', storeError);
      }
    }
    
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: error.message,
        details: 'Revisa los logs para más información sobre la configuración SMTP'
      })
    };
  }
};

