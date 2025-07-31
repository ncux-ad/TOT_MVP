# Скрипт настройки брандмауэра Windows для TOT сервисов
# Запускать с правами администратора

Write-Host "🔧 Настройка брандмауэра Windows для TOT сервисов..." -ForegroundColor Green

# Проверяем права администратора
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "❌ Этот скрипт требует прав администратора!" -ForegroundColor Red
    Write-Host "Запустите PowerShell от имени администратора и попробуйте снова." -ForegroundColor Yellow
    exit 1
}

# Порт сервисов
$ports = @(8000, 8001, 8002, 8005, 3000)
$serviceNames = @("API Gateway", "User Service", "Profile Service", "Payment Service")

# Удаляем старые правила (если есть)
Write-Host "🗑️ Удаляем старые правила..." -ForegroundColor Yellow
foreach ($port in $ports) {
    netsh advfirewall firewall delete rule name="TOT Port $port" 2>$null
}

# Создаем новые правила
Write-Host "✅ Создаем правила для портов..." -ForegroundColor Green
for ($i = 0; $i -lt $ports.Length; $i++) {
    $port = $ports[$i]
    $serviceName = $serviceNames[$i]
    
    # Правило для входящих подключений
    netsh advfirewall firewall add rule name="TOT $serviceName (In)" dir=in action=allow protocol=TCP localport=$port
    Write-Host "  ✅ Порт $port ($serviceName) - входящие подключения" -ForegroundColor Green
    
    # Правило для исходящих подключений
    netsh advfirewall firewall add rule name="TOT $serviceName (Out)" dir=out action=allow protocol=TCP localport=$port
    Write-Host "  ✅ Порт $port ($serviceName) - исходящие подключения" -ForegroundColor Green
}

# Проверяем созданные правила
Write-Host "`n📋 Проверяем созданные правила:" -ForegroundColor Cyan
foreach ($port in $ports) {
    $rule = netsh advfirewall firewall show rule name="TOT*" | findstr "Порт $port"
    if ($rule) {
        Write-Host "  ✅ Правило для порта $port создано" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Правило для порта $port не найдено" -ForegroundColor Red
    }
}

Write-Host "`n🎉 Настройка брандмауэра завершена!" -ForegroundColor Green
Write-Host "Теперь сервисы должны быть доступны с других устройств в сети." -ForegroundColor Yellow
Write-Host "`n📱 Для тестирования используйте:" -ForegroundColor Cyan
Write-Host "  curl http://192.168.1.107:8000/health" -ForegroundColor White
Write-Host "  curl http://192.168.1.107:8001/health" -ForegroundColor White
Write-Host "  curl http://192.168.1.107:8002/health" -ForegroundColor White
Write-Host "  curl http://192.168.1.107:8005/health" -ForegroundColor White 