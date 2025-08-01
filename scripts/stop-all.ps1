# Скрипт остановки всех сервисов ТОТ проекта
# Запускать из корневой папки проекта

Write-Host "🛑 Остановка всех сервисов ТОТ..." -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan

# Проверяем, что мы в корневой папке проекта
if (-not (Test-Path "backend") -or -not (Test-Path "frontend")) {
    Write-Host "❌ Ошибка: Запустите скрипт из корневой папки проекта!" -ForegroundColor Red
    exit 1
}

# Останавливаем Backend сервисы
Write-Host "`n🔧 Остановка Backend сервисов..." -ForegroundColor Cyan
try {
    & ".\scripts\stop-backend.ps1"
} catch {
    Write-Host "⚠️ Ошибка остановки Backend сервисов" -ForegroundColor Yellow
}

# Останавливаем Frontend приложение
Write-Host "`n🎨 Остановка Frontend приложения..." -ForegroundColor Cyan

# Находим и завершаем процессы на порту 3000 (Patient App)
$portInUse = netstat -ano | findstr ":3000 "
if ($portInUse) {
    Write-Host "📋 Найдены процессы на порту 3000 (Patient App):" -ForegroundColor Yellow
    $portInUse | ForEach-Object {
        $parts = $_ -split '\s+'
        $processId = $parts[-1]
        $processName = (Get-Process -Id $processId -ErrorAction SilentlyContinue).ProcessName
        Write-Host "  • PID: $processId, Process: $processName" -ForegroundColor White
    }
    
    # Завершаем процессы
    $portInUse | ForEach-Object {
        $parts = $_ -split '\s+'
        $processId = $parts[-1]
        try {
            Stop-Process -Id $processId -Force -ErrorAction Stop
            Write-Host "✅ Процесс $processId завершен" -ForegroundColor Green
        } catch {
            Write-Host "❌ Не удалось завершить процесс $processId" -ForegroundColor Red
        }
    }
} else {
    Write-Host "ℹ️ Процессы на порту 3000 не найдены" -ForegroundColor Gray
}

# Находим и завершаем процессы на порту 3003 (Admin Panel)
$portInUse = netstat -ano | findstr ":3003 "
if ($portInUse) {
    Write-Host "📋 Найдены процессы на порту 3003 (Admin Panel):" -ForegroundColor Yellow
    $portInUse | ForEach-Object {
        $parts = $_ -split '\s+'
        $processId = $parts[-1]
        $processName = (Get-Process -Id $processId -ErrorAction SilentlyContinue).ProcessName
        Write-Host "  • PID: $processId, Process: $processName" -ForegroundColor White
    }
    
    # Завершаем процессы
    $portInUse | ForEach-Object {
        $parts = $_ -split '\s+'
        $processId = $parts[-1]
        try {
            Stop-Process -Id $processId -Force -ErrorAction Stop
            Write-Host "✅ Процесс $processId завершен" -ForegroundColor Green
        } catch {
            Write-Host "❌ Не удалось завершить процесс $processId" -ForegroundColor Red
        }
    }
} else {
    Write-Host "ℹ️ Процессы на порту 3003 не найдены" -ForegroundColor Gray
}

# Финальная проверка
Write-Host "`n🔍 Проверка статуса сервисов..." -ForegroundColor Cyan

$services = @(
    @{Name="API Gateway"; Port=8000},
    @{Name="User Service"; Port=8001},
    @{Name="Profile Service"; Port=8002},
    @{Name="Payment Service"; Port=8005},
    @{Name="Patient App"; Port=3000},
    @{Name="Admin Panel"; Port=3003}
)

$runningCount = 0
foreach ($service in $services) {
    $portInUse = netstat -ano | findstr ":$($service.Port) "
    if ($portInUse) {
        Write-Host "⚠️ $($service.Name) - все еще запущен (порт $($service.Port))" -ForegroundColor Yellow
        $runningCount++
    } else {
        Write-Host "✅ $($service.Name) - остановлен (порт $($service.Port))" -ForegroundColor Green
    }
}

Write-Host "`n📊 Результат остановки:" -ForegroundColor Cyan
if ($runningCount -eq 0) {
    Write-Host "🎉 Все сервисы успешно остановлены!" -ForegroundColor Green
} else {
    Write-Host "⚠️ $runningCount сервисов все еще запущены" -ForegroundColor Yellow
}

Write-Host "`n💡 Для запуска всех сервисов используйте: .\scripts\start-all.ps1" -ForegroundColor Cyan 