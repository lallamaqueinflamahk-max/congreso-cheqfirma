# Script mejorado para enviar reporte usando PowerShell COM directamente
# Abre Outlook con el correo y adjunto

$ErrorActionPreference = "Continue"

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

# Guardar reporte en archivo en la carpeta actual
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $scriptDir) {
    $scriptDir = Get-Location
}
$reportePath = Join-Path $scriptDir "REPORTE_DOCTORES_HOSPITAL_CHACO.txt"
$reporte | Out-File -FilePath $reportePath -Encoding UTF8 -Force

Write-Host "`n✅ Archivo de reporte creado: $reportePath`n" -ForegroundColor Green

# Verificar que el archivo existe
if (-not (Test-Path $reportePath)) {
    Write-Host "❌ Error: No se pudo crear el archivo de reporte`n" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Abriendo Outlook con el correo y adjunto...`n" -ForegroundColor Green
Write-Host "Destinatario: $destinatario" -ForegroundColor Cyan
Write-Host "Asunto: $asunto" -ForegroundColor Cyan
Write-Host "Adjunto: REPORTE_DOCTORES_HOSPITAL_CHACO.txt`n" -ForegroundColor Cyan

# Intentar abrir Outlook usando COM directamente
try {
    Write-Host "🔄 Conectando con Outlook...`n" -ForegroundColor Yellow
    
    # Crear objeto Outlook
    $outlook = New-Object -ComObject Outlook.Application
    
    # Crear nuevo correo
    $mail = $outlook.CreateItem(0)  # 0 = olMailItem
    
    # Configurar correo
    $mail.To = $destinatario
    $mail.Subject = $asunto
    $mail.Body = $reporte
    $mail.Importance = 2  # Alta importancia
    
    # Adjuntar archivo
    if (Test-Path $reportePath) {
        $attachment = $mail.Attachments.Add($reportePath)
        Write-Host "✅ Archivo adjunto agregado correctamente`n" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Advertencia: No se encontró el archivo adjunto`n" -ForegroundColor Yellow
    }
    
    # Mostrar ventana de correo
    $mail.Display()
    
    Write-Host "✅ Outlook abierto con el correo listo para enviar`n" -ForegroundColor Green
    Write-Host "👉 Solo haz clic en 'Enviar' para completar`n" -ForegroundColor Cyan
    
    # Intentar enviar automáticamente después de un momento
    Start-Sleep -Seconds 2
    Add-Type -AssemblyName System.Windows.Forms
    [System.Windows.Forms.SendKeys]::SendWait("%{s}")
    
    Write-Host "✅ Intento de envío automático realizado`n" -ForegroundColor Green
    
} catch {
    Write-Host "`n❌ Error al abrir Outlook: $_`n" -ForegroundColor Red
    Write-Host "Detalles: $($_.Exception.Message)`n" -ForegroundColor Yellow
    
    # Método alternativo: usar mailto
    Write-Host "Intentando método alternativo (mailto)...`n" -ForegroundColor Yellow
    
    $asuntoSimple = $asunto -replace '[^\w\s]', ''
    $mailtoUrl = "mailto:$destinatario?subject=$asuntoSimple"
    Start-Process $mailtoUrl
    
    Write-Host "✅ Cliente de correo alternativo abierto`n" -ForegroundColor Green
    Write-Host "⚠️ Nota: Tendrás que adjuntar el archivo manualmente: $reportePath`n" -ForegroundColor Yellow
}

