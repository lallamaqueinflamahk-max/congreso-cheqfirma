# Script para enviar reporte de Idilio del Puerto por Outlook
# Sin bloquear la interfaz

$ErrorActionPreference = "Stop"

# Información del correo
$destinatario = "cheqfirma@gmail.com"
$asunto = "Reporte de Reserva - Idilio del Puerto - Asiento 61 - Congreso CheqFirma"

# Generar fecha
$fecha = Get-Date -Format "dddd, dd 'de' MMMM 'de' yyyy 'a las' HH:mm"

# Generar reporte
$reporte = @"
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
📅 Fecha de Compra: $(Get-Date -Format "dd/MM/yyyy")
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

🏛️ Auditorio: "Ruiz Diaz"
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
"@

# Crear script VBS temporal para abrir Outlook
$vbsScript = @"
Set objOutlook = CreateObject("Outlook.Application")
Set objMail = objOutlook.CreateItem(0)

objMail.To = "$destinatario"
objMail.Subject = "$asunto"
objMail.Body = `"$reporte`"

objMail.Display
"@

# Guardar script VBS temporal
$vbsPath = Join-Path $env:TEMP "enviar_reporte_idilio.vbs"
$vbsScript | Out-File -FilePath $vbsPath -Encoding ASCII

try {
    # Ejecutar script VBS
    Start-Process -FilePath "cscript.exe" -ArgumentList "//NoLogo", "`"$vbsPath`"" -WindowStyle Hidden
    
    Write-Host "`n✅ Outlook abierto con el correo listo`n" -ForegroundColor Green
    Write-Host "El correo está preparado con:" -ForegroundColor Cyan
    Write-Host "  • Destinatario: $destinatario" -ForegroundColor White
    Write-Host "  • Asunto: $asunto" -ForegroundColor White
    Write-Host "  • Cuerpo: Reporte completo incluido`n" -ForegroundColor White
    Write-Host "Solo haz clic en 'Enviar' en Outlook para completar.`n" -ForegroundColor Yellow
    
    # Limpiar archivo temporal después de 5 segundos
    Start-Sleep -Seconds 5
    if (Test-Path $vbsPath) {
        Remove-Item $vbsPath -Force -ErrorAction SilentlyContinue
    }
} catch {
    Write-Host "`n❌ Error al abrir Outlook: $_`n" -ForegroundColor Red
    Write-Host "Intentando método alternativo...`n" -ForegroundColor Yellow
    
    # Método alternativo: mailto
    $mailtoUrl = "mailto:$destinatario?subject=" + [System.Web.HttpUtility]::UrlEncode($asunto) + "&body=" + [System.Web.HttpUtility]::UrlEncode($reporte)
    Start-Process $mailtoUrl
    
    Write-Host "✅ Abierto con método alternativo`n" -ForegroundColor Green
}

