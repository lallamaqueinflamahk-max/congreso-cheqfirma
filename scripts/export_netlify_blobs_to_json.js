// Script para exportar datos de Netlify Blobs a JSON
// Útil para usar con el adaptador CSV/JSON en Python

const { getAllSeats, getSeatsByStatus, SEAT_STATES } = require('../netlify/functions/seats-store');
const fs = require('fs');
const path = require('path');

async function exportToJSON() {
  try {
    // Simular contexto de Netlify
    const mockContext = {
      site: {
        id: process.env.NETLIFY_SITE_ID || 'local-dev'
      }
    };

    console.log('📥 Exportando datos de Netlify Blobs...');

    // Obtener todos los asientos
    const soldSeats = await getSeatsByStatus(mockContext, SEAT_STATES.SOLD);
    const reservedSeats = await getSeatsByStatus(mockContext, SEAT_STATES.RESERVED);
    const availableSeats = await getSeatsByStatus(mockContext, SEAT_STATES.AVAILABLE);

    // Construir estructura de datos
    const exportData = {
      'all-seats': {},
      exported_at: new Date().toISOString()
    };

    // Agregar todos los asientos
    const allSeats = [...soldSeats, ...reservedSeats, ...availableSeats];
    
    for (const seat of allSeats) {
      const seatKey = `seat-${seat.seatNumber}`;
      exportData[seatKey] = seat;
      exportData['all-seats'][seat.seatNumber] = seat.status;
    }

    // Guardar a archivo JSON
    const outputPath = path.join(__dirname, '../data/exported_seats.json');
    fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2), 'utf-8');

    console.log(`✅ Exportado ${allSeats.length} asientos a: ${outputPath}`);
    console.log(`   - Vendidos: ${soldSeats.length}`);
    console.log(`   - Reservados: ${reservedSeats.length}`);
    console.log(`   - Disponibles: ${availableSeats.length}`);

    return outputPath;

  } catch (error) {
    console.error('❌ Error exportando datos:', error);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  require('dotenv').config();
  exportToJSON()
    .then(() => {
      console.log('✅ Exportación completada');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

module.exports = { exportToJSON };

