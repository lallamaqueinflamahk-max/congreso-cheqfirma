// Script para ejecutar sendReportNow desde línea de comandos
// Simula el contexto de Netlify Function
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env")
});

require('dotenv').config({ path: '.env' });

const handler = require('../netlify/functions/sendReportNow').handler;

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
    console.log('🚀 Iniciando generación de reporte...\n');
    const result = await handler(mockEvent, mockContext);
    
    if (result.statusCode === 200) {
      const body = JSON.parse(result.body);
      console.log('✅ Reporte generado y enviado exitosamente!');
      console.log(`📅 Fecha: ${body.fecha}`);
      if (body.hora) {
        console.log(`🕐 Hora: ${body.hora}`);
      }
      console.log(`📧 Destinatarios:`, body.destinatarios);
      process.exit(0);
    } else {
      const body = JSON.parse(result.body);
      console.error('❌ Error:', body.error || body.message);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error ejecutando reporte:', error.message);
    console.error("ERROR REAL:", error);
    console.error(error?.stack || error);
    console.log("CWD:", process.cwd());
    console.log("DIR:", __dirname);
    console.log("ENV keys:", Object.keys(process.env).filter(k=>k.includes("SMTP")||k.includes("EMAIL")||k.includes("REPORT")||k.includes("SEAT")));
    process.exit(1);
  }
})();

