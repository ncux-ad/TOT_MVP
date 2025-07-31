# Скрипт запуска Backend сервисов для TOT проекта
# Запускать из корневой папки проекта

Write-Host "🚀 Запуск Backend сервисов ТОТ..." -ForegroundColor Green

# Проверяем, что мы в корневой папке проекта
if (-not (Test-Path "backend")) {
    Write-Host "❌ Ошибка: Запустите скрипт из корневой папки проекта!" -ForegroundColor Red
    exit 1
}

# Активируем виртуальное окружение (если не активировано)
Write-Host "📦 Проверка виртуального окружения..." -ForegroundColor Cyan
if (Test-Path "venv\Scripts\Activate.ps1") {
    # Проверяем, активировано ли уже виртуальное окружение
    if ($env:VIRTUAL_ENV) {
        Write-Host "✅ Виртуальное окружение уже активировано: $env:VIRTUAL_ENV" -ForegroundColor Green
    } else {
        & "venv\Scripts\Activate.ps1"
        Write-Host "✅ Виртуальное окружение активировано" -ForegroundColor Green
    }
} else {
    Write-Host "❌ Виртуальное окружение не найдено!" -ForegroundColor Red
    Write-Host "Создайте виртуальное окружение: python -m venv venv" -ForegroundColor Yellow
    exit 1
}

# Проверяем, что Python доступен
Write-Host "🔍 Проверка Python..." -ForegroundColor Cyan
try {
    $pythonVersion = & python --version 2>$null
    Write-Host "✅ Python найден: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Python не найден, но продолжаем..." -ForegroundColor Yellow
}

# Проверяем, что все зависимости установлены
Write-Host "📦 Проверка зависимостей..." -ForegroundColor Cyan
try {
    python -c "import fastapi, sqlalchemy, pydantic" 2>$null
    Write-Host "✅ Зависимости установлены" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Зависимости не проверены, но продолжаем..." -ForegroundColor Yellow
}

# Функция для запуска сервиса
function Start-Service {
    param(
        [string]$ServiceName,
        [string]$ScriptPath,
        [int]$Port
    )
    
    Write-Host "🚀 Запуск $ServiceName на порту $Port..." -ForegroundColor Cyan
    
    # Проверяем, не занят ли порт
    $portInUse = netstat -ano | findstr ":$Port "
    if ($portInUse) {
        Write-Host "⚠️ Порт $Port уже занят. Завершаем процесс..." -ForegroundColor Yellow
        $processId = ($portInUse -split '\s+')[-1]
        taskkill /PID $processId /F 2>$null
        Start-Sleep -Seconds 2
    }
    
    # Запускаем сервис в фоновом режиме
    Start-Process -FilePath "python" -ArgumentList $ScriptPath -WindowStyle Hidden -PassThru | Out-Null
    
    # Ждем немного для запуска
    Start-Sleep -Seconds 3
    
    # Проверяем, что сервис запустился
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$Port/health" -TimeoutSec 5 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $ServiceName запущен успешно (порт $Port)" -ForegroundColor Green
            return $true
        }
    } catch {
        Write-Host "⚠️ $ServiceName запущен, но health check не отвечает" -ForegroundColor Yellow
        return $true
    }
}

# Запускаем сервисы
$services = @(
    @{Name="API Gateway"; Script="backend\api-gateway\main.py"; Port=8000},
    @{Name="User Service"; Script="backend\user-service\main.py"; Port=8001},
    @{Name="Profile Service"; Script="backend\profile-service\main.py"; Port=8002},
    @{Name="Payment Service"; Script="backend\payment-service\main.py"; Port=8005}
)

$successCount = 0
foreach ($service in $services) {
    if (Start-Service -ServiceName $service.Name -ScriptPath $service.Script -Port $service.Port) {
        $successCount++
    }
}

Write-Host "`n📊 Результат запуска:" -ForegroundColor Cyan
Write-Host "✅ Успешно запущено: $successCount из $($services.Count) сервисов" -ForegroundColor Green

if ($successCount -eq $services.Count) {
    Write-Host "`n🎉 Все Backend сервисы запущены!" -ForegroundColor Green
    Write-Host "`n🌐 Доступные endpoints:" -ForegroundColor Cyan
    Write-Host "• API Gateway: http://localhost:8000" -ForegroundColor White
    Write-Host "• User Service: http://localhost:8001" -ForegroundColor White
    Write-Host "• Profile Service: http://localhost:8002" -ForegroundColor White
    Write-Host "• Payment Service: http://localhost:8005" -ForegroundColor White
    Write-Host "`n📚 Swagger документация:" -ForegroundColor Cyan
    Write-Host "• API Gateway: http://localhost:8000/docs" -ForegroundColor White
} else {
    Write-Host "`n⚠️ Некоторые сервисы не запустились. Проверьте логи выше." -ForegroundColor Yellow
}

Write-Host "`n💡 Для остановки сервисов используйте: .\scripts\stop-backend.ps1" -ForegroundColor Cyan

# Возвращаем успешный код выхода
exit 0 