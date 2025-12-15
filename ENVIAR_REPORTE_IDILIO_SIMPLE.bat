@echo off
chcp 65001 >nul
title Enviar Reporte Simple - Idilio del Puerto

echo.
echo ╔══════════════════════════════════════════════════════╗
echo ║   ENVIAR REPORTE SIMPLIFICADO                        ║
echo ║   Idilio del Puerto - Asiento 61                     ║
echo ╚══════════════════════════════════════════════════════╝
echo.

echo [*] Generando reporte y abriendo Outlook...
echo.

REM Ejecutar script PowerShell
powershell -ExecutionPolicy Bypass -File "%~dp0ENVIAR_REPORTE_IDILIO_SIMPLE.ps1"

echo.
echo ✓ Proceso completado
echo.
pause














