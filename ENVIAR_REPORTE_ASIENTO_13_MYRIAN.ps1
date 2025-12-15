# Script para enviar reporte del asiento 13 (Donacion - Myrian Elizabeth Sanabria Gimenez)
# Ejecutar este script para enviar el reporte por email a cheqfirma@gmail.com

$ErrorActionPreference = "Continue"

# Datos del asiento 13
$seatNumber = 13
$customerName = "Myrian Elizabeth Sanabria Gimenez"
$customerEmail = "sanabriagimenezmyrianelizabeth@gmail.com"
$customerPhone = "+595984384115"
$customerCI = "2901971"
$paymentMethod = "Donacion"
$price = 0
$reservationId = "DON_MYRIAN_SANABRIA_13"
$soldAt = Get-Date -Format "yyyy-MM-ddTHH:mm:ss"

# Generar reporte
$report = "COMPROBANTE DE COMPRA Y ACREDITACION`n"
$report += "CONGRESO INTERNACIONAL CHEQFIRMA 2025`n"
$report += "ASIENTO PRESENCIAL - DONACION`n"
$report += "========================================`n`n"
$report += "INFORMACION DE LA COMPRA`n"
$report += "----------------------------------------`n"
$report += "ID de Reserva: $reservationId`n"
$report += "Fecha de Compra: $(Get-Date -Format 'dd de MMMM de yyyy a las HH:mm')`n"
$report += "Estado: RESERVADO Y DONADO`n"
$report += "Tipo: DONACION`n`n"
$report += "DATOS COMPLETOS DEL PARTICIPANTE`n"
$report += "----------------------------------------`n"
$report += "Nombre Completo: $customerName`n"
$report += "Telefono: $customerPhone`n"
$report += "Correo Electronico: $customerEmail`n"
$report += "Cedula de Identidad: $customerCI`n"
$report += "Tipo de Asistencia: Presencial`n`n"
$report += "ASIENTO RESERVADO`n"
$report += "----------------------------------------`n"
$report += "Numero de Asiento: $seatNumber`n"
$report += "Precio Pagado: DONADO (Sin costo)`n"
$report += "Metodo de Pago: $paymentMethod`n"
$report += "Modalidad: Asistencia Presencial`n`n"
$report += "BENEFICIOS INCLUIDOS`n"
$report += "----------------------------------------`n"
$report += "- Asiento garantizado en el auditorio`n"
$report += "- Acceso presencial 2 dias completos`n"
$report += "- Participacion en todas las sesiones`n"
$report += "- Material fisico del congreso`n"
$report += "- Coffee breaks incluidos`n"
$report += "- Networking presencial`n"
$report += "- Certificado fisico`n`n"
$report += "INFORMACION DEL EVENTO`n"
$report += "----------------------------------------`n"
$report += "Fechas: 19 y 20 de Diciembre 2025`n"
$report += "Horario: 08:00 - 22:00 (Hora de Paraguay, GMT-3)`n"
$report += "Duracion: 2 dias completos`n"
$report += "Modalidad: Presencial`n"
$report += "Lugar: Auditorio Ruiz Diaz, Manzana de la Rivera, Asuncion, Paraguay`n`n"
$report += "INSTRUCCIONES DE ACCESO`n"
$report += "----------------------------------------`n"
$report += "1. Presenta este comprobante al llegar al evento`n"
$report += "2. Dirigete al area de acreditaciones con tu documento de identidad`n"
$report += "3. Recibiras tu material del congreso y credenciales fisicas`n"
$report += "4. Tu asiento esta reservado y garantizado (Asiento $seatNumber)`n"
$report += "5. Llega con 30 minutos de anticipacion para el proceso de acreditacion`n"
$report += "6. El evento comienza a las 08:00 horas cada dia`n`n"
$report += "CONTACTO Y SOPORTE`n"
$report += "----------------------------------------`n"
$report += "Email: cheqfirma@gmail.com`n"
$report += "WhatsApp: +549 3536 564940`n"
$report += "Horario de Atencion: Lunes a Viernes, 9:00 - 18:00 (GMT-3)`n`n"
$report += "Gracias por ser parte del Congreso CheqFirma 2025!`n"
$report += "Este comprobante fue generado automaticamente por el sistema de gestion del Congreso CheqFirma."

# Preparar email
$emailSubject = "Asiento 13 - Donacion - Myrian Elizabeth Sanabria Gimenez - Congreso CheqFirma"
$emailTo = "cheqfirma@gmail.com"

# Copiar reporte al portapapeles
$report | Set-Clipboard
Write-Host "Reporte copiado al portapapeles" -ForegroundColor Green

# Intentar usar Outlook si esta disponible
try {
    $outlook = New-Object -ComObject Outlook.Application
    $mail = $outlook.CreateItem(0)
    $mail.Subject = $emailSubject
    $mail.To = $emailTo
    $mail.Body = $report
    $mail.Display()
    Write-Host "Email abierto en Outlook. Por favor, revisa y envia manualmente." -ForegroundColor Green
} catch {
    # Si Outlook no esta disponible, usar mailto:
    Write-Host "Outlook no disponible. Abriendo cliente de email predeterminado..." -ForegroundColor Yellow
    
    # Usar Start-Process con mailto: directamente (más simple)
    $mailtoUrl = "mailto:$emailTo?subject=$([System.Uri]::EscapeDataString($emailSubject))&body=$([System.Uri]::EscapeDataString($report))"
    
    Start-Process $mailtoUrl
    
    Write-Host "Cliente de email abierto. Por favor, revisa y envia el email." -ForegroundColor Green
    Write-Host "El reporte tambien se ha copiado al portapapeles para pegar manualmente." -ForegroundColor Cyan
}

Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "REPORTE GENERADO PARA ASIENTO 13" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "Cliente: $customerName" -ForegroundColor White
Write-Host "Email: $customerEmail" -ForegroundColor White
Write-Host "Telefono: $customerPhone" -ForegroundColor White
Write-Host "CI: $customerCI" -ForegroundColor White
Write-Host "Asiento: $seatNumber" -ForegroundColor White
Write-Host "Tipo: DONACION" -ForegroundColor Yellow
Write-Host "===============================================" -ForegroundColor Cyan
