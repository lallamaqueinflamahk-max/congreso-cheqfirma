@echo off
echo ========================================
echo ENVIAR REPORTE ASIENTO 13 - MYRIAN
echo ========================================
echo.
echo Generando y enviando reporte del asiento 13...
echo (Donacion - Myrian Elizabeth Sanabria Gimenez)
echo.

powershell.exe -ExecutionPolicy Bypass -File "%~dp0ENVIAR_REPORTE_ASIENTO_13_MYRIAN.ps1"

echo.
echo ========================================
echo Proceso completado
echo ========================================
pause

