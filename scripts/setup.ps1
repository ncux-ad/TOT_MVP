# Универсальный PowerShell скрипт установки для Windows
# TOT MVP - Твоя Точка Опоры

param(
    [switch]$UseWSL,
    [switch]$UseDocker,
    [switch]$LocalOnly
)

# Функции для вывода
function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

# Проверка системных требований
function Test-Requirements {
    Write-Info "Проверка системных требований..."
    
    # Проверка Python
    try {
        $pythonVersion = python --version 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Python найден: $pythonVersion"
        } else {
            Write-Error "Python не найден. Установите Python 3.8+"
            exit 1
        }
    } catch {
        Write-Error "Python не найден. Установите Python 3.8+"
        exit 1
    }
    
    # Проверка Node.js
    try {
        $nodeVersion = node --version 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Node.js найден: $nodeVersion"
        } else {
            Write-Warning "Node.js не найден. Frontend будет недоступен"
        }
    } catch {
        Write-Warning "Node.js не найден. Frontend будет недоступен"
    }
    
    # Проверка npm
    try {
        $npmVersion = npm --version 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Success "npm найден: $npmVersion"
        } else {
            Write-Warning "npm не найден. Frontend будет недоступен"
        }
    } catch {
        Write-Warning "npm не найден. Frontend будет недоступен"
    }
    
    # Проверка WSL
    if ($UseWSL) {
        try {
            $wslVersion = wsl --version 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Success "WSL найден: $wslVersion"
            } else {
                Write-Error "WSL не найден. Установите WSL2"
                exit 1
            }
        } catch {
            Write-Error "WSL не найден. Установите WSL2"
            exit 1
        }
    }
    
    # Проверка Docker
    if ($UseDocker -or -not $LocalOnly) {
        try {
            $dockerVersion = docker --version 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Success "Docker найден: $dockerVersion"
            } else {
                Write-Warning "Docker не найден. Контейнеризация будет недоступна"
            }
        } catch {
            Write-Warning "Docker не найден. Контейнеризация будет недоступна"
        }
    }
}

# Создание виртуального окружения
function Setup-PythonEnvironment {
    Write-Info "Настройка Python окружения..."
    
    if (-not (Test-Path "venv")) {
        Write-Info "Создание виртуального окружения..."
        python -m venv venv
        Write-Success "Виртуальное окружение создано"
    }
    
    # Активация виртуального окружения
    & ".\venv\Scripts\Activate.ps1"
    
    # Обновление pip
    Write-Info "Обновление pip..."
    python -m pip install --upgrade pip
    
    # Установка зависимостей
    Write-Info "Установка Python зависимостей..."
    pip install -r requirements.txt
    
    Write-Success "Python окружение настроено"
}

# Настройка Node.js окружения
function Setup-NodeEnvironment {
    try {
        $nodeVersion = node --version 2>&1
        $npmVersion = npm --version 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Info "Настройка Node.js окружения..."
            npm install
            Write-Success "Node.js окружение настроено"
        }
    } catch {
        Write-Warning "Node.js не найден, пропускаем настройку frontend"
    }
}

# Настройка Docker
function Setup-Docker {
    try {
        $dockerVersion = docker --version 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Info "Настройка Docker..."
            
            # Создание .env файла из примера
            if (-not (Test-Path ".env") -and (Test-Path "env.example")) {
                Copy-Item "env.example" ".env"
                Write-Success "Файл .env создан из env.example"
            }
            
            Write-Success "Docker настроен"
        }
    } catch {
        Write-Warning "Docker не найден, пропускаем настройку контейнеров"
    }
}

# Создание директорий
function Create-Directories {
    Write-Info "Создание директорий..."
    
    $directories = @(
        "backend/api-gateway",
        "backend/user-service",
        "backend/profile-service",
        "backend/booking-service",
        "backend/geo-service",
        "backend/payment-service",
        "backend/notification-service",
        "backend/chat-service",
        "backend/rating-service",
        "backend/event-service",
        "backend/emergency-service",
        "backend/security-service",
        "frontend/patient-app",
        "frontend/doctor-app",
        "frontend/clinic-web",
        "frontend/admin-panel",
        "docs",
        "scripts",
        "logs",
        "data"
    )
    
    foreach ($dir in $directories) {
        if (-not (Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
            Write-Success "Создана директория: $dir"
        }
    }
}

# Создание скриптов запуска для Windows
function Create-WindowsScripts {
    Write-Info "Создание скриптов запуска для Windows..."
    
    # Скрипт запуска для Windows
    $startScript = @"
# Скрипт запуска TOT MVP для Windows

Write-Host "🚀 Запуск TOT MVP..." -ForegroundColor Green

# Активация виртуального окружения
& ".\venv\Scripts\Activate.ps1"

# Проверка Docker
try {
    docker --version | Out-Null
    Write-Host "🐳 Запуск через Docker..." -ForegroundColor Blue
    docker-compose up -d
} catch {
    Write-Host "🐍 Запуск локально..." -ForegroundColor Blue
    Start-Process -FilePath "python" -ArgumentList "backend/api-gateway/main.py" -WindowStyle Hidden
    Start-Process -FilePath "python" -ArgumentList "backend/user-service/main.py" -WindowStyle Hidden
    Start-Process -FilePath "python" -ArgumentList "backend/profile-service/main.py" -WindowStyle Hidden
    Start-Process -FilePath "python" -ArgumentList "backend/booking-service/main.py" -WindowStyle Hidden
    Start-Process -FilePath "python" -ArgumentList "backend/geo-service/main.py" -WindowStyle Hidden
    Start-Process -FilePath "python" -ArgumentList "backend/payment-service/main.py" -WindowStyle Hidden
    Start-Process -FilePath "python" -ArgumentList "backend/notification-service/main.py" -WindowStyle Hidden
    Write-Host "✅ Сервисы запущены" -ForegroundColor Green
}

Write-Host "🌐 API Gateway доступен на http://localhost:8000" -ForegroundColor Green
Write-Host "📊 Swagger UI: http://localhost:8000/docs" -ForegroundColor Green
"@
    
    Set-Content -Path "start.ps1" -Value $startScript
    Write-Success "Создан скрипт start.ps1"
    
    # Скрипт остановки
    $stopScript = @"
# Скрипт остановки TOT MVP для Windows

Write-Host "🛑 Остановка TOT MVP..." -ForegroundColor Yellow

try {
    docker --version | Out-Null
    docker-compose down
} catch {
    Get-Process -Name "python" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*main.py*" } | Stop-Process -Force
}

Write-Host "✅ Сервисы остановлены" -ForegroundColor Green
"@
    
    Set-Content -Path "stop.ps1" -Value $stopScript
    Write-Success "Создан скрипт stop.ps1"
    
    # Скрипт проверки статуса
    $statusScript = @"
# Скрипт проверки статуса TOT MVP для Windows

Write-Host "📊 Статус TOT MVP..." -ForegroundColor Blue

try {
    docker --version | Out-Null
    docker-compose ps
} catch {
    Write-Host "Процессы Python:" -ForegroundColor Blue
    Get-Process -Name "python" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*main.py*" } | Format-Table -AutoSize
}

Write-Host ""
Write-Host "Проверка API:" -ForegroundColor Blue
try {
    Invoke-RestMethod -Uri "http://localhost:8000/health" -Method Get
} catch {
    Write-Host "API Gateway недоступен" -ForegroundColor Red
}
"@
    
    Set-Content -Path "status.ps1" -Value $statusScript
    Write-Success "Создан скрипт status.ps1"
}

# Создание WSL скрипта
function Create-WSLScript {
    if ($UseWSL) {
        Write-Info "Создание WSL скрипта..."
        
        $wslScript = @"
#!/bin/bash
# WSL скрипт для TOT MVP

echo "🚀 Запуск TOT MVP в WSL..."

# Переход в директорию проекта
cd /mnt/c/Users/$env:USERNAME/OneDrive/Projects/TOT_MVP

# Активация виртуального окружения
source venv/bin/activate

# Запуск сервисов
python backend/api-gateway/main.py &
python backend/user-service/main.py &
python backend/profile-service/main.py &
python backend/booking-service/main.py &
python backend/geo-service/main.py &
python backend/payment-service/main.py &
python backend/notification-service/main.py &

echo "✅ Сервисы запущены в WSL"
echo "🌐 API Gateway доступен на http://localhost:8000"
"@
        
        Set-Content -Path "start-wsl.sh" -Value $wslScript
        Write-Success "Создан скрипт start-wsl.sh для WSL"
    }
}

# Основная функция
function Main {
    Write-Host "🚀 Настройка проекта TOT MVP для Windows" -ForegroundColor Green
    Write-Host "================================================" -ForegroundColor Green
    
    if ($UseWSL) {
        Write-Host "🔧 Режим: WSL (Ubuntu)" -ForegroundColor Yellow
    } elseif ($UseDocker) {
        Write-Host "🐳 Режим: Docker" -ForegroundColor Yellow
    } elseif ($LocalOnly) {
        Write-Host "🐍 Режим: Локальный Python" -ForegroundColor Yellow
    } else {
        Write-Host "🔄 Режим: Автоопределение" -ForegroundColor Yellow
    }
    
    Test-Requirements
    Create-Directories
    Setup-PythonEnvironment
    Setup-NodeEnvironment
    Setup-Docker
    Create-WindowsScripts
    Create-WSLScript
    
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Green
    Write-Success "Настройка завершена успешно!"
    Write-Host ""
    Write-Host "📋 Следующие шаги:" -ForegroundColor Yellow
    Write-Host "1. Отредактируйте файл .env с вашими настройками"
    Write-Host "2. Запустите проект: .\start.ps1"
    Write-Host "3. Проверьте статус: .\status.ps1"
    Write-Host "4. Остановите проект: .\stop.ps1"
    
    if ($UseWSL) {
        Write-Host "5. Или запустите в WSL: wsl ./start-wsl.sh"
    }
    
    Write-Host ""
    Write-Host "📚 Документация:" -ForegroundColor Yellow
    Write-Host "- README.md - общая информация"
    Write-Host "- docs/ARCHITECTURE.md - архитектура системы"
    Write-Host "- docs/DEPLOYMENT.md - инструкции по развертыванию"
    Write-Host ""
    Write-Host "🌐 API будет доступен на http://localhost:8000" -ForegroundColor Green
    Write-Host "📊 Swagger UI: http://localhost:8000/docs" -ForegroundColor Green
}

# Запуск основной функции
Main 