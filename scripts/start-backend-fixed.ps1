# Исправленный скрипт запуска Backend сервисов для TOT проекта
# Запускать из корневой папки проекта

Write-Host "🚀 Запуск Backend сервисов ТОТ (исправленная версия)..." -ForegroundColor Green

# Проверяем, что мы в корневой папке проекта
if (-not (Test-Path "backend")) {
    Write-Host "❌ Ошибка: Запустите скрипт из корневой папки проекта!" -ForegroundColor Red
    exit 1
}

# Активируем виртуальное окружение
Write-Host "📦 Активация виртуального окружения..." -ForegroundColor Cyan
if (Test-Path "venv\Scripts\Activate.ps1") {
    & "venv\Scripts\Activate.ps1"
    Write-Host "✅ Виртуальное окружение активировано" -ForegroundColor Green
} else {
    Write-Host "❌ Виртуальное окружение не найдено!" -ForegroundColor Red
    exit 1
}

# Проверяем Python
Write-Host "🔍 Проверка Python..." -ForegroundColor Cyan
try {
    $pythonVersion = python --version
    Write-Host "✅ Python найден: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python не найден!" -ForegroundColor Red
    exit 1
}

# Запускаем сервисы в отдельных окнах
$services = @(
    @{Name="API Gateway"; Script="backend\api-gateway\main.py"; Port=8000},
    @{Name="User Service"; Script="backend\user-service\main.py"; Port=8001},
    @{Name="Profile Service"; Script="backend\profile-service\main.py"; Port=8002},
    @{Name="Payment Service"; Script="backend\payment-service\main.py"; Port=8005}
)

Write-Host "`n🚀 Запуск сервисов в отдельных окнах..." -ForegroundColor Cyan

foreach ($service in $services) {
    Write-Host "📱 Запуск $($service.Name) на порту $($service.Port)..." -ForegroundColor Yellow
    
    # Проверяем, не занят ли порт
    $portInUse = netstat -ano | findstr ":$($service.Port) "
    if ($portInUse) {
        Write-Host "⚠️ Порт $($service.Port) уже занят" -ForegroundColor Yellow
    }
    
    # Запускаем сервис в новом окне PowerShell
    $command = "cd '$PWD'; python '$($service.Script)'"
    Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", $command -WindowStyle Normal
    
    Write-Host "✅ $($service.Name) запущен в новом окне" -ForegroundColor Green
    Start-Sleep -Seconds 3
}

Write-Host "`n🎉 Все Backend сервисы запущены!" -ForegroundColor Green
Write-Host "`n🌐 Доступные endpoints:" -ForegroundColor Cyan
Write-Host "• API Gateway: http://localhost:8000" -ForegroundColor White
Write-Host "• User Service: http://localhost:8001" -ForegroundColor White
Write-Host "• Profile Service: http://localhost:8002" -ForegroundColor White
Write-Host "• Payment Service: http://localhost:8005" -ForegroundColor White
Write-Host "`n📚 Swagger документация:" -ForegroundColor Cyan
Write-Host "• API Gateway: http://localhost:8000/docs" -ForegroundColor White
Write-Host "`n💡 Для остановки сервисов закройте окна PowerShell" -ForegroundColor Cyan
exit 0 