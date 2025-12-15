@echo off
REM Script de un solo clic para enviar el correo
REM Congreso CheqFirma

echo ========================================
echo   ENVIANDO CORREO AUTOMATICO
echo   Congreso CheqFirma
echo ========================================
echo.

REM Ejecutar el script PowerShell
powershell -ExecutionPolicy Bypass -File "%~dp0ENVIAR_CORREO_AUTOMATICO.ps1"

pause

