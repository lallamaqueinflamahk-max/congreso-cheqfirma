# Script simplificado que crea un archivo HTML para enviar el correo
# Funciona con cualquier cliente de correo

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

Write-Host "✅ Archivo de reporte creado: $reportePath`n" -ForegroundColor Green

# Convertir reporte a HTML para el cuerpo del correo
$reporteHtml = $reporte -replace "`n", "<br>`n" -replace "═══════════════════════════════════════════════════════════════════════════════", "<hr>"

# Crear archivo HTML que abre el correo
$htmlContent = @"
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Enviar Reporte - Doctores Hospital del Chaco</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background: linear-gradient(135deg, #0A4D9E, #1E6BC7);
            color: white;
            text-align: center;
        }
        .container {
            background: white;
            color: #333;
            padding: 30px;
            border-radius: 10px;
            max-width: 600px;
            margin: 0 auto;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        }
        .btn {
            background: #0A4D9E;
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            margin: 10px;
            text-decoration: none;
            display: inline-block;
        }
        .btn:hover {
            background: #1E6BC7;
        }
        .info {
            background: #f0f0f0;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            text-align: left;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📧 Enviar Reporte de Reservas</h1>
        <p><strong>Hospital del Chaco - Asientos 56 y 57</strong></p>
        
        <div class="info">
            <p><strong>Destinatario:</strong> $destinatario</p>
            <p><strong>Asunto:</strong> $asunto</p>
            <p><strong>Adjunto:</strong> REPORTE_DOCTORES_HOSPITAL_CHACO.txt</p>
        </div>
        
        <p>Haz clic en el botón para abrir tu cliente de correo:</p>
        
        <a href="mailto:$destinatario?subject=$([System.Uri]::EscapeDataString($asunto))&body=$([System.Uri]::EscapeDataString($reporte))" class="btn">
            📧 Abrir Cliente de Correo
        </a>
        
        <p style="margin-top: 20px; font-size: 12px; color: #666;">
            ⚠️ Nota: Tendrás que adjuntar manualmente el archivo:<br>
            <strong>$reportePath</strong>
        </p>
        
        <p style="margin-top: 20px;">
            <button onclick="window.close()" class="btn" style="background: #666;">Cerrar</button>
        </p>
    </div>
    
    <script>
        // Intentar abrir mailto automáticamente
        window.onload = function() {
            setTimeout(function() {
                window.location.href = "mailto:$destinatario?subject=$([System.Uri]::EscapeDataString($asunto))&body=$([System.Uri]::EscapeDataString($reporte))";
            }, 500);
        };
    </script>
</body>
</html>
"@

# Guardar HTML
$htmlPath = Join-Path $scriptDir "ENVIAR_REPORTE_DOCTORES.html"
$htmlContent | Out-File -FilePath $htmlPath -Encoding UTF8 -Force

Write-Host "✅ Abriendo cliente de correo...`n" -ForegroundColor Green
Write-Host "Destinatario: $destinatario" -ForegroundColor Cyan
Write-Host "Asunto: $asunto" -ForegroundColor Cyan
Write-Host "Adjunto: REPORTE_DOCTORES_HOSPITAL_CHACO.txt`n" -ForegroundColor Cyan

# Abrir HTML en el navegador (que abrirá el cliente de correo)
Start-Process $htmlPath

# También intentar abrir mailto directamente
Start-Sleep -Milliseconds 1000
$mailtoUrl = "mailto:$destinatario?subject=$([System.Uri]::EscapeDataString($asunto))&body=$([System.Uri]::EscapeDataString($reporte))"
Start-Process $mailtoUrl

Write-Host "✅ Cliente de correo abierto. Adjunta el archivo: $reportePath`n" -ForegroundColor Green
Write-Host "👉 Haz clic en 'Enviar' para completar`n" -ForegroundColor Cyan

