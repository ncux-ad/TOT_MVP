# Скрипт для запуска Patient App
Write-Host "🎨 Запуск Patient App..." -ForegroundColor Cyan

# Переходим в директорию Patient App
Set-Location "$PSScriptRoot\..\frontend\patient-app"

# Проверяем, установлены ли зависимости
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Установка зависимостей..." -ForegroundColor Yellow
    & "$env:ProgramFiles\nodejs\npx.cmd" --yes npm install
}

# Запускаем приложение
Write-Host "🚀 Запуск React приложения..." -ForegroundColor Green
Write-Host "📱 Приложение будет доступно по адресу: http://localhost:3000" -ForegroundColor Green
Write-Host "⏹️ Для остановки нажмите Ctrl+C" -ForegroundColor Gray

& "$env:ProgramFiles\nodejs\npx.cmd" --yes react-scripts start