# Скрипт для запуска админ-панели ТОТ
Write-Host "🎛️ Запуск админ-панели ТОТ..." -ForegroundColor Cyan

# Переходим в директорию админ-панели
Set-Location "frontend\admin-panel"

# Проверяем, установлены ли зависимости
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Установка зависимостей..." -ForegroundColor Yellow
    & cmd /c "npm install"
}

# Проверяем, занят ли порт 3003
$portInUse = Get-NetTCPConnection -LocalPort 3003 -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "⚠️ Порт 3003 уже занят. Завершаем процесс..." -ForegroundColor Yellow
    $process = Get-Process -Id $portInUse.OwningProcess -ErrorAction SilentlyContinue
    if ($process) {
        $process.Kill()
        Start-Sleep -Seconds 2
    }
}

# Запускаем админ-панель
Write-Host "🚀 Запуск админ-панели..." -ForegroundColor Green
Write-Host "📱 Админ-панель будет доступна по адресу: http://localhost:3003" -ForegroundColor Green
Write-Host "🌐 Сетевой доступ: http://192.168.1.107:3003" -ForegroundColor Green
Write-Host "🔑 Демо данные для входа: admin@tot.ru / admin123" -ForegroundColor Yellow
Write-Host "⏹️ Для остановки нажмите Ctrl+C" -ForegroundColor Gray

# Запускаем в новом окне
Start-Process -FilePath "cmd" -ArgumentList "/c npm start" -WindowStyle Normal

Write-Host "✅ Админ-панель запущена!" -ForegroundColor Green 