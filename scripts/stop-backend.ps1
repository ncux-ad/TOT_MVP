# Скрипт остановки Backend сервисов для TOT проекта
# Запускать из корневой папки проекта

Write-Host "🛑 Остановка Backend сервисов ТОТ..." -ForegroundColor Green

# Проверяем, что мы в корневой папке проекта
if (-not (Test-Path "backend")) {
    Write-Host "❌ Ошибка: Запустите скрипт из корневой папки проекта!" -ForegroundColor Red
    exit 1
}

# Порты сервисов
$ports = @(8000, 8001, 8002, 8005)

$stoppedCount = 0
foreach ($port in $ports) {
    Write-Host "🔍 Поиск процессов на порту $port..." -ForegroundColor Cyan
    
    # Находим процессы на порту
    $processes = netstat -ano | findstr ":$port "
    
    if ($processes) {
        Write-Host "📋 Найдены процессы на порту $port:" -ForegroundColor Yellow
        $processes | ForEach-Object {
            $parts = $_ -split '\s+'
            $pid = $parts[-1]
            $processName = (Get-Process -Id $pid -ErrorAction SilentlyContinue).ProcessName
            Write-Host "  • PID: $pid, Process: $processName" -ForegroundColor White
        }
        
        # Завершаем процессы
        $processes | ForEach-Object {
            $parts = $_ -split '\s+'
            $pid = $parts[-1]
            try {
                Stop-Process -Id $pid -Force -ErrorAction Stop
                Write-Host "✅ Процесс $pid завершен" -ForegroundColor Green
                $stoppedCount++
            } catch {
                Write-Host "❌ Не удалось завершить процесс $pid" -ForegroundColor Red
            }
        }
    } else {
        Write-Host "ℹ️ Процессы на порту $port не найдены" -ForegroundColor Gray
    }
}

Write-Host "`n📊 Результат остановки:" -ForegroundColor Cyan
Write-Host "🛑 Завершено процессов: $stoppedCount" -ForegroundColor Green

if ($stoppedCount -gt 0) {
    Write-Host "`n✅ Backend сервисы остановлены!" -ForegroundColor Green
} else {
    Write-Host "`nℹ️ Сервисы уже были остановлены или не запущены" -ForegroundColor Yellow
}

Write-Host "`n💡 Для запуска сервисов используйте: .\scripts\start-backend.ps1" -ForegroundColor Cyan 