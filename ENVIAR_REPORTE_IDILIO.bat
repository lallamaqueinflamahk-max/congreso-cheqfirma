@echo off
chcp 65001 >nul
title Enviar Reporte - Idilio del Puerto

echo.
echo ╔══════════════════════════════════════════════════════╗
echo ║   ENVIAR REPORTE DE RESERVA                          ║
echo ║   Idilio del Puerto - Asiento 61                    ║
echo ╚══════════════════════════════════════════════════════╝
echo.

echo [*] Abriendo Outlook con el correo preparado...
echo.

REM Ejecutar script PowerShell
powershell -ExecutionPolicy Bypass -File "%~dp0ENVIAR_REPORTE_IDILIO_OUTLOOK.ps1"

echo.
echo ✓ Proceso completado
echo.
pause

