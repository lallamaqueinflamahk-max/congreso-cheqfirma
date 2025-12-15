@echo off
echo.
echo ============================================
echo  LIMPIANDO CACHE DEL NAVEGADOR
echo ============================================
echo.
echo Cerrando todas las ventanas del navegador...
echo.

REM Cerrar Chrome
taskkill /F /IM chrome.exe 2>nul
timeout /t 2 /nobreak >nul

REM Cerrar Edge
taskkill /F /IM msedge.exe 2>nul
timeout /t 2 /nobreak >nul

REM Cerrar Firefox
taskkill /F /IM firefox.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Navegadores cerrados.
echo.
echo Abriendo pagina web ACTUALIZADA...
echo.

REM Esperar un momento
timeout /t 3 /nobreak >nul

REM Abrir index.html
start "" "%~dp0index.html"

echo.
echo ============================================
echo  PAGINA ABIERTA CON VERSION ACTUALIZADA
echo ============================================
echo.
echo IMPORTANTE:
echo Una vez que se abra el navegador, presiona:
echo.
echo     Ctrl + F5
echo.
echo para refrescar completamente la pagina.
echo.
echo ============================================
echo.
pause

