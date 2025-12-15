# Script PowerShell para comprimir el proyecto excluyendo archivos innecesarios
# Para enviar por Google Drive

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "COMPRIMIENDO PROYECTO PARA GOOGLE DRIVE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectName = "Congreso Foro Cheq Firma"
$outputZip = "Congreso_Foro_CheqFirma_$(Get-Date -Format 'yyyyMMdd_HHmmss').zip"
$sourcePath = Get-Location
$desktopPath = [Environment]::GetFolderPath("Desktop")
$zipPath = Join-Path $desktopPath $outputZip

Write-Host "Proyecto: $projectName" -ForegroundColor Yellow
Write-Host "Origen: $sourcePath" -ForegroundColor Yellow
Write-Host "Archivo ZIP: $outputZip" -ForegroundColor Yellow
Write-Host "Destino: $desktopPath" -ForegroundColor Yellow
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Host "ERROR: No se encontro package.json" -ForegroundColor Red
    Write-Host "Asegurate de ejecutar este script desde la raiz del proyecto" -ForegroundColor Red
    exit 1
}

Write-Host "Excluyendo archivos innecesarios..." -ForegroundColor Cyan

# Lista de exclusiones
$excludePatterns = @(
    "node_modules",
    ".git",
    "*.log",
    ".env",
    "*.zip",
    "*.tmp",
    ".DS_Store",
    "Thumbs.db",
    "__pycache__",
    "*.pyc",
    ".pytest_cache",
    "*.egg-info",
    "dist",
    "build",
    ".next",
    ".cache"
)

Write-Host "   Excluyendo:" -ForegroundColor Gray
foreach ($pattern in $excludePatterns) {
    Write-Host "   - $pattern" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Comprimiendo..." -ForegroundColor Cyan

try {
    # Crear lista de archivos a incluir
    $filesToInclude = @()
    $items = Get-ChildItem -Path $sourcePath -Force -ErrorAction SilentlyContinue
    
    foreach ($item in $items) {
        $shouldExclude = $false
        
        # Verificar exclusiones
        foreach ($pattern in $excludePatterns) {
            if ($item.Name -like $pattern -or 
                $item.Name -eq $pattern.Replace("*", "") -or
                ($item.PSIsContainer -and $item.Name -eq $pattern)) {
                $shouldExclude = $true
                break
            }
        }
        
        # Excluir el ZIP de salida si ya existe
        if ($item.Name -eq $outputZip) {
            $shouldExclude = $true
        }
        
        if (-not $shouldExclude) {
            $filesToInclude += $item.FullName
        }
    }
    
    # Comprimir usando Compress-Archive (guardar en escritorio)
    $zipPath = Join-Path $desktopPath $outputZip
    
    # Si el ZIP ya existe, eliminarlo
    if (Test-Path $zipPath) {
        Remove-Item $zipPath -Force
    }
    
    # Comprimir
    Compress-Archive -Path $filesToInclude -DestinationPath $zipPath -Force
    
    $zipSize = (Get-Item $zipPath).Length / 1MB
    
    Write-Host ""
    Write-Host "Compresion completada exitosamente!" -ForegroundColor Green
    Write-Host "Archivo: $outputZip" -ForegroundColor White
    Write-Host "Tamaño: $([math]::Round($zipSize, 2)) MB" -ForegroundColor White
    Write-Host ""
    Write-Host "Ubicacion: $zipPath" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Listo para subir a Google Drive!" -ForegroundColor Green
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "PROXIMOS PASOS:" -ForegroundColor Cyan
    Write-Host "1. Ve a https://drive.google.com" -ForegroundColor White
    Write-Host "2. Sube el archivo: $outputZip" -ForegroundColor White
    Write-Host "3. Comparte el enlace con el destinatario" -ForegroundColor White
    Write-Host "========================================" -ForegroundColor Cyan
    
} catch {
    Write-Host ""
    Write-Host "Error durante la compresion:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
