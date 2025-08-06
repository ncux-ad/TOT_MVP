# Скрипт для запуска Admin Panel
Write-Host "🎛️ Запуск Admin Panel..." -ForegroundColor Cyan

# Переходим в директорию Admin Panel
Set-Location "$PSScriptRoot\..\frontend\admin-panel"

# Проверяем, установлены ли зависимости
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Установка зависимостей..." -ForegroundColor Yellow
    & "$env:ProgramFiles\nodejs\npx.cmd" --yes npm install
}

# Запускаем приложение
Write-Host "🚀 Запуск Vite приложения..." -ForegroundColor Green
Write-Host "📱 Приложение будет доступно по адресу: http://localhost:3003" -ForegroundColor Green
Write-Host "⏹️ Для остановки нажмите Ctrl+C" -ForegroundColor Gray

& "$env:ProgramFiles\nodejs\npx.cmd" --yes npm run dev