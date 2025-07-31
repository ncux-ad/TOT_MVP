# Скрипт установки Node.js для TOT проекта
# Запускать с правами администратора

Write-Host "🔧 Установка Node.js для TOT проекта..." -ForegroundColor Green

# Проверяем права администратора
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "❌ Этот скрипт требует прав администратора!" -ForegroundColor Red
    Write-Host "Запустите PowerShell от имени администратора и попробуйте снова." -ForegroundColor Yellow
    exit 1
}

# Проверяем, установлен ли уже Node.js
try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Host "✅ Node.js уже установлен: $nodeVersion" -ForegroundColor Green
        Write-Host "✅ npm уже установлен: $(npm --version)" -ForegroundColor Green
        exit 0
    }
} catch {
    Write-Host "Node.js не найден, продолжаем установку..." -ForegroundColor Yellow
}

# Устанавливаем Chocolatey (если не установлен)
Write-Host "📦 Устанавливаем Chocolatey..." -ForegroundColor Cyan
try {
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
    Write-Host "✅ Chocolatey установлен" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Ошибка установки Chocolatey: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "Попробуем установить Node.js напрямую..." -ForegroundColor Yellow
}

# Устанавливаем Node.js через Chocolatey
Write-Host "📦 Устанавливаем Node.js..." -ForegroundColor Cyan
try {
    choco install nodejs -y
    Write-Host "✅ Node.js установлен через Chocolatey" -ForegroundColor Green
} catch {
    Write-Host "❌ Ошибка установки через Chocolatey" -ForegroundColor Red
    Write-Host "Пожалуйста, установите Node.js вручную:" -ForegroundColor Yellow
    Write-Host "1. Перейдите на https://nodejs.org/" -ForegroundColor White
    Write-Host "2. Скачайте LTS версию" -ForegroundColor White
    Write-Host "3. Запустите установщик" -ForegroundColor White
    Write-Host "4. Перезапустите PowerShell" -ForegroundColor White
    exit 1
}

# Обновляем PATH
Write-Host "🔄 Обновляем переменные окружения..." -ForegroundColor Cyan
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Проверяем установку
Write-Host "✅ Проверяем установку..." -ForegroundColor Green
try {
    $nodeVersion = node --version
    $npmVersion = npm --version
    Write-Host "✅ Node.js установлен: $nodeVersion" -ForegroundColor Green
    Write-Host "✅ npm установлен: $npmVersion" -ForegroundColor Green
    
    Write-Host "`n🎉 Node.js успешно установлен!" -ForegroundColor Green
    Write-Host "Теперь можно запускать React приложение:" -ForegroundColor Yellow
    Write-Host "cd frontend/patient-app" -ForegroundColor White
    Write-Host "npm install" -ForegroundColor White
    Write-Host "npm start" -ForegroundColor White
} catch {
    Write-Host "❌ Ошибка проверки установки: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Попробуйте перезапустить PowerShell и проверить установку вручную." -ForegroundColor Yellow
} 