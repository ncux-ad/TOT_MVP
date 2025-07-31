# Скрипт тестирования сетевого доступа к TOT сервисам

Write-Host "🌐 Тестирование сетевого доступа к TOT сервисам..." -ForegroundColor Green

# Получаем IP адрес
$ipAddress = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -like "192.168.*"} | Select-Object -First 1).IPAddress

if (-not $ipAddress) {
    Write-Host "❌ Не удалось определить IP адрес в локальной сети" -ForegroundColor Red
    exit 1
}

Write-Host "📍 IP адрес: $ipAddress" -ForegroundColor Cyan

# Порт сервисов
$services = @(
    @{Port=8000; Name="API Gateway"},
    @{Port=8001; Name="User Service"},
    @{Port=8002; Name="Profile Service"},
    @{Port=8005; Name="Payment Service"}
)

Write-Host "`n🔍 Проверяем доступность сервисов..." -ForegroundColor Yellow

foreach ($service in $services) {
    $port = $service.Port
    $name = $service.Name
    $url = "http://$ipAddress`:$port/health"
    
    try {
        $response = Invoke-WebRequest -Uri $url -TimeoutSec 5 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "  ✅ $name (порт $port) - ДОСТУПЕН" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️ $name (порт $port) - Статус: $($response.StatusCode)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "  ❌ $name (порт $port) - НЕДОСТУПЕН" -ForegroundColor Red
        Write-Host "     Ошибка: $($_.Exception.Message)" -ForegroundColor Gray
    }
}

Write-Host "`n📋 Инструкции для решения проблем:" -ForegroundColor Cyan
Write-Host "1. Запустите PowerShell от имени администратора" -ForegroundColor White
Write-Host "2. Выполните: .\scripts\setup-firewall.ps1" -ForegroundColor White
Write-Host "3. Или временно отключите брандмауэр Windows" -ForegroundColor White
Write-Host "4. Проверьте, что сервисы запущены: Get-Process python" -ForegroundColor White

Write-Host "`n🌐 URL для тестирования с других устройств:" -ForegroundColor Cyan
foreach ($service in $services) {
    $port = $service.Port
    $name = $service.Name
    Write-Host "  $name`: http://$ipAddress`:$port" -ForegroundColor White
}

Write-Host "`n📱 Swagger документация:" -ForegroundColor Cyan
Write-Host "  API Gateway: http://$ipAddress`:8000/docs" -ForegroundColor White
Write-Host "  User Service: http://$ipAddress`:8001/docs" -ForegroundColor White
Write-Host "  Profile Service: http://$ipAddress`:8002/docs" -ForegroundColor White
Write-Host "  Payment Service: http://$ipAddress`:8005/docs" -ForegroundColor White 