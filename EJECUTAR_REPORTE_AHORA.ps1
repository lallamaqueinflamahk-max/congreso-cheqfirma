# Script PowerShell para generar reporte AHORA MISMO

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "GENERANDO REPORTE COMPLETO AHORA MISMO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$token = "cheqfirma2025"
$localUrl = "http://localhost:8888/.netlify/functions/sendReportNow?token=$token"
$productionUrl = "https://TU-SITIO.netlify.app/.netlify/functions/sendReportNow?token=$token"

Write-Host "Selecciona el entorno:" -ForegroundColor Yellow
Write-Host "1. Local (Netlify Dev)" -ForegroundColor Green
Write-Host "2. Producción (Netlify)" -ForegroundColor Green
$opcion = Read-Host "Opción (1 o 2)"

if ($opcion -eq "1") {
    $url = $localUrl
    Write-Host "Usando URL local: $url" -ForegroundColor Yellow
} else {
    $url = $productionUrl
    Write-Host "Usando URL de producción: $url" -ForegroundColor Yellow
    Write-Host "IMPORTANTE: Reemplaza TU-SITIO con tu dominio real" -ForegroundColor Red
}

Write-Host ""
Write-Host "Generando reporte..." -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri $url -Method Get -ErrorAction Stop
    Write-Host ""
    Write-Host "✅ Reporte generado y enviado exitosamente!" -ForegroundColor Green
    Write-Host "Fecha: $($response.fecha)" -ForegroundColor White
    Write-Host "Hora: $($response.hora)" -ForegroundColor White
    Write-Host "Destinatarios:" -ForegroundColor White
    $response.destinatarios | ForEach-Object { Write-Host "  - $_" -ForegroundColor White }
} catch {
    Write-Host ""
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Verifica:" -ForegroundColor Yellow
    Write-Host "1. Que el servidor Netlify Dev esté corriendo (si usas opción 1)" -ForegroundColor Yellow
    Write-Host "2. Que RESEND_API_KEY esté configurado en Netlify" -ForegroundColor Yellow
    Write-Host "3. Que la URL sea correcta" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Presiona cualquier tecla para salir..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

