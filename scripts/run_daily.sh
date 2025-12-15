#!/bin/bash
# Script para ejecutar reporte diario en Linux/Mac
# Usar con cron: 0 8 * * * /ruta/al/script/run_daily.sh

cd "$(dirname "$0")/.."
python3 -m report.run

if [ $? -eq 0 ]; then
    echo "Reporte generado exitosamente"
else
    echo "Error al generar reporte"
    exit 1
fi

