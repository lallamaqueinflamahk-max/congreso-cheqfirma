# Script para enviar reporte usando mailto (método directo)
# Abre el cliente de correo predeterminado

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

# Función para codificar URL (reemplazo de System.Web.HttpUtility)
function Encode-Url {
    param([string]$text)
    $text = $text -replace '%', '%25'
    $text = $text -replace ' ', '%20'
    $text = $text -replace '!', '%21'
    $text = $text -replace '#', '%23'
    $text = $text -replace '\$', '%24'
    $text = $text -replace '&', '%26'
    $text = $text -replace "'", '%27'
    $text = $text -replace '\(', '%28'
    $text = $text -replace '\)', '%29'
    $text = $text -replace '\*', '%2A'
    $text = $text -replace '\+', '%2B'
    $text = $text -replace ',', '%2C'
    $text = $text -replace '/', '%2F'
    $text = $text -replace ':', '%3A'
    $text = $text -replace ';', '%3B'
    $text = $text -replace '=', '%3D'
    $text = $text -replace '\?', '%3F'
    $text = $text -replace '@', '%40'
    $text = $text -replace '\[', '%5B'
    $text = $text -replace '\\', '%5C'
    $text = $text -replace '\]', '%5D'
    $text = $text -replace '\n', '%0A'
    $text = $text -replace '\r', '%0D'
    return $text
}

# Guardar reporte en archivo en la carpeta actual (más confiable)
$reportePath = Join-Path $PSScriptRoot "REPORTE_DOCTORES_HOSPITAL_CHACO.txt"
if (-not $PSScriptRoot) {
    $reportePath = Join-Path (Get-Location) "REPORTE_DOCTORES_HOSPITAL_CHACO.txt"
}
$reporte | Out-File -FilePath $reportePath -Encoding UTF8 -Force

Write-Host "`n✅ Archivo de reporte creado: $reportePath`n" -ForegroundColor Green

# Verificar que el archivo existe
if (-not (Test-Path $reportePath)) {
    Write-Host "❌ Error: No se pudo crear el archivo de reporte`n" -ForegroundColor Red
    exit 1
}

# Crear script VBS mejorado para abrir Outlook con adjunto
$vbsScript = @"
On Error Resume Next
Set objOutlook = CreateObject("Outlook.Application")
If Err.Number <> 0 Then
    WScript.Echo "Error: No se pudo abrir Outlook. Asegúrate de que Outlook esté instalado."
    WScript.Quit
End If

Set objMail = objOutlook.CreateItem(0)

objMail.To = "$destinatario"
objMail.Subject = "$asunto"
objMail.Body = `"$reporte`"
objMail.Importance = 2

' Adjuntar archivo de reporte
If (FSO.FileExists("$reportePath")) Then
    objMail.Attachments.Add "$reportePath"
    WScript.Echo "Archivo adjunto agregado correctamente"
Else
    WScript.Echo "Advertencia: No se encontró el archivo adjunto en: $reportePath"
End If

' Mostrar ventana para enviar (esto es importante)
objMail.Display

' Dar tiempo para que la ventana se abra
WScript.Sleep 2000

' Intentar enviar automáticamente
Set WshShell = CreateObject("WScript.Shell")
WshShell.SendKeys "%s"

On Error Goto 0
"@

# Agregar referencia a FileSystemObject en el script VBS
$vbsScript = $vbsScript -replace 'FSO\.FileExists', 'CreateObject("Scripting.FileSystemObject").FileExists'

# Guardar script VBS temporal
$vbsPath = Join-Path $env:TEMP "enviar_reporte_doctores_$(Get-Date -Format 'yyyyMMddHHmmss').vbs"
$vbsScript | Out-File -FilePath $vbsPath -Encoding ASCII -Force

Write-Host "✅ Abriendo Outlook con el correo y adjunto...`n" -ForegroundColor Green
Write-Host "Destinatario: $destinatario" -ForegroundColor Cyan
Write-Host "Asunto: $asunto" -ForegroundColor Cyan
Write-Host "Adjunto: REPORTE_DOCTORES_HOSPITAL_CHACO.txt" -ForegroundColor Cyan
Write-Host "Ruta del adjunto: $reportePath`n" -ForegroundColor Yellow

# Esperar un momento antes de ejecutar
Start-Sleep -Milliseconds 500

# Ejecutar script VBS de forma visible
try {
    $process = Start-Process -FilePath "cscript.exe" -ArgumentList "//NoLogo", "`"$vbsPath`"" -PassThru -WindowStyle Normal
    
    # Esperar un momento para que Outlook se abra
    Start-Sleep -Seconds 2
    
    Write-Host "✅ Outlook debería estar abierto ahora.`n" -ForegroundColor Green
    Write-Host "Si no ves la ventana, busca 'Outlook' en la barra de tareas.`n" -ForegroundColor Yellow
    
    # Limpiar archivo VBS después de 10 segundos
    Start-Job -ScriptBlock {
        Start-Sleep -Seconds 10
        if (Test-Path $using:vbsPath) {
            Remove-Item $using:vbsPath -Force -ErrorAction SilentlyContinue
        }
    } | Out-Null
    
} catch {
    Write-Host "❌ Error al ejecutar el script: $_`n" -ForegroundColor Red
    Write-Host "Intentando método alternativo...`n" -ForegroundColor Yellow
    
    # Método alternativo: intentar abrir Outlook directamente
    try {
        $outlook = New-Object -ComObject Outlook.Application
        $mail = $outlook.CreateItem(0)
        $mail.To = $destinatario
        $mail.Subject = $asunto
        $mail.Body = $reporte
        $mail.Importance = 2
        if (Test-Path $reportePath) {
            $mail.Attachments.Add($reportePath)
        }
        $mail.Display()
        Write-Host "✅ Outlook abierto con método alternativo`n" -ForegroundColor Green
    } catch {
        Write-Host "❌ Error: $_`n" -ForegroundColor Red
    }
}

