@echo off
title Acceso desde Celular - CheqFirma
color 0B
cls

echo.
echo ╔══════════════════════════════════════════════════════╗
echo ║   ACCESO AL SITIO DESDE TU CELULAR                   ║
echo ║   Congreso CheqFirma 2025                            ║
echo ╚══════════════════════════════════════════════════════╝
echo.

REM Obtener IP
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    set IP=%%a
    goto :found
)
:found
set IP=%IP:~1%

echo.
echo ┌──────────────────────────────────────────────────────┐
echo │  TU DIRECCION IP LOCAL: %IP%                    │
echo └──────────────────────────────────────────────────────┘
echo.
echo ════════════════════════════════════════════════════════
echo   PASOS PARA ACCEDER DESDE TU CELULAR:
echo ════════════════════════════════════════════════════════
echo.
echo   1. Asegurate de que tu celular este en la misma
echo      red WiFi que esta computadora
echo.
echo   2. Abre el navegador en tu celular
echo      (Chrome, Safari, Firefox, etc.)
echo.
echo   3. Escribe exactamente esto en la barra de direccion:
echo.
echo      http://%IP%:8000
echo.
echo   4. Presiona Enter o Ir
echo.
echo ════════════════════════════════════════════════════════
echo.
echo   IMPORTANTE:
echo   - No cierres esta ventana mientras uses el sitio
echo   - Presiona Ctrl+C para detener el servidor
echo.
echo ════════════════════════════════════════════════════════
echo.
echo Iniciando servidor...
echo.

REM Verificar Python
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo.
    echo ✓ Servidor iniciado correctamente!
    echo.
    echo ┌──────────────────────────────────────────────────────┐
    echo │  Abre en tu celular: http://%IP%:8000          │
    echo └──────────────────────────────────────────────────────┘
    echo.
    echo Presiona Ctrl+C para detener el servidor
    echo.
    python -m http.server 8000
) else (
    echo.
    echo ✗ ERROR: Python no esta instalado
    echo.
    echo Para instalar Python:
    echo 1. Ve a: https://www.python.org/downloads/
    echo 2. Descarga e instala Python
    echo 3. Durante la instalacion, marca "Add Python to PATH"
    echo 4. Reinicia la computadora
    echo 5. Vuelve a ejecutar este script
    echo.
    pause
)

