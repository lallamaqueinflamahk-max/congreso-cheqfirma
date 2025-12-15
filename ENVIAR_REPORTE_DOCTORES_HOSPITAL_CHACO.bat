@echo off
chcp 65001 >nul
title Enviar Reporte - Doctores Hospital del Chaco

echo.
echo ╔══════════════════════════════════════════════════════╗
echo ║   ENVIAR REPORTE DE RESERVAS                          ║
echo ║   Hospital del Chaco - Asientos 56 y 57            ║
echo ║   ⚠️ RESERVAS NO PAGADAS                            ║
echo ╚══════════════════════════════════════════════════════╝
echo.

echo [*] Preparando reporte de reservas...
echo.
echo ⚠️ IMPORTANTE: Estas reservas NO están pagadas
echo    El pago se realizará en persona el día del evento
echo.

echo [*] Abriendo Outlook con el correo preparado...
echo.

REM Ejecutar script PowerShell
powershell -ExecutionPolicy Bypass -File "%~dp0ENVIAR_REPORTE_DOCTORES_HOSPITAL_CHACO.ps1"

echo.
echo ✓ Proceso completado
echo.
echo ⚠️ RECORDATORIO: Verificar pago el día del evento antes de permitir acceso
echo.
pause
