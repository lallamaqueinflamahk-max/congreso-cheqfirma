@echo off
REM Script para ejecutar reporte diario en Windows
REM Configurar en Task Scheduler para ejecución automática

cd /d "%~dp0\.."
python -m report.run

if %ERRORLEVEL% EQU 0 (
    echo Reporte generado exitosamente
) else (
    echo Error al generar reporte
    exit /b 1
)

