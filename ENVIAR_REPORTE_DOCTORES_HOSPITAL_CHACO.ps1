# Script para enviar reporte de reservas de doctores del Hospital del Chaco por Outlook
# Reservas NO pagadas - Pago en persona el día del evento

$ErrorActionPreference = "Stop"

# Información del correo
$destinatario = "cheqfirma@gmail.com"
$asunto = "Reporte de Reservas - Hospital del Chaco - Asientos 56 y 57 - Congreso CheqFirma"

# Generar fecha
$fecha = Get-Date -Format "dddd, dd 'de' MMMM 'de' yyyy 'a las' HH:mm"

# Generar reporte
$reporte = @"
REPORTE DE RESERVAS - CONGRESO CHEQFIRMA 2025
═══════════════════════════════════════════════════════════════════════════════

⚠️ RESERVAS NO PAGADAS - PAGO EN PERSONA EL DÍA DEL EVENTO

Fecha de Generación: $fecha

═══════════════════════════════════════════════════════════════════════════════
INFORMACIÓN DE LAS RESERVAS
═══════════════════════════════════════════════════════════════════════════════

🎫 RESERVA AMARILLO - HOSPITAL DEL CHACO

═══════════════════════════════════════════════════════════════════════════════
ASIENTO 56 - DR. GERD UWE HUBERT
═══════════════════════════════════════════════════════════════════════════════

👤 Nombre: Dr. Gerd Uwe Hubert
🆔 Cédula: 2585646
📱 Celular: 0984475972
🎫 Asiento: 56
📊 Estado: RESERVADO (NO PAGADO)
📍 Tipo de Asistencia: Presencial
💳 Método de Pago: Pago en persona el día del congreso
🆔 ID de Reserva: RES_HOSPITAL_CHACO_56

═══════════════════════════════════════════════════════════════════════════════
ASIENTO 57 - DR. WILMAR DYCK
═══════════════════════════════════════════════════════════════════════════════

👤 Nombre: Dr. Wilmar Dyck
🆔 Cédula: 2120226
📱 Celular: 0986130827
🎫 Asiento: 57
📊 Estado: RESERVADO (NO PAGADO)
📍 Tipo de Asistencia: Presencial
💳 Método de Pago: Pago en persona el día del congreso
🆔 ID de Reserva: RES_HOSPITAL_CHACO_57

═══════════════════════════════════════════════════════════════════════════════
⚠️ IMPORTANTE - ESTADO DE PAGO
═══════════════════════════════════════════════════════════════════════════════

❌ ESTAS RESERVAS NO ESTÁN PAGADAS

✅ Los asientos 56 y 57 están RESERVADOS para los doctores del Hospital del Chaco
✅ El pago se realizará EN PERSONA el día del evento
✅ Los asientos están garantizados hasta el día del congreso
✅ Se debe cobrar el día del evento antes de permitir el acceso

═══════════════════════════════════════════════════════════════════════════════
INSTRUCCIONES PARA EL DÍA DEL EVENTO
═══════════════════════════════════════════════════════════════════════════════

1. ⚠️ VERIFICAR PAGO: Los doctores deben pagar antes de acceder al evento
2. 💰 MONTO A COBRAR: 150.000 Gs por cada asiento (300.000 Gs total)
3. 📋 VERIFICAR IDENTIDAD: Confirmar cédulas al momento del pago:
   - Dr. Gerd Uwe Hubert: Cédula 2585646
   - Dr. Wilmar Dyck: Cédula 2120226
4. 📱 CONTACTOS: 
   - Dr. Hubert: 0984475972
   - Dr. Dyck: 0986130827
5. ✅ Una vez pagado, marcar los asientos como vendidos en el sistema

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
BENEFICIOS INCLUIDOS (Una vez pagado)
═══════════════════════════════════════════════════════════════════════════════

✅ Asientos garantizados en el auditorio (Asientos 56 y 57)
✅ Acceso presencial 2 días completos
✅ Participación en todas las sesiones
✅ Material físico del congreso
✅ Coffee breaks incluidos
✅ Networking presencial
✅ Certificado físico

═══════════════════════════════════════════════════════════════════════════════
CONTACTO
═══════════════════════════════════════════════════════════════════════════════

📧 Email: cheqfirma@gmail.com
📱 WhatsApp: +5493536564940

═══════════════════════════════════════════════════════════════════════════════
NOTAS ADICIONALES
═══════════════════════════════════════════════════════════════════════════════

• Reserva realizada por pedido del público
• Promoción de entradas anticipadas prorrogada hasta el domingo 14 del mes corriente
• Los doctores confirmaron que pagarán en persona el día del congreso
• Mantener estos asientos reservados hasta el día del evento
• Si no se presenta el pago, los asientos pueden ser liberados

═══════════════════════════════════════════════════════════════════════════════
                    Reporte generado automáticamente
                    Sistema de gestión del Congreso CheqFirma
═══════════════════════════════════════════════════════════════════════════════
"@

# Crear script VBS temporal para abrir Outlook y enviar automáticamente
$vbsScript = @"
Set objOutlook = CreateObject("Outlook.Application")
Set objMail = objOutlook.CreateItem(0)

objMail.To = "$destinatario"
objMail.Subject = "$asunto"
objMail.Body = `"$reporte`"

' Configurar importancia y formato
objMail.Importance = 2 ' Alta importancia
objMail.BodyFormat = 1 ' Formato texto plano

' Intentar enviar automáticamente
On Error Resume Next
objMail.Send
If Err.Number <> 0 Then
    ' Si no se puede enviar automáticamente, mostrar y preparar para envío rápido
    objMail.Display
    ' Esperar un momento y luego intentar presionar Alt+S (atajo para Enviar)
    WScript.Sleep 500
    Set WshShell = CreateObject("WScript.Shell")
    WshShell.SendKeys "%s"
End If
On Error Goto 0
"@

# Guardar script VBS temporal
$vbsPath = Join-Path $env:TEMP "enviar_reporte_doctores_hospital_chaco.vbs"
$vbsScript | Out-File -FilePath $vbsPath -Encoding ASCII

try {
    # Ejecutar script VBS
    Start-Process -FilePath "cscript.exe" -ArgumentList "//NoLogo", "`"$vbsPath`"" -WindowStyle Hidden
    
    Write-Host "`n✅ Outlook abierto con el correo listo`n" -ForegroundColor Green
    Write-Host "El correo está preparado con:" -ForegroundColor Cyan
    Write-Host "  • Destinatario: $destinatario" -ForegroundColor White
    Write-Host "  • Asunto: $asunto" -ForegroundColor White
    Write-Host "  • Cuerpo: Reporte completo incluido`n" -ForegroundColor White
    Write-Host "⚠️ IMPORTANTE: Este reporte indica que las reservas NO están pagadas" -ForegroundColor Yellow
    Write-Host "   y que el pago se realizará el día del evento.`n" -ForegroundColor Yellow
    
    # Esperar un momento para que Outlook se abra
    Start-Sleep -Seconds 1
    
    # Intentar enviar automáticamente presionando Alt+S (atajo de teclado para Enviar en Outlook)
    Write-Host "🔄 Intentando enviar automáticamente..." -ForegroundColor Cyan
    Add-Type -AssemblyName System.Windows.Forms
    Start-Sleep -Seconds 1
    
    # Intentar múltiples veces para asegurar que se envíe
    for ($i = 1; $i -le 3; $i++) {
        [System.Windows.Forms.SendKeys]::SendWait("%{s}")
        Start-Sleep -Milliseconds 300
    }
    
    Write-Host "✅ Correo preparado - Si aparece Outlook, presiona Alt+S o haz clic en Enviar`n" -ForegroundColor Green
    
    # Limpiar archivo temporal después de 5 segundos
    Start-Sleep -Seconds 3
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

