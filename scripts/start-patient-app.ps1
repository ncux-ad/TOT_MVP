# Скрипт для запуска Patient App
# Запускать из корневой папки проекта

Write-Host "🎨 Запуск Patient App..." -ForegroundColor Green

# Проверяем, что мы в корневой папке проекта
if (-not (Test-Path "frontend\patient-app")) {
    Write-Host "❌ Ошибка: Запустите скрипт из корневой папки проекта!" -ForegroundColor Red
    exit 1
}

# Переходим в папку patient-app
Set-Location "frontend\patient-app"

# Проверяем, установлены ли зависимости
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Установка зависимостей..." -ForegroundColor Cyan
    & cmd /c "npm install"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Ошибка установки зависимостей!" -ForegroundColor Red
        exit 1
    }
}

# Проверяем, не занят ли порт 3000
$portInUse = netstat -ano | findstr ":3000 "
if ($portInUse) {
    Write-Host "⚠️ Порт 3000 уже занят. Завершаем процесс..." -ForegroundColor Yellow
    $processId = ($portInUse -split '\s+')[-1]
    taskkill /PID $processId /F 2>$null
    Start-Sleep -Seconds 2
}

# Запускаем приложение в фоновом режиме
Write-Host "🚀 Запуск React приложения..." -ForegroundColor Cyan
Write-Host "📱 Приложение будет доступно по адресу: http://localhost:3000" -ForegroundColor White
Write-Host "🌐 Сетевой доступ: http://192.168.1.107:3000" -ForegroundColor White
Write-Host "⏹️ Для остановки нажмите Ctrl+C" -ForegroundColor Cyan

# Запускаем npm start в фоновом режиме
$process = Start-Process -FilePath "cmd" -ArgumentList "/c npm start" -WindowStyle Normal -PassThru

# Ждем немного для запуска
Start-Sleep -Seconds 10

# Проверяем, что приложение запустилось
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 10 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ React приложение запущено успешно!" -ForegroundColor Green
        exit 0
    }
} catch {
    Write-Host "❌ React приложение не запустилось или есть ошибки компиляции!" -ForegroundColor Red
    Write-Host "Проверьте логи выше для диагностики проблем." -ForegroundColor Yellow
    exit 1
} 