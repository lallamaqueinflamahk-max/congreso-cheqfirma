@echo off
chcp 65001 >nul
title Enviar Correo - Congreso CheqFirma

echo.
echo ╔════════════════════════════════════════════════╗
echo ║   ENVÍO AUTOMÁTICO DE CORREO - UN SOLO CLIC    ║
echo ║   Congreso CheqFirma                           ║
echo ╚════════════════════════════════════════════════╝
echo.

REM Intentar primero con VBS (más directo para Outlook)
if exist "ENVIAR_CORREO.vbs" (
    echo [*] Abriendo Outlook con correo pre-configurado...
    echo.
    cscript //nologo "ENVIAR_CORREO.vbs"
    if %errorlevel% == 0 (
        echo.
        echo ✓ Correo abierto exitosamente
        echo   Solo necesitas hacer clic en "Enviar"
        echo.
        timeout /t 3 >nul
        exit /b 0
    )
)

REM Si VBS no funcionó, usar PowerShell
echo [*] Abriendo cliente de correo...
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0ENVIAR_CORREO_AUTOMATICO.ps1"

echo.
pause

