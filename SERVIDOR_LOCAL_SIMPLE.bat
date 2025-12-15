@echo off
echo.
echo ============================================
echo  SERVIDOR LOCAL SIMPLE - CHEQFIRMA
echo ============================================
echo.
echo Este script usa un servidor HTTP simple
echo para que puedas acceder desde tu celular
echo.
echo IMPORTANTE:
echo 1. Tu celular debe estar en la misma red WiFi
echo 2. Se mostrara una direccion IP - usala en tu celular
echo 3. Formato: http://[IP]:8000
echo.
echo Presiona cualquier tecla para continuar...
pause >nul
echo.

REM Verificar Python
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Python encontrado. Iniciando servidor...
    echo.
    for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
        set IP=%%a
        goto :found
    )
    :found
    set IP=%IP:~1%
    echo ============================================
    echo Abre en tu celular: http://%IP%:8000
    echo ============================================
    echo.
    python -m http.server 8000
) else (
    echo Python no encontrado.
    echo.
    echo Instalando servidor alternativo...
    echo.
    REM Intentar con PowerShell
    powershell -ExecutionPolicy Bypass -File "SERVIDOR_LOCAL_POWERSHELL.ps1"
)

pause

