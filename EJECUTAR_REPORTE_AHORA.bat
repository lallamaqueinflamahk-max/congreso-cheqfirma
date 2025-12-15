@echo off
echo ========================================
echo GENERANDO REPORTE COMPLETO AHORA MISMO
echo ========================================
echo.

REM Nota: Este script requiere que el servidor Netlify Dev esté corriendo
REM O que el sitio esté desplegado en Netlify

echo Opcion 1: Si tienes Netlify Dev corriendo (netlify dev):
echo curl "http://localhost:8888/.netlify/functions/sendReportNow?token=cheqfirma2025"
echo.

echo Opcion 2: Si el sitio está desplegado en Netlify:
echo curl "https://TU-SITIO.netlify.app/.netlify/functions/sendReportNow?token=cheqfirma2025"
echo.

echo ========================================
echo IMPORTANTE:
echo 1. Configura RESEND_API_KEY en Netlify
echo 2. El reporte se enviará a:
echo    - cheqfirma@gmail.com
echo    - Lallamaqueinflamahk@gmail.com
echo    - richitexx07@gmail.com
echo ========================================
echo.

pause

