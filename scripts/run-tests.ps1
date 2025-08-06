#!/usr/bin/env pwsh
"""
@file: run-tests.ps1
@description: Скрипт для запуска тестов проекта ТОТ
@dependencies: Python, pytest, venv
@created: 2024-08-06
"""

Write-Host "🧪 Запуск тестов проекта ТОТ..." -ForegroundColor Green

# Активируем виртуальное окружение
if (Test-Path ".\venv\Scripts\Activate.ps1") {
    Write-Host "🔧 Активируем виртуальное окружение..." -ForegroundColor Yellow
    & .\venv\Scripts\Activate.ps1
} else {
    Write-Host "❌ Виртуальное окружение не найдено!" -ForegroundColor Red
    exit 1
}

# Устанавливаем тестовые зависимости
Write-Host "📦 Устанавливаем тестовые зависимости..." -ForegroundColor Yellow
pip install -r backend/api-gateway/requirements-test.txt
pip install -r backend/user-service/requirements-test.txt

# Функция для запуска тестов с отчетом
function Run-Tests {
    param(
        [string]$ServiceName,
        [string]$TestPath,
        [string]$ReportPath
    )
    
    Write-Host "🧪 Запускаем тесты $ServiceName..." -ForegroundColor Cyan
    
    # Создаем директорию для отчетов
    if (!(Test-Path ".\test-reports")) {
        New-Item -ItemType Directory -Path ".\test-reports" | Out-Null
    }
    
    # Запускаем тесты с покрытием
    $result = pytest $TestPath `
        --cov=$TestPath `
        --cov-report=html:test-reports/$ReportPath `
        --cov-report=term-missing `
        --verbose `
        --tb=short
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Тесты $ServiceName прошли успешно!" -ForegroundColor Green
    } else {
        Write-Host "❌ Тесты $ServiceName провалились!" -ForegroundColor Red
    }
    
    return $LASTEXITCODE
}

# Запускаем тесты API Gateway
$gatewayResult = Run-Tests -ServiceName "API Gateway" -TestPath "backend/api-gateway/tests" -ReportPath "api-gateway-coverage"

# Запускаем тесты User Service  
$userServiceResult = Run-Tests -ServiceName "User Service" -TestPath "backend/user-service/tests" -ReportPath "user-service-coverage"

# Общий результат
$totalResult = $gatewayResult + $userServiceResult

Write-Host "`n📊 РЕЗУЛЬТАТЫ ТЕСТИРОВАНИЯ:" -ForegroundColor Magenta
Write-Host "API Gateway: $(if ($gatewayResult -eq 0) { '✅ ПРОШЛИ' } else { '❌ ПРОВАЛИЛИСЬ' })" -ForegroundColor $(if ($gatewayResult -eq 0) { 'Green' } else { 'Red' })
Write-Host "User Service: $(if ($userServiceResult -eq 0) { '✅ ПРОШЛИ' } else { '❌ ПРОВАЛИЛИСЬ' })" -ForegroundColor $(if ($userServiceResult -eq 0) { 'Green' } else { 'Red' })

if ($totalResult -eq 0) {
    Write-Host "`n🎉 ВСЕ ТЕСТЫ ПРОШЛИ УСПЕШНО!" -ForegroundColor Green
    Write-Host "📁 Отчеты покрытия: .\test-reports\" -ForegroundColor Cyan
} else {
    Write-Host "`n⚠️ НЕКОТОРЫЕ ТЕСТЫ ПРОВАЛИЛИСЬ!" -ForegroundColor Yellow
    Write-Host "📁 Отчеты покрытия: .\test-reports\" -ForegroundColor Cyan
}

Write-Host "`n🔍 Для просмотра отчетов покрытия откройте:" -ForegroundColor Cyan
Write-Host "   .\test-reports\api-gateway-coverage\index.html" -ForegroundColor White
Write-Host "   .\test-reports\user-service-coverage\index.html" -ForegroundColor White
