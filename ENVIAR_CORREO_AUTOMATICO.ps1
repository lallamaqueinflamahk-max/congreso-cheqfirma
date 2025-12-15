# Script para enviar correo automático con las carpetas
# Autor: Equipo CheqFirma
# Fecha: Diciembre 2025

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ENVÍO AUTOMÁTICO DE CORREO" -ForegroundColor Cyan
Write-Host "  Congreso CheqFirma" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configuración
$destinatario = "Lallamaqueinflamahk@gmail.com"
$asunto = "Carpetas de Marketing y Presupuesto - Congreso CheqFirma"
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Buscar el archivo ZIP más reciente
$archivosZip = Get-ChildItem -Path $scriptPath -Filter "Carpetas_Marketing_Presupuesto_*.zip" | Sort-Object LastWriteTime -Descending
if ($archivosZip.Count -eq 0) {
    Write-Host "Creando archivo ZIP..." -ForegroundColor Yellow
    $fecha = Get-Date -Format "yyyyMMdd_HHmmss"
    $nombreZip = "Carpetas_Marketing_Presupuesto_$fecha.zip"
    
    if (Test-Path "MARKETING_Y_PAUTAJE" -and Test-Path "PRESUPUESTO_50USD_48HORAS") {
        Compress-Archive -Path "MARKETING_Y_PAUTAJE", "PRESUPUESTO_50USD_48HORAS" -DestinationPath $nombreZip -Force
        $archivoZip = Get-Item $nombreZip
    } else {
        Write-Host "ERROR: No se encuentran las carpetas necesarias" -ForegroundColor Red
        Read-Host "Presiona Enter para salir"
        exit 1
    }
} else {
    $archivoZip = $archivosZip[0]
}

Write-Host "✓ Archivo ZIP encontrado: $($archivoZip.Name)" -ForegroundColor Green
Write-Host ""

# Mensaje del correo
$mensaje = @"
Hola,

Te envío las carpetas preparadas con los contenidos de marketing y pautaje, así como el presupuesto de `$50 USD para 48 horas que solicitaste.

📁 CARPETAS INCLUIDAS:

1. MARKETING_Y_PAUTAJE
   - Plan completo de marketing para Paraguay
   - Contenidos listos para usar (posts, stories, carousels)
   - Estrategia multi-país
   - Ejemplos de anuncios completos
   - Creativos y copies

2. PRESUPUESTO_50USD_48HORAS
   - Estrategia ultra-optimizada para `$50 USD
   - Distribución del presupuesto por día y hora
   - Creativos listos para usar
   - Métricas y resultados esperados

Cada carpeta incluye un archivo README.md con instrucciones detalladas de uso.

Si tienes alguna pregunta o necesitas ajustes, no dudes en contactarme.

Saludos,
Equipo CheqFirma
"@

# Intentar diferentes métodos para abrir el correo

# Método 1: Outlook (si está instalado)
$outlookPath = "C:\Program Files\Microsoft Office\root\Office16\OUTLOOK.EXE"
if (-not (Test-Path $outlookPath)) {
    $outlookPath = "C:\Program Files (x86)\Microsoft Office\root\Office16\OUTLOOK.EXE"
}

if (Test-Path $outlookPath) {
    Write-Host "Abriendo Outlook..." -ForegroundColor Yellow
    
    # Crear archivo VBS temporal para abrir Outlook con el correo
    $vbsScript = @"
Set objOutlook = CreateObject("Outlook.Application")
Set objMail = objOutlook.CreateItem(0)
objMail.To = "$destinatario"
objMail.Subject = "$asunto"
objMail.Body = "$($mensaje -replace '"', '""')"
objMail.Attachments.Add "$($archivoZip.FullName)"
objMail.Display
"@
    
    $vbsPath = Join-Path $env:TEMP "enviar_correo.vbs"
    $vbsScript | Out-File -FilePath $vbsPath -Encoding ASCII
    
    Start-Process "wscript.exe" -ArgumentList $vbsPath -WindowStyle Hidden
    
    Write-Host ""
    Write-Host "✓ Outlook abierto con el correo pre-configurado" -ForegroundColor Green
    Write-Host "  Solo necesitas hacer clic en 'Enviar'" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Archivo adjunto: $($archivoZip.Name)" -ForegroundColor Cyan
    Write-Host ""
    
    # Limpiar archivo VBS después de 5 segundos
    Start-Sleep -Seconds 5
    if (Test-Path $vbsPath) {
        Remove-Item $vbsPath -Force -ErrorAction SilentlyContinue
    }
    
    exit 0
}

# Método 2: mailto: (funciona con Gmail, Outlook.com, etc.)
Write-Host "Abriendo cliente de correo predeterminado..." -ForegroundColor Yellow

# Codificar el mensaje para URL
$mensajeEncoded = [System.Web.HttpUtility]::UrlEncode($mensaje)
$asuntoEncoded = [System.Web.HttpUtility]::UrlEncode($asunto)

# mailto: no soporta adjuntos directamente, pero podemos abrir el correo
$mailtoLink = "mailto:$destinatario?subject=$asuntoEncoded&body=$mensajeEncoded"

Start-Process $mailtoLink

Write-Host ""
Write-Host "✓ Cliente de correo abierto" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️ IMPORTANTE:" -ForegroundColor Yellow
Write-Host "  El cliente de correo se abrió con el mensaje pre-llenado." -ForegroundColor White
Write-Host "  Debes ADJUNTAR MANUALMENTE el archivo:" -ForegroundColor White
Write-Host "  $($archivoZip.FullName)" -ForegroundColor Cyan
Write-Host ""
Write-Host "  O puedes arrastrar el archivo desde esta ubicación:" -ForegroundColor White
Write-Host "  $($archivoZip.DirectoryName)" -ForegroundColor Gray
Write-Host ""

# Abrir la carpeta donde está el ZIP para facilitar el arrastre
$abrirCarpeta = Read-Host "¿Deseas abrir la carpeta donde está el archivo ZIP para arrastrarlo? (S/N)"
if ($abrirCarpeta -eq "S" -or $abrirCarpeta -eq "s") {
    Invoke-Item $archivoZip.DirectoryName
    Write-Host ""
    Write-Host "✓ Carpeta abierta. Arrastra el archivo ZIP al correo." -ForegroundColor Green
}

Write-Host ""
Write-Host "Presiona cualquier tecla para salir..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

