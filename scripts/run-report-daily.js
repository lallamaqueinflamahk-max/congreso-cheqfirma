// Script para ejecutar sendDailyReport desde línea de comandos
// Simula el contexto de Netlify Function

require('dotenv').config({ path: '.env' });

const handler = require('../netlify/functions/sendDailyReport').handler;

// Simular evento de Netlify
const mockEvent = {
  httpMethod: 'GET',
  headers: {},
  queryStringParameters: {
    token: process.env.REPORT_TOKEN || 'cheqfirma2025'
  },
  body: null
};

// Simular contexto de Netlify
const mockContext = {
  site: {
    id: 'local-dev'
  }
};

// Ejecutar handler
(async () => {
  try {
    console.log('🚀 Iniciando generación de reporte diario...\n');
    const result = await handler(mockEvent, mockContext);
    
    if (result.statusCode === 200) {
      const body = JSON.parse(result.body);
      console.log('✅ Reporte diario generado y enviado exitosamente!');
      console.log(`📅 Fecha: ${body.fecha}`);
      console.log(`📧 Destinatarios:`, body.destinatarios);
      process.exit(0);
    } else {
      const body = JSON.parse(result.body);
      console.error('❌ Error:', body.error || body.message);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error ejecutando reporte diario:', error.message);
    process.exit(1);
  }
})();

