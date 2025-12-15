// Helper para envío de emails vía SMTP usando nodemailer
// Lee variables desde .env: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_APP_PASSWORD

const nodemailer = require('nodemailer');

/**
 * Validar y obtener configuración SMTP desde variables de entorno
 * @returns {Object} Configuración SMTP validada
 * @throws {Error} Si falta alguna variable requerida
 */
function getSMTPConfig() {
  const requiredVars = {
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_APP_PASSWORD: process.env.SMTP_APP_PASSWORD
  };

  // Validar variables requeridas
  const missingVars = [];
  for (const [key, value] of Object.entries(requiredVars)) {
    if (!value || value.trim() === '') {
      missingVars.push(key);
    }
  }

  if (missingVars.length > 0) {
    const errorMsg = `❌ ERROR: Faltan variables SMTP requeridas: ${missingVars.join(', ')}. Configúralas en .env o variables de entorno de Netlify.`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  // Validar que SMTP_PORT sea un número
  const port = parseInt(requiredVars.SMTP_PORT, 10);
  if (isNaN(port) || port < 1 || port > 65535) {
    const errorMsg = `❌ ERROR: SMTP_PORT debe ser un número válido (1-65535). Valor recibido: ${requiredVars.SMTP_PORT}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  console.log('✅ Configuración SMTP validada correctamente');
  console.log(`   SMTP_HOST: ${requiredVars.SMTP_HOST}`);
  console.log(`   SMTP_PORT: ${port}`);
  console.log(`   SMTP_USER: ${requiredVars.SMTP_USER}`);
  console.log(`   SMTP_APP_PASSWORD: ${requiredVars.SMTP_APP_PASSWORD ? '***' + requiredVars.SMTP_APP_PASSWORD.slice(-4) : 'NO CONFIGURADO'}`);

  return {
    host: requiredVars.SMTP_HOST,
    port: port,
    secure: port === 465, // true para 465, false para otros puertos
    auth: {
      user: requiredVars.SMTP_USER,
      pass: requiredVars.SMTP_APP_PASSWORD
    }
  };
}

/**
 * Crear transporter de nodemailer con configuración SMTP
 * @returns {Object} Transporter de nodemailer
 */
function createSMTPTransporter() {
  const config = getSMTPConfig();

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: false,            // IMPORTANTE para 587
    auth: config.auth,
    requireTLS: true,         // fuerza STARTTLS
    tls: { minVersion: 'TLSv1.2' }
  });

  console.log('✅ Transporter SMTP creado exitosamente');
  return transporter;
}



/**
 * Obtener destinatarios desde variables de entorno
 * @returns {Object} { to, cc, bcc }
 */
function getEmailRecipients() {
  const emailTo = process.env.EMAIL_TO || '';
  const emailCC = process.env.EMAIL_CC || '';
  const emailBCC = process.env.EMAIL_BCC || '';

  // Parsear EMAIL_TO (puede ser lista separada por comas)
  const to = emailTo.split(',').map(e => e.trim()).filter(e => e);
  
  // Parsear EMAIL_CC (opcional)
  const cc = emailCC ? emailCC.split(',').map(e => e.trim()).filter(e => e) : undefined;
  
  // Parsear EMAIL_BCC (opcional)
  const bcc = emailBCC ? emailBCC.split(',').map(e => e.trim()).filter(e => e) : undefined;

  if (to.length === 0) {
    console.warn('⚠️  ADVERTENCIA: EMAIL_TO no configurado o vacío');
  }

  return { to, cc, bcc };
}

/**
 * Enviar email vía SMTP
 * @param {Object} options - Opciones del email
 * @param {string|Array} options.to - Destinatarios
 * @param {string|Array} [options.cc] - Copia
 * @param {string|Array} [options.bcc] - Copia oculta
 * @param {string} options.subject - Asunto
 * @param {string} options.html - Cuerpo HTML
 * @param {string} options.text - Cuerpo texto (opcional)
 * @param {Array} [options.attachments] - Adjuntos
 * @returns {Promise<Object>} Resultado del envío
 */
async function sendSMTPEmail(options) {
  try {
    // Validar configuración SMTP
    const smtpConfig = getSMTPConfig();
    const transporter = createSMTPTransporter();

    // Obtener remitente desde SMTP_USER
    const from = process.env.SMTP_USER;
    if (!from) {
      throw new Error('❌ ERROR: SMTP_USER no configurado. No se puede determinar el remitente.');
    }

    console.log(`📧 Enviando email desde: ${from}`);
    console.log(`📧 Destinatarios TO: ${Array.isArray(options.to) ? options.to.join(', ') : options.to}`);
    if (options.cc) {
      console.log(`📧 Destinatarios CC: ${Array.isArray(options.cc) ? options.cc.join(', ') : options.cc}`);
    }
    if (options.bcc) {
      console.log(`📧 Destinatarios BCC: ${Array.isArray(options.bcc) ? options.bcc.join(', ') : options.bcc}`);
    }

    // Preparar opciones del email
    const mailOptions = {
      from: from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ''), // Convertir HTML a texto si no se proporciona
      attachments: options.attachments || []
    };

    // Agregar CC y BCC si existen
    if (options.cc && options.cc.length > 0) {
      mailOptions.cc = options.cc;
    }
    if (options.bcc && options.bcc.length > 0) {
      mailOptions.bcc = options.bcc;
    }

    // Verificar conexión SMTP
    await transporter.verify();
    console.log('✅ Conexión SMTP verificada correctamente');

    // Enviar email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email enviado exitosamente');
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   Response: ${info.response}`);

    return {
      success: true,
      messageId: info.messageId,
      response: info.response,
      accepted: info.accepted,
      rejected: info.rejected
    };

  } catch (error) {
    console.error('❌ Error enviando email vía SMTP:', error);
    throw error;
  }
}

module.exports = {
  getSMTPConfig,
  createSMTPTransporter,
  getEmailRecipients,
  sendSMTPEmail
};

