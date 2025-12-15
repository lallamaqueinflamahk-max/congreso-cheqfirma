@echo off
chcp 65001 >nul
title Enviar Reporte - Doctores Hospital del Chaco

echo.
echo ╔══════════════════════════════════════════════════════╗
echo ║   ENVIAR REPORTE DE RESERVAS                          ║
echo ║   Hospital del Chaco - Asientos 56 y 57            ║
echo ╚══════════════════════════════════════════════════════╝
echo.

echo [*] Abriendo cliente de correo predeterminado...
echo.

REM Ejecutar script PowerShell que usa mailto
powershell -ExecutionPolicy Bypass -File "%~dp0ENVIAR_REPORTE_DOCTORES_HOSPITAL_CHACO_DIRECTO.ps1"

echo.
echo ✓ Proceso completado
echo.
pause

