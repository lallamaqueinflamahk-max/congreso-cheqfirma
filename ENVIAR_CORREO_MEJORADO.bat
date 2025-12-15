@echo off
chcp 65001 >nul
title Enviar Correo con Adjunto - Congreso CheqFirma

echo.
echo ╔══════════════════════════════════════════════════════╗
echo ║   ENVÍO DE CORREO CON ARCHIVO ADJUNTO                ║
echo ║   Congreso CheqFirma                                 ║
echo ╚══════════════════════════════════════════════════════╝
echo.

REM Verificar que existe el archivo ZIP
if not exist "Carpetas_Marketing_Presupuesto_*.zip" (
    echo [ERROR] No se encontró el archivo ZIP.
    echo.
    echo Buscando archivos ZIP...
    dir /b Carpetas_Marketing_Presupuesto_*.zip 2>nul
    echo.
    echo Si no existe, ejecuta primero: COMPRIMIR_CARPETAS_PARA_ENVIO.ps1
    echo.
    pause
    exit /b 1
)

echo [*] Archivo ZIP encontrado
echo.

REM Intentar primero con VBS (más directo para Outlook)
if exist "ENVIAR_CORREO.vbs" (
    echo [*] Abriendo Outlook con correo y adjunto...
    echo.
    cscript //nologo "ENVIAR_CORREO.vbs"
    if %errorlevel% == 0 (
        echo.
        echo ✓ Proceso completado
        echo.
        timeout /t 3 >nul
        exit /b 0
    )
)

REM Si VBS no funcionó, usar PowerShell
echo [*] Usando método alternativo...
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0ENVIAR_CORREO_AUTOMATICO.ps1"

echo.
pause

