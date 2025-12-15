# VersiÃ³n simplificada - Guarda reporte en archivo y abre Outlook bÃ¡sico

$ErrorActionPreference = "Continue"

# InformaciÃ³n del correo
$destinatario = "cheqfirma@gmail.com"
$asunto = "Reporte de Reserva - Idilio del Puerto - Asiento 61 - Congreso CheqFirma"

# Generar fecha
$fecha = Get-Date -Format "dddd, dd 'de' MMMM 'de' yyyy 'a las' HH:mm"

# Generar reporte
$reporte = @"
REPORTE DE RESERVA - CONGRESO CHEQFIRMA 2025
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

âœ… PAGO ACREDITADO - ASIENTO PRESENCIAL

Fecha de GeneraciÃ³n: $fecha

â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
INFORMACIÃ“N DEL CLIENTE
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

ðŸ‘¤ Nombre: Idilio del Puerto
ðŸŽ« Asiento: 61
ðŸ“Š Estado: Vendido y Reservado
ðŸ“ Tipo de Asistencia: Presencial

â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
DETALLES DE PAGO
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

ðŸ’° Monto Pagado: 150.000 Gs
ðŸ’³ MÃ©todo de Pago: Pago externo
ðŸ“… Fecha de Compra: $(Get-Date -Format "dd/MM/yyyy")
ðŸ†” ID de Reserva: SOLD_IDILIO_DEL_PUERTO_61

â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
BENEFICIOS INCLUIDOS
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

âœ… Asiento garantizado en el auditorio (Asiento 61)
âœ… Acceso presencial 2 dÃ­as completos
âœ… ParticipaciÃ³n en todas las sesiones
âœ… Material fÃ­sico del congreso
âœ… Coffee breaks incluidos
âœ… Networking presencial
âœ… Certificado fÃ­sico

â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
FECHAS DEL EVENTO
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

ðŸ“… DÃ­as: 19-20 Diciembre 2025
ðŸ• Horario: 08:00 - 22:00 (Paraguay GMT-3)
â±ï¸ DuraciÃ³n: 2 dÃ­as completos

â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
LUGAR DEL EVENTO
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

ðŸ›ï¸ Auditorio: "Ruiz Diaz"
ðŸ“ UbicaciÃ³n: Manzana de la Rivera
ðŸŒŽ Ciudad: AsunciÃ³n, Paraguay

â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
INSTRUCCIONES PARA EL CLIENTE
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

1. Presenta este comprobante al llegar al evento
2. DirÃ­gete al Ã¡rea de acreditaciones
3. Tu asiento 61 estÃ¡ reservado y garantizado
4. Llega con 30 minutos de anticipaciÃ³n

â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
IMPORTANTE
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

âš ï¸ Guarda este comprobante en un lugar seguro
âš ï¸ Presenta este documento junto con tu documento de identidad
âš ï¸ El asiento estÃ¡ garantizado y no puede ser transferido sin autorizaciÃ³n
âš ï¸ En caso de dudas, contacta a: cheqfirma@gmail.com

â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
CONTACTO
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

ðŸ“§ Email: cheqfirma@gmail.com
ðŸ“± WhatsApp: +5493536564940

â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
VALIDEZ DEL COMPROBANTE
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

Este documento certifica que el pago ha sido acreditado y otorga acceso
presencial completo al Congreso Internacional CheqFirma 2025.

Este comprobante es vÃ¡lido como recibo de pago y acreditaciÃ³n de acceso.
Presenta este documento al llegar al evento.

â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
                    Â¡Gracias por ser parte del Congreso CheqFirma 2025!
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

Generado automÃ¡ticamente por el sistema de gestiÃ³n del Congreso CheqFirma
"@

# Guardar reporte en archivo de texto
$reportePath = Join-Path $PSScriptRoot "REPORTE_IDILIO_DEL_PUERTO_ASIENTO_61.txt"
$reporte | Out-File -FilePath $reportePath -Encoding UTF8

Write-Host ""
Write-Host "âœ… Reporte guardado en archivo de texto" -ForegroundColor Green
Write-Host ""
Write-Host "UbicaciÃ³n del archivo:" -ForegroundColor Cyan
Write-Host $reportePath -ForegroundColor White
Write-Host ""

# Abrir Outlook con solo destinatario y asunto (sin cuerpo para evitar cuelgues)
try {
    # Crear script VBS simple
    $mensajeBody = "Por favor, copia y pega el contenido del archivo REPORTE_IDILIO_DEL_PUERTO_ASIENTO_61.txt en el cuerpo de este correo."
    
    $vbsScript = "Set objOutlook = CreateObject(`"Outlook.Application`")" + [Environment]::NewLine
    $vbsScript += "Set objMail = objOutlook.CreateItem(0)" + [Environment]::NewLine
    $vbsScript += "objMail.To = `"$destinatario`"" + [Environment]::NewLine
    $vbsScript += "objMail.Subject = `"$asunto`"" + [Environment]::NewLine
    $vbsScript += "objMail.Body = `"$mensajeBody`"" + [Environment]::NewLine
    $vbsScript += "objMail.Display"

    $vbsPath = Join-Path $env:TEMP "outlook_simple_idilio.vbs"
    $vbsScript | Out-File -FilePath $vbsPath -Encoding ASCII
    
    # Ejecutar
    Start-Process -FilePath "cscript.exe" -ArgumentList "//NoLogo", "`"$vbsPath`"" -WindowStyle Hidden
    
    Write-Host "âœ… Outlook abierto con:" -ForegroundColor Green
    Write-Host "  â€¢ Destinatario: $destinatario" -ForegroundColor White
    Write-Host "  â€¢ Asunto: $asunto" -ForegroundColor White
    Write-Host ""
    Write-Host "ðŸ“‹ INSTRUCCIONES:" -ForegroundColor Yellow
    Write-Host "  1. Abre el archivo: REPORTE_IDILIO_DEL_PUERTO_ASIENTO_61.txt" -ForegroundColor White
    Write-Host "  2. Selecciona todo (Ctrl + A) y copia (Ctrl + C)" -ForegroundColor White
    Write-Host "  3. Pega el contenido en el cuerpo del correo de Outlook (Ctrl + V)" -ForegroundColor White
    Write-Host "  4. Haz clic en 'Enviar'" -ForegroundColor White
    Write-Host ""
    
    # Abrir tambiÃ©n el archivo de texto automÃ¡ticamente
    Start-Sleep -Seconds 2
    Start-Process notepad.exe -ArgumentList "`"$reportePath`""
    
    # Limpiar archivo temporal despuÃ©s de 5 segundos
    Start-Sleep -Seconds 5
    if (Test-Path $vbsPath) {
        Remove-Item $vbsPath -Force -ErrorAction SilentlyContinue
    }
    
} catch {
    Write-Host ""
    Write-Host "âš ï¸ No se pudo abrir Outlook automÃ¡ticamente." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "MÃ©todo alternativo:" -ForegroundColor Cyan
    Write-Host "  1. Abre Outlook manualmente" -ForegroundColor White
    Write-Host "  2. Crea un nuevo correo a: $destinatario" -ForegroundColor White
    Write-Host "  3. Asunto: $asunto" -ForegroundColor White
    Write-Host "  4. Copia el contenido del archivo: $reportePath" -ForegroundColor White
    Write-Host "  5. Pega el contenido en el cuerpo del correo" -ForegroundColor White
    Write-Host ""
}

