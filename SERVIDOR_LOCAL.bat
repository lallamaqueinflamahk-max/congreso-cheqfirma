@echo off
echo.
echo ============================================
echo  SERVIDOR LOCAL PARA CONGRESO CHEQFIRMA
echo ============================================
echo.
echo Iniciando servidor local...
echo.
echo IMPORTANTE:
echo 1. Asegurate de que tu celular este en la misma red WiFi
echo 2. Anota la direccion IP que aparecera abajo
echo 3. Abre esa direccion en el navegador de tu celular
echo.
echo Presiona Ctrl+C para detener el servidor
echo.
echo ============================================
echo.

REM Obtener la IP local
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    set IP=%%a
    goto :found
)
:found
set IP=%IP:~1%

echo Tu direccion IP local es: %IP%
echo.
echo Abre en tu celular: http://%IP%:8000
echo.
echo ============================================
echo.

REM Iniciar servidor Python simple
python -m http.server 8000

pause
