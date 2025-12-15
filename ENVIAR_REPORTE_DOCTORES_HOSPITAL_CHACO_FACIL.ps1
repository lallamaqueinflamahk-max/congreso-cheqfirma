# Script simplificado que copia el contenido al portapapeles y abre el correo

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

# Guardar reporte en archivo
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $scriptDir) {
    $scriptDir = Get-Location
}
$reportePath = Join-Path $scriptDir "REPORTE_DOCTORES_HOSPITAL_CHACO.txt"
$reporte | Out-File -FilePath $reportePath -Encoding UTF8 -Force

Write-Host "Archivo de reporte creado: $reportePath`n" -ForegroundColor Green

# Copiar contenido al portapapeles
Add-Type -AssemblyName System.Windows.Forms
[System.Windows.Forms.Clipboard]::SetText($reporte)

Write-Host "Contenido copiado al portapapeles`n" -ForegroundColor Green

# Abrir correo usando método simple
$asuntoSimple = $asunto -replace '[^\w\s-]', ' '
$mailtoUrl = "mailto:$destinatario?subject=$asuntoSimple"

Write-Host "Abriendo cliente de correo...`n" -ForegroundColor Yellow
Write-Host "Destinatario: $destinatario" -ForegroundColor Cyan
Write-Host "Asunto: $asunto`n" -ForegroundColor Cyan

# Usar cmd para abrir mailto (más confiable)
cmd /c start "" "$mailtoUrl"

Start-Sleep -Seconds 2

Write-Host "Cliente de correo abierto`n" -ForegroundColor Green
Write-Host "INSTRUCCIONES RAPIDAS:" -ForegroundColor Cyan
Write-Host "   1. El correo ya tiene destinatario y asunto" -ForegroundColor White
Write-Host "   2. Presiona Ctrl+V para pegar el contenido (ya esta copiado)" -ForegroundColor White
Write-Host "   3. Adjunta el archivo: $reportePath" -ForegroundColor White
Write-Host "   4. Haz clic en Enviar`n" -ForegroundColor White

Write-Host "El archivo de reporte esta en: $reportePath`n" -ForegroundColor Yellow

