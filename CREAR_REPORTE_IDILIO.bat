@echo off
chcp 65001 >nul
title Crear Reporte - Idilio del Puerto

echo.
echo ╔══════════════════════════════════════════════════════╗
echo ║   CREAR REPORTE DE RESERVA                           ║
echo ║   Idilio del Puerto - Asiento 61                     ║
echo ╚══════════════════════════════════════════════════════╝
echo.

echo [*] Generando archivo de reporte...
echo.

powershell -Command "$fecha = Get-Date -Format 'dddd, dd de MMMM de yyyy a las HH:mm'; $reporte = @'
REPORTE DE RESERVA - CONGRESO CHEQFIRMA 2025
═══════════════════════════════════════════════════════════════════════════════

✅ PAGO ACREDITADO - ASIENTO PRESENCIAL

Fecha de Generación: $fecha

═══════════════════════════════════════════════════════════════════════════════
INFORMACIÓN DEL CLIENTE
═══════════════════════════════════════════════════════════════════════════════

👤 Nombre: Idilio del Puerto
🎫 Asiento: 61
📊 Estado: Vendido y Reservado
📍 Tipo de Asistencia: Presencial

═══════════════════════════════════════════════════════════════════════════════
DETALLES DE PAGO
═══════════════════════════════════════════════════════════════════════════════

💰 Monto Pagado: 150.000 Gs
💳 Método de Pago: Pago externo
📅 Fecha de Compra: $(Get-Date -Format 'dd/MM/yyyy')
🆔 ID de Reserva: SOLD_IDILIO_DEL_PUERTO_61

═══════════════════════════════════════════════════════════════════════════════
BENEFICIOS INCLUIDOS
═══════════════════════════════════════════════════════════════════════════════

✅ Asiento garantizado en el auditorio (Asiento 61)
✅ Acceso presencial 2 días completos
✅ Participación en todas las sesiones
✅ Material físico del congreso
✅ Coffee breaks incluidos
✅ Networking presencial
✅ Certificado físico

═══════════════════════════════════════════════════════════════════════════════
FECHAS DEL EVENTO
═══════════════════════════════════════════════════════════════════════════════

📅 Días: 19-20 Diciembre 2025
🕐 Horario: 08:00 - 22:00 (Paraguay GMT-3)
⏱️ Duración: 2 días completos

═══════════════════════════════════════════════════════════════════════════════
LUGAR DEL EVENTO
═══════════════════════════════════════════════════════════════════════════════

🏛️ Auditorio: Ruiz Diaz
📍 Ubicación: Manzana de la Rivera
🌎 Ciudad: Asunción, Paraguay

═══════════════════════════════════════════════════════════════════════════════
INSTRUCCIONES PARA EL CLIENTE
═══════════════════════════════════════════════════════════════════════════════

1. Presenta este comprobante al llegar al evento
2. Dirígete al área de acreditaciones
3. Tu asiento 61 está reservado y garantizado
4. Llega con 30 minutos de anticipación

═══════════════════════════════════════════════════════════════════════════════
IMPORTANTE
═══════════════════════════════════════════════════════════════════════════════

⚠️ Guarda este comprobante en un lugar seguro
⚠️ Presenta este documento junto con tu documento de identidad
⚠️ El asiento está garantizado y no puede ser transferido sin autorización
⚠️ En caso de dudas, contacta a: cheqfirma@gmail.com

═══════════════════════════════════════════════════════════════════════════════
CONTACTO
═══════════════════════════════════════════════════════════════════════════════

📧 Email: cheqfirma@gmail.com
📱 WhatsApp: +5493536564940

═══════════════════════════════════════════════════════════════════════════════
VALIDEZ DEL COMPROBANTE
═══════════════════════════════════════════════════════════════════════════════

Este documento certifica que el pago ha sido acreditado y otorga acceso
presencial completo al Congreso Internacional CheqFirma 2025.

Este comprobante es válido como recibo de pago y acreditación de acceso.
Presenta este documento al llegar al evento.

═══════════════════════════════════════════════════════════════════════════════
                    ¡Gracias por ser parte del Congreso CheqFirma 2025!
═══════════════════════════════════════════════════════════════════════════════

Generado automáticamente por el sistema de gestión del Congreso CheqFirma
'@; $reporte | Out-File -FilePath 'REPORTE_IDILIO_DEL_PUERTO_ASIENTO_61.txt' -Encoding UTF8"

echo ✅ Archivo creado: REPORTE_IDILIO_DEL_PUERTO_ASIENTO_61.txt
echo.
echo [*] Abriendo archivo y Outlook...
echo.

REM Abrir el archivo de texto
start notepad.exe "REPORTE_IDILIO_DEL_PUERTO_ASIENTO_61.txt"

REM Abrir Outlook con mailto simple
timeout /t 2 /nobreak >nul
start "" "mailto:cheqfirma@gmail.com?subject=Reporte de Reserva - Idilio del Puerto - Asiento 61 - Congreso CheqFirma"

echo.
echo ✅ INSTRUCCIONES:
echo.
echo   1. El archivo de texto está abierto (Notepad)
echo   2. Outlook se abrió con el correo preparado
echo   3. Selecciona TODO el texto del Notepad (Ctrl + A)
echo   4. Copia el texto (Ctrl + C)
echo   5. Pega en el cuerpo del correo de Outlook (Ctrl + V)
echo   6. Haz clic en "Enviar"
echo.
pause














