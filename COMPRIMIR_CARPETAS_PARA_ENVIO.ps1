# Script para comprimir las carpetas de Marketing y Presupuesto
# Autor: Equipo CheqFirma
# Fecha: Diciembre 2025

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  COMPRIMIR CARPETAS PARA ENVIO" -ForegroundColor Cyan
Write-Host "  Congreso CheqFirma" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Obtener la ruta del script actual
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Verificar que las carpetas existan
$carpetaMarketing = Join-Path $scriptPath "MARKETING_Y_PAUTAJE"
$carpetaPresupuesto = Join-Path $scriptPath "PRESUPUESTO_50USD_48HORAS"

if (-not (Test-Path $carpetaMarketing)) {
    Write-Host "ERROR: No se encuentra la carpeta MARKETING_Y_PAUTAJE" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $carpetaPresupuesto)) {
    Write-Host "ERROR: No se encuentra la carpeta PRESUPUESTO_50USD_48HORAS" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Carpetas encontradas" -ForegroundColor Green
Write-Host ""

# Crear nombre del archivo ZIP con fecha
$fecha = Get-Date -Format "yyyyMMdd_HHmmss"
$nombreZip = "Carpetas_Marketing_Presupuesto_$fecha.zip"
$rutaZip = Join-Path $scriptPath $nombreZip

# Eliminar ZIP anterior si existe
if (Test-Path $rutaZip) {
    Write-Host "Eliminando archivo ZIP anterior..." -ForegroundColor Yellow
    Remove-Item $rutaZip -Force
}

Write-Host "Comprimiendo carpetas..." -ForegroundColor Yellow
Write-Host "  - MARKETING_Y_PAUTAJE" -ForegroundColor Gray
Write-Host "  - PRESUPUESTO_50USD_48HORAS" -ForegroundColor Gray
Write-Host ""

try {
    # Comprimir las carpetas
    Compress-Archive -Path $carpetaMarketing, $carpetaPresupuesto -DestinationPath $rutaZip -Force
    
    # Obtener el tamaño del archivo
    $tamano = (Get-Item $rutaZip).Length
    $tamanoMB = [math]::Round($tamano / 1MB, 2)
    
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✓ COMPRESIÓN COMPLETADA" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Archivo creado:" -ForegroundColor Cyan
    Write-Host "  $nombreZip" -ForegroundColor White
    Write-Host ""
    Write-Host "Tamaño:" -ForegroundColor Cyan
    Write-Host "  $tamanoMB MB" -ForegroundColor White
    Write-Host ""
    Write-Host "Ubicación:" -ForegroundColor Cyan
    Write-Host "  $rutaZip" -ForegroundColor White
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  PRÓXIMOS PASOS:" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Abre el archivo HTML: ENVIAR_CARPETAS_POR_CORREO.html" -ForegroundColor Yellow
    Write-Host "2. Copia el mensaje del correo" -ForegroundColor Yellow
    Write-Host "3. Abre tu cliente de correo (Gmail, Outlook, etc.)" -ForegroundColor Yellow
    Write-Host "4. Pega el mensaje y adjunta este archivo ZIP" -ForegroundColor Yellow
    Write-Host "5. Envía a: Lallamaqueinflamahk@gmail.com" -ForegroundColor Yellow
    Write-Host ""
    
    # Preguntar si quiere abrir la carpeta
    $abrir = Read-Host "¿Deseas abrir la carpeta donde está el archivo ZIP? (S/N)"
    if ($abrir -eq "S" -or $abrir -eq "s") {
        Invoke-Item $scriptPath
    }
    
    # Preguntar si quiere abrir el HTML
    $abrirHTML = Read-Host "¿Deseas abrir el archivo HTML para enviar el correo? (S/N)"
    if ($abrirHTML -eq "S" -or $abrirHTML -eq "s") {
        $htmlPath = Join-Path $scriptPath "ENVIAR_CARPETAS_POR_CORREO.html"
        if (Test-Path $htmlPath) {
            Start-Process $htmlPath
        } else {
            Write-Host "No se encuentra el archivo HTML" -ForegroundColor Red
        }
    }
    
} catch {
    Write-Host ""
    Write-Host "ERROR al comprimir:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Presiona cualquier tecla para salir..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

