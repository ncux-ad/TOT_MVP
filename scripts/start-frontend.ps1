# Скрипт запуска Frontend приложения для TOT проекта
# Запускать из корневой папки проекта

Write-Host "🎨 Запуск Frontend приложения ТОТ..." -ForegroundColor Green

# Проверяем, что мы в корневой папке проекта
if (-not (Test-Path "frontend")) {
    Write-Host "❌ Ошибка: Запустите скрипт из корневой папки проекта!" -ForegroundColor Red
    exit 1
}

# Проверяем, что папка patient-app существует
if (-not (Test-Path "frontend\patient-app")) {
    Write-Host "❌ Ошибка: Папка frontend\patient-app не найдена!" -ForegroundColor Red
    exit 1
}

# Проверяем, что Node.js установлен
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js найден: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js не найден!" -ForegroundColor Red
    Write-Host "Установите Node.js: .\scripts\install-nodejs.ps1" -ForegroundColor Yellow
    exit 1
}

# Проверяем, что npm установлен
try {
    $npmVersion = npm --version
    Write-Host "✅ npm найден: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm не найден!" -ForegroundColor Red
    exit 1
}

# Переходим в папку patient-app
Set-Location "frontend\patient-app"
Write-Host "📁 Переход в папку: $(Get-Location)" -ForegroundColor Cyan

# Проверяем, что package.json существует
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Ошибка: package.json не найден!" -ForegroundColor Red
    exit 1
}

# Проверяем, что node_modules существует
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Установка зависимостей..." -ForegroundColor Cyan
    try {
        npm install
        Write-Host "✅ Зависимости установлены" -ForegroundColor Green
    } catch {
        Write-Host "❌ Ошибка установки зависимостей!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Зависимости уже установлены" -ForegroundColor Green
}

# Проверяем, не занят ли порт 3000
Write-Host "🔍 Проверка порта 3000..." -ForegroundColor Cyan
$portInUse = netstat -ano | findstr ":3000 "
if ($portInUse) {
    Write-Host "⚠️ Порт 3000 уже занят. Завершаем процесс..." -ForegroundColor Yellow
    $processId = ($portInUse -split '\s+')[-1]
    taskkill /PID $processId /F 2>$null
    Start-Sleep -Seconds 2
}

# Запускаем React приложение
Write-Host "🚀 Запуск React приложения..." -ForegroundColor Cyan
Write-Host "📱 Приложение откроется в браузере: http://localhost:3000" -ForegroundColor Green

try {
    # Запускаем в новом окне PowerShell
    Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "npm start" -WorkingDirectory (Get-Location)
    Write-Host "✅ React приложение запущено!" -ForegroundColor Green
    Write-Host "`n🌐 Доступные URL:" -ForegroundColor Cyan
    Write-Host "• Локальный: http://localhost:3000" -ForegroundColor White
    Write-Host "• Сеть: http://192.168.1.107:3000" -ForegroundColor White
    Write-Host "`n📱 Демо аккаунт:" -ForegroundColor Cyan
Write-Host "• Email: patient@example.com" -ForegroundColor White
Write-Host "• Пароль: password123" -ForegroundColor White

# Возвращаемся в корневую папку
Set-Location "..\.."

# Возвращаем успешный код выхода
exit 0
} catch {
    Write-Host "❌ Ошибка запуска React приложения!" -ForegroundColor Red
    Write-Host "Попробуйте запустить вручную: npm start" -ForegroundColor Yellow
    
    # Возвращаемся в корневую папку
    Set-Location "..\.."
    exit 1
} 