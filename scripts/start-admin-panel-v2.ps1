#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Запуск новой админ-панели ТОТ (версия 2.0)
.DESCRIPTION
    Запускает админ-панель на порту 3003 с учётом всех извлечённых уроков
.EXAMPLE
    .\scripts\start-admin-panel-v2.ps1
#>

Write-Host "🎛️ Запуск новой Admin Panel (v2.0)..." -ForegroundColor Green

# Проверяем, что мы в корневой папке проекта
if (-not (Test-Path "frontend/admin-panel")) {
    Write-Error "❌ Папка frontend/admin-panel не найдена. Запустите скрипт из корня проекта."
    exit 1
}

# Переходим в папку админ-панели
Set-Location "frontend/admin-panel"

# Проверяем наличие node_modules
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Устанавливаем зависимости..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Error "❌ Ошибка установки зависимостей"
        exit 1
    }
}

Write-Host "🚀 Запуск React приложения..." -ForegroundColor Cyan
Write-Host "📱 Приложение будет доступно по адресу: http://localhost:3003" -ForegroundColor Green
Write-Host "⏹️ Для остановки нажмите Ctrl+C" -ForegroundColor Yellow

# Запускаем с правильной командой для Windows
npm start