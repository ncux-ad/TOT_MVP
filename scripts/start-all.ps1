# Скрипт запуска всех сервисов ТОТ проекта
# Запускать из корневой папки проекта

Write-Host "🚀 Запуск всех сервисов ТОТ..." -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan

# Проверяем, что мы в корневой папке проекта
if (-not (Test-Path "backend") -or -not (Test-Path "frontend")) {
    Write-Host "❌ Ошибка: Запустите скрипт из корневой папки проекта!" -ForegroundColor Red
    exit 1
}

# Функция для проверки статуса сервисов
function Test-Services {
    Write-Host "`n🔍 Проверка статуса сервисов..." -ForegroundColor Cyan
    
    $services = @(
        @{Name="API Gateway"; Port=8000; URL="http://localhost:8000/health"},
        @{Name="User Service"; Port=8001; URL="http://localhost:8001/health"},
        @{Name="Profile Service"; Port=8002; URL="http://localhost:8002/health"},
        @{Name="Payment Service"; Port=8005; URL="http://localhost:8005/health"},
        @{Name="Patient App"; Port=3000; URL="http://localhost:3000"},
        @{Name="Admin Panel"; Port=3003; URL="http://localhost:3003"}
    )
    
    $runningCount = 0
    foreach ($service in $services) {
        $portInUse = netstat -ano | findstr ":$($service.Port) "
        if ($portInUse) {
            Write-Host "✅ $($service.Name) - запущен (порт $($service.Port))" -ForegroundColor Green
            $runningCount++
        } else {
            Write-Host "❌ $($service.Name) - не запущен (порт $($service.Port))" -ForegroundColor Red
        }
    }
    
    return $runningCount, $services.Count
}

# Проверяем текущий статус
$currentRunning, $totalServices = Test-Services

if ($currentRunning -eq $totalServices) {
    Write-Host "`n🎉 Все сервисы уже запущены!" -ForegroundColor Green
    Write-Host "`n🌐 Доступные URL:" -ForegroundColor Cyan
    Write-Host "• API Gateway: http://localhost:8000" -ForegroundColor White
    Write-Host "• User Service: http://localhost:8001" -ForegroundColor White
    Write-Host "• Profile Service: http://localhost:8002" -ForegroundColor White
    Write-Host "• Payment Service: http://localhost:8005" -ForegroundColor White
    Write-Host "• Patient App: http://localhost:3000" -ForegroundColor White
    Write-Host "• Admin Panel: http://localhost:3003" -ForegroundColor White
    Write-Host "`n📚 Swagger документация:" -ForegroundColor Cyan
    Write-Host "• API Gateway: http://localhost:8000/docs" -ForegroundColor White
    Write-Host "`n📱 Демо аккаунты:" -ForegroundColor Cyan
    Write-Host "• Patient App: patient@example.com / password123" -ForegroundColor White
    Write-Host "• Admin Panel: admin@tot.ru / admin123" -ForegroundColor White
    exit 0
}

# Запускаем Backend сервисы
Write-Host "`n🔧 Запуск Backend сервисов..." -ForegroundColor Cyan
try {
    & "$PSScriptRoot\start-backend-fixed.ps1"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Ошибка запуска Backend сервисов!" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Ошибка запуска Backend сервисов!" -ForegroundColor Red
    exit 1
}

# Ждем немного для запуска сервисов
Write-Host "⏳ Ожидание запуска сервисов..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Запускаем Patient App
Write-Host "`n🎨 Запуск Patient App..." -ForegroundColor Cyan
try {
    Start-Process powershell -ArgumentList "-NoExit -Command `"& '$PSScriptRoot\start-patient-app.ps1'`""
} catch {
    Write-Host "❌ Ошибка запуска Patient App!" -ForegroundColor Red
    exit 1
}

# Ждем немного для запуска Patient App
Start-Sleep -Seconds 3

# Запускаем Admin Panel
Write-Host "`n🎛️ Запуск Admin Panel..." -ForegroundColor Cyan
try {
    Start-Process powershell -ArgumentList "-NoExit -Command `"& '$PSScriptRoot\start-admin-panel.ps1'`""
} catch {
    Write-Host "❌ Ошибка запуска Admin Panel!" -ForegroundColor Red
    exit 1
}

# Ждем еще немного
Start-Sleep -Seconds 3

# Финальная проверка
Write-Host "`n🔍 Финальная проверка..." -ForegroundColor Cyan
$finalRunning, $finalTotal = Test-Services

if ($finalRunning -eq $finalTotal) {
    Write-Host "`n🎉 Все сервисы успешно запущены!" -ForegroundColor Green
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "`n🌐 Доступные URL:" -ForegroundColor Cyan
    Write-Host "• API Gateway: http://localhost:8000" -ForegroundColor White
    Write-Host "• User Service: http://localhost:8001" -ForegroundColor White
    Write-Host "• Profile Service: http://localhost:8002" -ForegroundColor White
    Write-Host "• Payment Service: http://localhost:8005" -ForegroundColor White
    Write-Host "• Patient App: http://localhost:3000" -ForegroundColor White
    Write-Host "• Admin Panel: http://localhost:3003" -ForegroundColor White
    Write-Host "`n📚 Swagger документация:" -ForegroundColor Cyan
    Write-Host "• API Gateway: http://localhost:8000/docs" -ForegroundColor White
    Write-Host "`n📱 Демо аккаунты:" -ForegroundColor Cyan
    Write-Host "• Patient App: patient@example.com / password123" -ForegroundColor White
    Write-Host "• Admin Panel: admin@tot.ru / admin123" -ForegroundColor White
    Write-Host "`n💡 Для остановки всех сервисов используйте: .\scripts\stop-all.ps1" -ForegroundColor Cyan
} else {
    Write-Host "`n⚠️ Некоторые сервисы не запустились!" -ForegroundColor Yellow
    Write-Host "Запущено: $finalRunning из $finalTotal" -ForegroundColor Yellow
    Write-Host "Проверьте логи выше для диагностики проблем." -ForegroundColor Yellow
}