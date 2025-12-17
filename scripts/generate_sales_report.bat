@echo off
REM Script para generar reporte de ventas en Windows

echo ========================================
echo Generando Reporte de Ventas
echo ========================================

REM Activar entorno virtual si existe
if exist "venv\Scripts\activate.bat" (
    call venv\Scripts\activate.bat
)

REM Ejecutar script Python
python reporting\generate_sales_report.py reporting\config.yml

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Reporte generado exitosamente!
    echo ========================================
    echo.
    echo El archivo se encuentra en: report\output\
    echo.
    pause
) else (
    echo.
    echo ========================================
    echo Error al generar reporte
    echo ========================================
    echo.
    pause
    exit /b 1
)

