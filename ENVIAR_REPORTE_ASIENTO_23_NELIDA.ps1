# Script para enviar reporte del asiento 23 (Pago en Efectivo - Nélida Asunción Yudi Riveros)
# Ejecutar este script para enviar el reporte por email y WhatsApp

$ErrorActionPreference = "Continue"

# Datos del asiento 23
$seatNumber = 23
$customerName = "Nélida Asunción Yudi Riveros"
$customerEmail = "nelidasuncion@gmail.com"
$customerCI = "2.207.930"
$customerPhone = "" # AGREGAR NÚMERO DE WHATSAPP AQUÍ (formato: +595XXXXXXXX)
# NOTA: Si no tienes el número de WhatsApp, deja vacío y solo se enviará por email
$paymentMethod = "Efectivo"
$price = 150000
$reservationId = "SOLD_NELIDA_YUDI_RIVEROS_23"
$soldAt = Get-Date -Format "yyyy-MM-ddTHH:mm:ss"

# Generar reporte
$report = "═══════════════════════════════════════════════════════════════════════════════`n"
$report += "                    COMPROBANTE DE COMPRA Y ACREDITACIÓN`n"
$report += "                        CONGRESO INTERNACIONAL CHEQFIRMA 2025`n"
$report += "                              ASIENTO PRESENCIAL`n"
$report += "═══════════════════════════════════════════════════════════════════════════════`n`n"
$report += "📋 INFORMACIÓN DE LA COMPRA`n"
$report += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n"
$report += "   ID de Reserva: $reservationId`n"
$report += "   Fecha de Compra: $(Get-Date -Format 'dd de MMMM de yyyy a las HH:mm')`n"
$report += "   Estado: ✅ RESERVADO Y PAGADO`n"
$report += "   Tipo: PAGO EN EFECTIVO`n`n"
$report += "👤 DATOS COMPLETOS DEL PARTICIPANTE`n"
$report += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n"
$report += "   Nombre Completo: $customerName`n"
$report += "   Teléfono: $(if ($customerPhone) { $customerPhone } else { 'No proporcionado' })`n"
$report += "   Correo Electrónico: $customerEmail`n"
$report += "   Cédula de Identidad: $customerCI`n"
$report += "   Tipo de Asistencia: Presencial`n`n"
$report += "🎫 ASIENTO RESERVADO`n"
$report += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n"
$report += "   Número de Asiento: $seatNumber`n"
$report += "   Precio Pagado: $($price.ToString('N0')) Gs`n"
$report += "   Método de Pago: $paymentMethod`n"
$report += "   Modalidad: Asistencia Presencial`n`n"
$report += "🎁 BENEFICIOS INCLUIDOS EN TU ASIENTO PRESENCIAL`n"
$report += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n"
$report += "   ✅ Asiento garantizado en el auditorio`n"
$report += "   ✅ Acceso presencial 2 días completos`n"
$report += "   ✅ Participación en todas las sesiones`n"
$report += "   ✅ Material físico del congreso`n"
$report += "   ✅ Coffee breaks incluidos`n"
$report += "   ✅ Networking presencial`n"
$report += "   ✅ Certificado físico`n`n"
$report += "📅 INFORMACIÓN DEL EVENTO`n"
$report += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n"
$report += "   Fechas: 19 y 20 de Diciembre 2025`n"
$report += "   Horario: 08:00 - 22:00 (Hora de Paraguay, GMT-3)`n"
$report += "   Duración: 2 días completos`n"
$report += "   Modalidad: Presencial`n"
$report += "   Lugar: Auditorio `"Ruiz Diaz`", Manzana de la Rivera, Asunción, Paraguay`n"
$report += "   Dirección: Manzana de la Rivera, Asunción, Paraguay`n`n"
$report += "📝 INSTRUCCIONES DE ACCESO`n"
$report += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n"
$report += "   1. Presenta este comprobante al llegar al evento`n"
$report += "   2. Dirígete al área de acreditaciones con tu documento de identidad`n"
$report += "   3. Recibirás tu material del congreso y credenciales físicas`n"
$report += "   4. Tu asiento está reservado y garantizado (Asiento $seatNumber)`n"
$report += "   5. Llega con 30 minutos de anticipación para el proceso de acreditación`n"
$report += "   6. El evento comienza a las 08:00 horas cada día`n`n"
$report += "⚠️ INFORMACIÓN IMPORTANTE`n"
$report += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n"
$report += "   • Guarda este comprobante en un lugar seguro`n"
$report += "   • Presenta este documento junto con tu documento de identidad`n"
$report += "   • Tu asiento está reservado y garantizado`n"
$report += "   • En caso de pérdida, contacta inmediatamente con el equipo`n"
$report += "   • Se recomienda llegar con anticipación para evitar demoras`n"
$report += "   • El estacionamiento está disponible cerca del auditorio`n`n"
$report += "📧 CONTACTO Y SOPORTE`n"
$report += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n"
$report += "   Email: cheqfirma@gmail.com`n"
$report += "   WhatsApp: +549 3536 564940`n"
$report += "   Horario de Atención: Lunes a Viernes, 9:00 - 18:00 (GMT-3)`n`n"
$report += "═══════════════════════════════════════════════════════════════════════════════`n"
$report += "                    ¡Gracias por ser parte del Congreso CheqFirma 2025!`n"
$report += "═══════════════════════════════════════════════════════════════════════════════`n`n"
$report += "Este comprobante fue generado automáticamente por el sistema de gestión del Congreso CheqFirma."

# Preparar mensaje para WhatsApp
$whatsappMessage = "*✅ PAGO ACREDITADO - CONGRESO CHEQFIRMA 2025*`n"
$whatsappMessage += "*ASIENTO PRESENCIAL*`n`n"
$whatsappMessage += "*COMPROBANTE DE COMPRA*`n`n"
$whatsappMessage += "👤 *Nombre:* $customerName`n"
$whatsappMessage += "📱 *Teléfono:* $(if ($customerPhone) { $customerPhone } else { 'No proporcionado' })`n"
$whatsappMessage += "📧 *Email:* $customerEmail`n"
$whatsappMessage += "🆔 *Cédula:* $customerCI`n`n"
$whatsappMessage += "🎫 *Asiento:* $seatNumber`n"
$whatsappMessage += "💰 *Monto Pagado:* $($price.ToString('N0')) Gs`n"
$whatsappMessage += "💳 *Método de Pago:* $paymentMethod`n"
$whatsappMessage += "📅 *Fecha de Compra:* $(Get-Date -Format 'dd/MM/yyyy')`n`n"
$whatsappMessage += "🎁 *BENEFICIOS INCLUIDOS:*`n"
$whatsappMessage += "✅ Asiento garantizado en el auditorio`n"
$whatsappMessage += "✅ Acceso presencial 2 días completos`n"
$whatsappMessage += "✅ Participación en todas las sesiones`n"
$whatsappMessage += "✅ Material físico del congreso`n"
$whatsappMessage += "✅ Coffee breaks incluidos`n"
$whatsappMessage += "✅ Networking presencial`n"
$whatsappMessage += "✅ Certificado físico`n`n"
$whatsappMessage += "📅 *FECHAS DEL EVENTO:*`n"
$whatsappMessage += "19-20 Diciembre 2025`n"
$whatsappMessage += "08:00 - 22:00 (Paraguay GMT-3)`n`n"
$whatsappMessage += "📍 *LUGAR:*`n"
$whatsappMessage += "Auditorio `"Ruiz Diaz`", Manzana de la Rivera, Asunción, Paraguay`n`n"
$whatsappMessage += "📝 *INSTRUCCIONES:*`n"
$whatsappMessage += "1. Presenta este comprobante al llegar al evento`n"
$whatsappMessage += "2. Dirígete al área de acreditaciones`n"
$whatsappMessage += "3. Tu asiento $seatNumber está reservado y garantizado`n"
$whatsappMessage += "4. Llega con 30 minutos de anticipación`n`n"
$whatsappMessage += "⚠️ *IMPORTANTE:*`n"
$whatsappMessage += "• Guarda este comprobante en un lugar seguro`n"
$whatsappMessage += "• Presenta este documento junto con tu documento de identidad`n"
$whatsappMessage += "• Tu asiento está reservado y garantizado`n`n"
$whatsappMessage += "📧 *CONTACTO:*`n"
$whatsappMessage += "Email: cheqfirma@gmail.com`n"
$whatsappMessage += "WhatsApp: +549 3536 564940`n`n"
$whatsappMessage += "*¡Gracias por ser parte del Congreso CheqFirma 2025!*"

# Preparar email
$emailSubject = "Asiento 23 - Pago Confirmado - Nélida Asunción Yudi Riveros - Congreso CheqFirma"
$emailTo = $customerEmail

# Función para codificar URL
function UrlEncode($text) {
    $text = $text -replace '%', '%25'
    $text = $text -replace ' ', '%20'
    $text = $text -replace "`n", '%0A'
    $text = $text -replace "`r", '%0D'
    $text = $text -replace '\+', '%2B'
    $text = $text -replace '&', '%26'
    $text = $text -replace '=', '%3D'
    $text = $text -replace '\?', '%3F'
    $text = $text -replace '#', '%23'
    $text = $text -replace '/', '%2F'
    return $text
}

Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "ENVIAR REPORTE ASIENTO 23" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "Cliente: $customerName" -ForegroundColor White
Write-Host "Email: $customerEmail" -ForegroundColor White
Write-Host "CI: $customerCI" -ForegroundColor White
Write-Host "Asiento: $seatNumber" -ForegroundColor White
Write-Host "Método de Pago: $paymentMethod" -ForegroundColor Yellow
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# Enviar por EMAIL al cliente
Write-Host "📧 Enviando reporte por EMAIL a $customerEmail..." -ForegroundColor Cyan
try {
    $outlook = New-Object -ComObject Outlook.Application
    $mail = $outlook.CreateItem(0)
    $mail.Subject = $emailSubject
    $mail.To = $emailTo
    $mail.Body = $report
    $mail.Display()
    Write-Host "✅ Email abierto en Outlook para $customerEmail. Por favor, revisa y envía." -ForegroundColor Green
} catch {
    Write-Host "⚠️ Outlook no disponible. Abriendo cliente de email predeterminado..." -ForegroundColor Yellow
    
    $encodedSubject = UrlEncode($emailSubject)
    $encodedBody = UrlEncode($report)
    $mailtoUrl = "mailto:$emailTo?subject=$encodedSubject&body=$encodedBody"
    
    Start-Process $mailtoUrl
    
    Write-Host "✅ Cliente de email abierto para $customerEmail. Por favor, revisa y envía el email." -ForegroundColor Green
}

Write-Host ""

# Enviar por WHATSAPP (si hay número de teléfono)
if ($customerPhone) {
    Write-Host "📱 Enviando reporte por WHATSAPP a $customerPhone..." -ForegroundColor Cyan
    
    # Limpiar número de teléfono (solo números)
    $cleanPhone = $customerPhone -replace '\D', ''
    
    # Codificar mensaje para WhatsApp
    $encodedWhatsApp = [System.Web.HttpUtility]::UrlEncode($whatsappMessage)
    $whatsappUrl = "https://wa.me/$cleanPhone?text=$encodedWhatsApp"
    
    Start-Process $whatsappUrl
    
    Write-Host "✅ WhatsApp abierto para $customerPhone. Por favor, revisa y envía el mensaje." -ForegroundColor Green
} else {
    Write-Host "⚠️ No se proporcionó número de WhatsApp." -ForegroundColor Yellow
    Write-Host "   Para enviar por WhatsApp, edita el script y agrega el número en la variable `$customerPhone" -ForegroundColor Yellow
    Write-Host "   Formato: +595XXXXXXXX (ejemplo: +595981234567)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📋 El reporte también se ha copiado al portapapeles." -ForegroundColor Cyan
$report | Set-Clipboard

Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "PROCESO COMPLETADO" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

