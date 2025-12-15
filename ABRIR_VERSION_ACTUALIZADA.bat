@echo off
cls
echo.
echo ============================================
echo  ABRIENDO VERSION ACTUALIZADA DEL CONGRESO
echo ============================================
echo.
echo Cerrando todos los navegadores...
echo.

REM Matar todos los procesos de navegadores
taskkill /F /IM chrome.exe 2>nul
taskkill /F /IM msedge.exe 2>nul
taskkill /F /IM firefox.exe 2>nul

timeout /t 3 /nobreak >nul

echo.
echo Navegadores cerrados.
echo.
echo ============================================
echo  IMPORTANTE - LEE ESTO:
echo ============================================
echo.
echo La pagina se abrira en 3 segundos.
echo.
echo UNA VEZ ABIERTA, HAZ LO SIGUIENTE:
echo.
echo 1. Presiona: Ctrl + Shift + Delete
echo 2. Selecciona "Todo el tiempo"
echo 3. Marca "Imagenes y archivos en cache"
echo 4. Click "Borrar datos"
echo 5. Cierra el navegador
echo 6. Vuelve a ejecutar este archivo (.bat)
echo.
echo ============================================
echo.
echo Abriendo en 3...
timeout /t 1 /nobreak >nul
echo Abriendo en 2...
timeout /t 1 /nobreak >nul
echo Abriendo en 1...
timeout /t 1 /nobreak >nul
echo.

start "" "%~dp0index.html"

echo.
echo ============================================
echo  VERSION ACTUALIZADA ABIERTA
echo ============================================
echo.
echo CAMBIOS EN ESTA VERSION:
echo.
echo [X] Dr. Joseph Varon ELIMINADO
echo [+] Dr. Fernando Griffith AGREGADO (14:00 PM)
echo [+] Abog. Juan Puerto AGREGADO (17:15 PM)
echo.
echo Total expositores: 14 (antes 15)
echo.
echo ============================================
echo.
echo Ve a la seccion AGENDA y verifica:
echo - 14:00 PM: Dr. Fernando Griffith
echo - 17:15 PM: Abog. Juan Puerto
echo - 19:30 PM: VACIO (Joseph Varon eliminado)
echo.
pause

