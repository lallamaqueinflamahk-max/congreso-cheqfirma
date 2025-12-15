@echo off
title Servidor Local - Congreso CheqFirma
color 0A
cls

echo.
echo ============================================
echo   SERVIDOR LOCAL PARA ACCESO DESDE CELULAR
echo   CONGRESO CHEQFIRMA 2025
echo ============================================
echo.

REM Obtener IP local
echo Obteniendo direccion IP local...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    set IP=%%a
    goto :found
)
:found
set IP=%IP:~1%

if "%IP%"=="" (
    echo ERROR: No se pudo obtener la direccion IP
    echo Asegurate de estar conectado a una red WiFi
    echo.
    pause
    exit /b
)

echo.
echo ============================================
echo   CONFIGURACION LISTA
echo ============================================
echo.
echo Tu direccion IP local: %IP%
echo.
echo ============================================
echo   INSTRUCCIONES PARA TU CELULAR:
echo ============================================
echo.
echo 1. Asegurate de que tu celular este en la
echo    misma red WiFi que esta computadora
echo.
echo 2. Abre el navegador en tu celular
echo    (Chrome, Safari, etc.)
echo.
echo 3. Escribe esta direccion:
echo.
echo    http://%IP%:8000
echo.
echo 4. Presiona Enter
echo.
echo ============================================
echo.
echo IMPORTANTE:
echo - No cierres esta ventana mientras uses el sitio
echo - Presiona Ctrl+C para detener el servidor
echo.
echo ============================================
echo.
echo Iniciando servidor en 3 segundos...
timeout /t 3 /nobreak >nul
echo.

REM Verificar Python
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Servidor iniciado correctamente!
    echo.
    echo Abre en tu celular: http://%IP%:8000
    echo.
    echo ============================================
    echo.
    python -m http.server 8000
) else (
    echo ERROR: Python no esta instalado
    echo.
    echo Instalando Python es necesario para el servidor.
    echo.
    echo Opciones:
    echo 1. Instalar Python desde: https://www.python.org/downloads/
    echo 2. O usar un servidor alternativo
    echo.
    pause
)

