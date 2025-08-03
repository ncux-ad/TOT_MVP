# Скрипт установки Flutter для Windows
# Запускать от имени администратора

Write-Host "🚀 Установка Flutter SDK для проекта ТОТ..." -ForegroundColor Green

# Проверяем, что мы в корневой папке проекта
if (-not (Test-Path "backend")) {
    Write-Host "❌ Ошибка: Запустите скрипт из корневой папки проекта!" -ForegroundColor Red
    exit 1
}

# Создаем папку для Flutter
$flutterPath = "C:\flutter"
if (-not (Test-Path $flutterPath)) {
    Write-Host "📁 Создание папки для Flutter..." -ForegroundColor Cyan
    New-Item -ItemType Directory -Path $flutterPath -Force
}

# Скачиваем Flutter SDK
Write-Host "⬇️ Скачивание Flutter SDK..." -ForegroundColor Cyan
$flutterUrl = "https://storage.googleapis.com/flutter_infra_release/releases/stable/windows/flutter_windows_3.19.3-stable.zip"
$flutterZip = "$env:TEMP\flutter.zip"

try {
    Invoke-WebRequest -Uri $flutterUrl -OutFile $flutterZip
    Write-Host "✅ Flutter SDK скачан" -ForegroundColor Green
} catch {
    Write-Host "❌ Ошибка скачивания Flutter SDK: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Распаковываем Flutter
Write-Host "📦 Распаковка Flutter SDK..." -ForegroundColor Cyan
try {
    Expand-Archive -Path $flutterZip -DestinationPath "C:\" -Force
    Write-Host "✅ Flutter SDK распакован" -ForegroundColor Green
} catch {
    Write-Host "❌ Ошибка распаковки Flutter SDK: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Добавляем Flutter в PATH
Write-Host "🔧 Добавление Flutter в PATH..." -ForegroundColor Cyan
$flutterBinPath = "$flutterPath\bin"
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")

if ($currentPath -notlike "*$flutterBinPath*") {
    $newPath = "$currentPath;$flutterBinPath"
    [Environment]::SetEnvironmentVariable("PATH", $newPath, "User")
    Write-Host "✅ Flutter добавлен в PATH" -ForegroundColor Green
} else {
    Write-Host "ℹ️ Flutter уже добавлен в PATH" -ForegroundColor Yellow
}

# Обновляем переменные окружения в текущей сессии
$env:PATH = [Environment]::GetEnvironmentVariable("PATH", "User") + ";" + [Environment]::GetEnvironmentVariable("PATH", "Machine")

# Проверяем установку
Write-Host "🔍 Проверка установки Flutter..." -ForegroundColor Cyan
try {
    $flutterVersion = & "$flutterBinPath\flutter.bat" --version
    Write-Host "✅ Flutter установлен успешно:" -ForegroundColor Green
    Write-Host $flutterVersion -ForegroundColor White
} catch {
    Write-Host "❌ Ошибка проверки Flutter: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Запускаем flutter doctor
Write-Host "🏥 Запуск flutter doctor..." -ForegroundColor Cyan
try {
    & "$flutterBinPath\flutter.bat" doctor
    Write-Host "✅ Flutter doctor завершен" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Предупреждение: flutter doctor завершился с ошибками" -ForegroundColor Yellow
}

# Создаем Flutter проект
Write-Host "📱 Создание Flutter проекта..." -ForegroundColor Cyan
if (Test-Path "mobile-app\tot_mobile_app") {
    Write-Host "ℹ️ Flutter проект уже существует" -ForegroundColor Yellow
} else {
    try {
        Set-Location "mobile-app"
        & "$flutterBinPath\flutter.bat" create tot_mobile_app --org com.tot.mvp
        Write-Host "✅ Flutter проект создан" -ForegroundColor Green
        Set-Location ".."
    } catch {
        Write-Host "❌ Ошибка создания Flutter проекта: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n🎉 Установка Flutter завершена!" -ForegroundColor Green
Write-Host "`n📚 Следующие шаги:" -ForegroundColor Cyan
Write-Host "1. Установите Android Studio или VS Code с Flutter плагином" -ForegroundColor White
Write-Host "2. Настройте эмулятор Android или подключите физическое устройство" -ForegroundColor White
Write-Host "3. Перейдите в папку mobile-app/tot_mobile_app" -ForegroundColor White
Write-Host "4. Запустите: flutter run" -ForegroundColor White
Write-Host "`n📖 Документация: https://docs.flutter.dev/get-started" -ForegroundColor Cyan

exit 0 