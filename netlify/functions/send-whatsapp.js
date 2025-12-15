// Función Netlify para enviar mensajes WhatsApp
// Reemplaza window.open('wa.me/...') del frontend
// Usa Twilio API o similar (configurar en variables de entorno)

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
    const { phone, message, template } = JSON.parse(event.body || '{}');

    if (!phone || !message) {
      return {
        statusCode: 400,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'phone y message son requeridos' })
      };
    }

    // Limpiar número de teléfono
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Si tiene template, usar whatsappTemplates
    let finalMessage = message;
    if (template) {
      // Los templates se manejan en el frontend, aquí solo enviamos
      finalMessage = message;
    }

    // Opción 1: Usar Twilio API (configurar TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
    const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
    const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';

    if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
      const twilioResponse = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            From: TWILIO_WHATSAPP_NUMBER,
            To: `whatsapp:+${cleanPhone}`,
            Body: finalMessage
          })
        }
      );

      if (!twilioResponse.ok) {
        throw new Error(`Twilio API error: ${twilioResponse.statusText}`);
      }

      const result = await twilioResponse.json();

      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, result })
      };
    }

    // Opción 2: Fallback - guardar en store para procesamiento manual
    // O devolver URL de wa.me para que el frontend la abra (temporal)
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(finalMessage)}`;

    return {
      statusCode: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        success: true, 
        whatsappUrl,
        message: 'Twilio no configurado - usar URL manual' 
      })
    };

  } catch (error) {
    console.error('Error enviando WhatsApp:', error);
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message })
    };
  }
};

