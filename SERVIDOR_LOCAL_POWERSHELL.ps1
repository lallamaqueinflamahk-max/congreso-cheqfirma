# Servidor Local para Congreso CheqFirma
# Accesible desde celular en la misma red WiFi

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host " SERVIDOR LOCAL PARA CONGRESO CHEQFIRMA" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Obtener IP local
try {
    $ipAddress = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -notlike "*Loopback*" -and $_.IPAddress -notlike "169.254.*"} | Select-Object -First 1).IPAddress
} catch {
    # Método alternativo
    $ipAddress = (Get-NetIPConfiguration | Where-Object {$_.IPv4Address.IPAddress -notlike "169.254.*"} | Select-Object -First 1).IPv4Address.IPAddress
}

if (-not $ipAddress) {
    Write-Host "No se pudo obtener la direccion IP local" -ForegroundColor Red
    Write-Host "Asegurate de estar conectado a una red WiFi" -ForegroundColor Yellow
    pause
    exit
}

Write-Host "============================================" -ForegroundColor Green
Write-Host " IMPORTANTE:" -ForegroundColor Yellow
Write-Host " 1. Asegurate de que tu celular este en la misma red WiFi" -ForegroundColor White
Write-Host " 2. Tu direccion IP local es: $ipAddress" -ForegroundColor Cyan
Write-Host " 3. Abre en tu celular: http://$ipAddress`:8000" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Iniciando servidor..." -ForegroundColor Yellow
Write-Host "Presiona Ctrl+C para detener el servidor" -ForegroundColor Gray
Write-Host ""

# Verificar si Python está instalado
$python = Get-Command python -ErrorAction SilentlyContinue
if (-not $python) {
    Write-Host "Python no encontrado. Intentando con Python3..." -ForegroundColor Yellow
    $python = Get-Command python3 -ErrorAction SilentlyContinue
}

if ($python) {
    # Usar Python HTTP Server
    Write-Host "Usando Python HTTP Server..." -ForegroundColor Green
    try {
        Set-Location $PSScriptRoot
        python -m http.server 8000
    } catch {
        Write-Host "Error al iniciar servidor Python: $_" -ForegroundColor Red
        Write-Host "Asegúrate de estar en el directorio correcto" -ForegroundColor Yellow
        pause
        exit 1
    }
} else {
    # Intentar con Node.js si está disponible
    $node = Get-Command node -ErrorAction SilentlyContinue
    if ($node) {
        Write-Host "Python no encontrado. Usando Node.js..." -ForegroundColor Yellow
        try {
            Set-Location $PSScriptRoot
            npx --yes http-server -p 8000 -c-1
        } catch {
            Write-Host "Error al iniciar servidor Node.js: $_" -ForegroundColor Red
            Write-Host ""
            Write-Host "ERROR: No se pudo iniciar el servidor" -ForegroundColor Red
            Write-Host ""
            Write-Host "Opciones:" -ForegroundColor Yellow
            Write-Host "1. Instalar Python desde: https://www.python.org/downloads/" -ForegroundColor White
            Write-Host "2. O usar el servidor alternativo SERVIDOR_LOCAL_SIMPLE.bat" -ForegroundColor White
            Write-Host ""
            pause
        }
    } else {
        Write-Host ""
        Write-Host "ERROR: No se encontro Python ni Node.js" -ForegroundColor Red
        Write-Host ""
        Write-Host "Opciones:" -ForegroundColor Yellow
        Write-Host "1. Instalar Python desde: https://www.python.org/downloads/" -ForegroundColor White
        Write-Host "2. O usar el servidor alternativo SERVIDOR_LOCAL_SIMPLE.bat" -ForegroundColor White
        Write-Host ""
        pause
    }
}

