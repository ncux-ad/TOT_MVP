# Скрипт для управления переменными окружения
# Запускать из корневой папки проекта

param(
    [string]$Action = "show",
    [string]$Key = "",
    [string]$Value = ""
)

$envFile = ".env"

function Show-EnvFile {
    Write-Host "📋 Содержимое .env файла:" -ForegroundColor Cyan
    if (Test-Path $envFile) {
        Get-Content $envFile | ForEach-Object {
            if ($_ -match "^([^#][^=]+)=(.*)$") {
                $key = $matches[1]
                $value = $matches[2]
                Write-Host "  $key = $value" -ForegroundColor Green
            } else {
                Write-Host "  $_" -ForegroundColor Gray
            }
        }
    } else {
        Write-Host "❌ Файл .env не найден!" -ForegroundColor Red
    }
}

function Set-EnvVariable {
    param([string]$Key, [string]$Value)
    
    if (-not (Test-Path $envFile)) {
        Write-Host "❌ Файл .env не найден!" -ForegroundColor Red
        return
    }
    
    $content = Get-Content $envFile
    $updated = $false
    
    for ($i = 0; $i -lt $content.Length; $i++) {
        if ($content[$i] -match "^$Key=") {
            $content[$i] = "$Key=$Value"
            $updated = $true
            break
        }
    }
    
    if (-not $updated) {
        $content += "$Key=$Value"
    }
    
    $content | Set-Content $envFile
    Write-Host "✅ Переменная $Key установлена в $Value" -ForegroundColor Green
}

function Test-EnvVariables {
    Write-Host "🔍 Тестирование переменных окружения..." -ForegroundColor Cyan
    
    # Загружаем переменные
    if (Test-Path $envFile) {
        Get-Content $envFile | ForEach-Object {
            if ($_ -match "^([^#][^=]+)=(.*)$") {
                $key = $matches[1]
                $value = $matches[2]
                [Environment]::SetEnvironmentVariable($key, $value, "Process")
            }
        }
    }
    
    # Проверяем ключевые переменные
    $requiredVars = @("DATABASE_URL", "JWT_SECRET", "JWT_ALGORITHM")
    
    foreach ($var in $requiredVars) {
        $value = [Environment]::GetEnvironmentVariable($var)
        if ($value) {
            Write-Host "✅ $var = $value" -ForegroundColor Green
        } else {
            Write-Host "❌ $var не установлена" -ForegroundColor Red
        }
    }
}

function Create-EnvTemplate {
    Write-Host "📝 Создание шаблона .env файла..." -ForegroundColor Cyan
    
    $template = @"
# Database - SQLite для локальной разработки
DATABASE_URL=sqlite:///./tot_mvp.db

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003

# Payment Systems - Российские платежные системы
# ЮKassa
YUKASSA_SHOP_ID=your-yookassa-shop-id
YUKASSA_SECRET_KEY=your-yookassa-secret-key

# СБП (Система быстрых платежей)
SBP_MERCHANT_ID=your-sbp-merchant-id
SBP_PRIVATE_KEY_PATH=/path/to/sbp/private/key.pem

# Notification Service
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number

# Firebase (для push-уведомлений)
FIREBASE_CREDENTIALS_PATH=/path/to/firebase-credentials.json

# Geo Service
GEOCODING_API_KEY=your-geocoding-api-key

# Monitoring
PROMETHEUS_PORT=9090
GRAFANA_PORT=3004

# Logging
LOG_LEVEL=INFO

# Development
DEBUG=true
ENVIRONMENT=development
"@
    
    $template | Set-Content $envFile
    Write-Host "✅ Шаблон .env файла создан!" -ForegroundColor Green
}

# Основная логика
switch ($Action.ToLower()) {
    "show" {
        Show-EnvFile
    }
    "set" {
        if ($Key -and $Value) {
            Set-EnvVariable -Key $Key -Value $Value
        } else {
            Write-Host "❌ Укажите ключ и значение: .\scripts\manage-env.ps1 -Action set -Key KEY -Value VALUE" -ForegroundColor Red
        }
    }
    "test" {
        Test-EnvVariables
    }
    "create" {
        Create-EnvTemplate
    }
    default {
        Write-Host "📋 Использование скрипта:" -ForegroundColor Cyan
        Write-Host "  .\scripts\manage-env.ps1 -Action show" -ForegroundColor White
        Write-Host "  .\scripts\manage-env.ps1 -Action set -Key DATABASE_URL -Value sqlite:///./tot_mvp.db" -ForegroundColor White
        Write-Host "  .\scripts\manage-env.ps1 -Action test" -ForegroundColor White
        Write-Host "  .\scripts\manage-env.ps1 -Action create" -ForegroundColor White
    }
} 