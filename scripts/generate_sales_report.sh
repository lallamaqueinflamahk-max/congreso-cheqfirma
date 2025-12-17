#!/bin/bash
# Script para generar reporte de ventas en Linux/Mac

echo "========================================"
echo "Generando Reporte de Ventas"
echo "========================================"

# Activar entorno virtual si existe
if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
fi

# Ejecutar script Python
python reporting/generate_sales_report.py reporting/config.yml

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "Reporte generado exitosamente!"
    echo "========================================"
    echo ""
    echo "El archivo se encuentra en: report/output/"
    echo ""
else
    echo ""
    echo "========================================"
    echo "Error al generar reporte"
    echo "========================================"
    echo ""
    exit 1
fi

